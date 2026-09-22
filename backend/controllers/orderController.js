const Order = require("../models/Order");
const Product = require("../models/Product");
const Counter = require("../models/Counter");
const generateInvoicePDF = require("../utils/generateInvoice");
const Customer = require("../models/Customer");
const mongoose = require("mongoose");

// Admin-only account history. Match by account ID, never by shipping name/email.
exports.getCustomerOrders = async (req, res) => {
  try {
    if (!mongoose.isObjectIdOrHexString(req.params.customerId)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    const customer = await Customer.findById(req.params.customerId).select("name email phone createdAt");
    if (!customer) return res.status(404).json({ message: "Customer account not found" });
    const orders = await Order.find({ customerAccount: customer._id }).sort({ createdAt: -1, _id: -1 });
    res.json({ customer, orders });
  } catch (err) {
    res.status(500).json({ message: "Could not load customer order history" });
  }
};

const SHIPPING_FLAT_FEE = 60; // customize per your logistics partner
const FREE_SHIPPING_ABOVE = 999;
const COD_FEE = 30;

// POST /api/orders  (requires a signed-in customer - see protectCustomer middleware)
exports.placeOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod } = req.body;
    const customerAccount = req.customer._id;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let itemsTotal = 0;
    const orderItems = [];

    // Validate every item against live product data: stock, min/max qty, active status
    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product no longer available: ${cartItem.name || cartItem.productId}` });
      }
      if (product.outOfStock || product.stock <= 0) {
        return res.status(400).json({ message: `${product.name} is currently out of stock` });
      }
      if (cartItem.quantity < product.minOrderQty) {
        return res.status(400).json({
          message: `Minimum order quantity for ${product.name} is ${product.minOrderQty}`,
        });
      }
      if (cartItem.quantity > product.maxOrderQty) {
        return res.status(400).json({
          message: `Maximum order quantity for ${product.name} is ${product.maxOrderQty}`,
        });
      }
      if (cartItem.quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} unit(s) of ${product.name} left in stock`,
        });
      }

      const lineTotal = product.sellingPrice * cartItem.quantity;
      itemsTotal += lineTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        quantity: cartItem.quantity,
        price: product.sellingPrice,
        personalization: cartItem.personalization || {},
      });
    }

    // Atomically decrement stock for all items
    const decrementedItems = [];
    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity }, isActive: true },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Rollback any stock already decremented in this request
        for (const dec of decrementedItems) {
          await Product.findByIdAndUpdate(dec.productId, {
            $inc: { stock: dec.quantity },
            $set: { outOfStock: false },
          });
        }
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Please adjust your cart.`,
        });
      }

      if (updatedProduct.stock <= 0 && !updatedProduct.outOfStock) {
        await Product.findByIdAndUpdate(item.product, { outOfStock: true });
      }

      decrementedItems.push({ productId: item.product, quantity: item.quantity });
    }

    try {
      const shippingFee = itemsTotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FLAT_FEE;
      const codFee = paymentMethod === "COD" || !paymentMethod ? COD_FEE : 0;
      const grandTotal = itemsTotal + shippingFee + codFee;

      const order = await Order.create({
        customerAccount,
        customer,
        items: orderItems,
        itemsTotal,
        shippingFee,
        codFee,
        grandTotal,
        paymentMethod: paymentMethod || "COD",
      });

      res.status(201).json(order);
    } catch (createErr) {
      // Rollback stock decrements if order creation fails
      for (const dec of decrementedItems) {
        await Product.findByIdAndUpdate(dec.productId, {
          $inc: { stock: dec.quantity },
          $set: { outOfStock: false },
        });
      }
      throw createErr;
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/orders/track/:orderNumber  (public - customer order tracking, no auth)
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).select(
      "-notes"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders  (admin - list all orders, filter by status)
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { archivedAt: req.query.archived === "true" ? { $ne: null } : null };
    if (status) query.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(query),
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id  (admin)
exports.setOrderArchived = async (req, res) => {
  try {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    if (typeof req.body.archived !== "boolean") {
      return res.status(400).json({ message: "archived must be true or false" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id,
      { $set: { archivedAt: req.body.archived ? new Date() : null } },
      { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Could not update removed order" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/orders/:id/status  (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.statusHistory.push({ status, note: note || "", changedAt: new Date() });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/orders/:id/invoice  (admin - generates invoice number once, streams PDF)
exports.getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.invoiceNumber) {
      const seq = await Counter.getNextSequence("invoice");
      order.invoiceNumber = `GA-INV-${String(seq).padStart(6, "0")}`;
      order.invoiceGeneratedAt = new Date();
      await order.save();
    }

    generateInvoicePDF(order, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/stats/summary (admin dashboard numbers)
exports.getStats = async (req, res) => {
  try {
    const [totalOrders, pendingOrders, deliveredOrders, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["placed", "confirmed", "processing", "shipped"] } }),
      Order.countDocuments({ status: "delivered" }),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),
    ]);
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5, $gt: 0 }, isActive: true });
    const outOfStockCount = await Product.countDocuments({ outOfStock: true, isActive: true });

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      lowStockCount,
      outOfStockCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

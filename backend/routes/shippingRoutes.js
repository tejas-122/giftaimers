const router = require("express").Router();
const ShippingQuote = require("../models/ShippingQuote");
const Product = require("../models/Product");
const { protectCustomer } = require("../middleware/customerAuth");
const { protectAdmin } = require("../middleware/auth");
const { pin, fingerprint } = require("../utils/shipping");
const validateOptions = require("../utils/productOptions");
router.post("/quote", protectCustomer, async (req, res) => {
  try {
    const { customer, items } = req.body;
    pin(customer?.pincode);
    for (const field of ["name", "phone", "address", "city", "state"]) if (!String(customer?.[field] || "").trim()) throw new Error("Complete your delivery address first");
    if (!Array.isArray(items) || !items.length || items.length > 100) throw new Error("Add products to your cart first (maximum 100 lines)");
    const snapshot = [];
    for (const item of items) {
      const p = await Product.findById(item.productId);
      if (!p || !p.isActive || p.outOfStock) throw new Error("A cart product is no longer available");
      if (!Number.isInteger(item.quantity) || item.quantity < p.minOrderQty || item.quantity > Math.min(p.maxOrderQty, p.stock)) throw new Error(`Check the quantity for ${p.name}`);
      validateOptions(p, item.selectedOptions || {});
      snapshot.push({ ...item, name: p.name, weightGrams: p.weightGrams, specifications: p.specifications });
    }
    const key = fingerprint(customer, items);
    const existing = await ShippingQuote.findOne({ customerAccount: req.customer._id, fingerprint: key, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
    if (existing) return res.json(existing);
    const quote = await ShippingQuote.create({ customerAccount: req.customer._id, customer, items: snapshot, fingerprint: key, expiresAt: new Date(Date.now() + 7 * 86400000) });
    res.status(201).json(quote);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.get("/quotes", protectAdmin, async (req, res) => {
  try { res.json(await ShippingQuote.find({ expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).limit(200)); }
  catch { res.status(500).json({ message: "Could not load shipping quotes" }); }
});
router.patch("/quotes/:id", protectAdmin, async (req, res) => {
  try {
    const fee = req.body.fee;
    if (typeof fee !== "number" || !Number.isFinite(fee) || fee < 0 || fee > 100000 || Math.abs(fee * 100 - Math.round(fee * 100)) > 0.00001) throw new Error("Enter a valid courier charge with up to two decimal places");
    // Once issued, a quote is fixed so a customer's accepted amount cannot change.
    const quote = await ShippingQuote.findOneAndUpdate({ _id: req.params.id, fee: null, expiresAt: { $gt: new Date() } }, { $set: { fee } }, { new: true, runValidators: true });
    if (!quote) return res.status(409).json({ message: "Quote already issued or expired" });
    res.json(quote);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
module.exports = router;

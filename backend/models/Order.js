const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // unit selling price at time of order
    personalization: { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. { "Name to engrave": "Riya" }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true }, // GA-ORD-000123
    invoiceNumber: { type: String, unique: true, sparse: true }, // GA-INV-000123, set on generation

    // The signed-in account that placed this order (checkout requires login)
    customerAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true },

    // Shipping/contact details entered at checkout - kept separate from the
    // account itself since a customer might ship to a different name/address
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    items: [orderItemSchema],

    itemsTotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    codFee: { type: Number, default: 0 },
    discountApplied: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

    status: {
      type: String,
      enum: ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed",
      index: true,
    },
    statusHistory: [
      {
        status: String,
        note: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],

    notes: { type: String, default: "" }, // internal admin notes
    archivedAt: { type: Date, default: null }, // removed from the active admin list
    invoiceGeneratedAt: { type: Date },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const Counter = require("./Counter");
    const seq = await Counter.getNextSequence("order");
    this.orderNumber = `GA-ORD-${String(seq).padStart(6, "0")}`;
    this.statusHistory.push({ status: "placed", note: "Order placed by customer" });
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);

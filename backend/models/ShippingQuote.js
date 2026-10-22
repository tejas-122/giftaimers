const mongoose = require("mongoose");
module.exports = mongoose.model("ShippingQuote", new mongoose.Schema({
  customerAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  fingerprint: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.Mixed, required: true },
  items: { type: [mongoose.Schema.Types.Mixed], required: true },
  fee: { type: Number, min: 0, default: null },
  expiresAt: { type: Date, required: true },
}, { timestamps: true }));

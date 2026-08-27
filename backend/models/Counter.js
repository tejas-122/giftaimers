const mongoose = require("mongoose");

// Used to generate sequential, human-friendly order & invoice numbers
// e.g. GA-ORD-000123, GA-INV-000123
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.statics.getNextSequence = async function (name) {
  const result = await this.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
};

module.exports = mongoose.model("Counter", counterSchema);

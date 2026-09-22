const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    images: [{ type: String, required: true }], // URLs (Cloudinary)
    model3d: { type: String, default: "" }, // optional .glb URL for real 3D model viewer

    price: { type: Number, required: true, min: 0 }, // MRP
    discountPercent: { type: Number, default: 0, min: 0, max: 90 },
    // sellingPrice is derived but stored for fast querying/sorting
    sellingPrice: { type: Number, required: true, min: 0 },

    offerTag: { type: String, default: "" }, // e.g. "Bestseller", "Limited Edition"
    isPersonalized: { type: Boolean, default: true },
    personalizationFields: [
      {
        label: { type: String }, // e.g. "Name to engrave"
        type: { type: String, enum: ["text", "textarea", "image", "date", "number"], default: "text" },
        required: { type: Boolean, default: true },
        maxLength: { type: Number, default: 50 },
      },
    ],

    stock: { type: Number, required: true, default: 0, min: 0 },
    outOfStock: { type: Boolean, default: false },
    minOrderQty: { type: Number, default: 1, min: 1 },
    maxOrderQty: { type: Number, default: 10, min: 1 },

    sku: { type: String, unique: true, sparse: true },
    tags: [{ type: String }],
    weightGrams: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }, // soft delete / hide from store
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Keep outOfStock and sellingPrice in sync whenever a product is saved
productSchema.pre("validate", function (next) {
  if (this.stock <= 0) this.outOfStock = true;
  else if (this.isModified("stock") && this.stock > 0) this.outOfStock = false;

  const discount = this.discountPercent || 0;
  this.sellingPrice = Math.round(this.price - (this.price * discount) / 100);
  next();
});

productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);

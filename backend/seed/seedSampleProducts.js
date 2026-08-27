require("dotenv").config();
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Product = require("../models/Product");

const withSellingPrice = (product) => ({
  ...product,
  sellingPrice: Math.round(product.price - (product.price * (product.discountPercent || 0)) / 100),
});

const products = [
  {
    name: "Personalized LED Photo Frame",
    slug: "personalized-led-photo-frame",
    description:
      "A warm LED acrylic photo frame customized with a favorite picture and short message.",
    category: "Photo Gifts",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80",
    ],
    price: 1499,
    discountPercent: 20,
    offerTag: "Bestseller",
    personalizationFields: [
      { label: "Message for frame", type: "text", required: true, maxLength: 40 },
      { label: "Upload photo", type: "image", required: true, maxLength: 50 },
    ],
    stock: 24,
    minOrderQty: 1,
    maxOrderQty: 5,
    sku: "GA-PHOTO-LED-001",
    tags: ["photo", "anniversary", "birthday", "led"],
    weightGrams: 650,
    isFeatured: true,
    rating: 4.8,
    numReviews: 46,
  },
  {
    name: "Engraved Wooden Name Plate",
    slug: "engraved-wooden-name-plate",
    description:
      "Premium wooden desk or door name plate with clean laser engraving and gift packaging.",
    category: "Engraved Gifts",
    images: [
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    ],
    price: 899,
    discountPercent: 10,
    offerTag: "New",
    personalizationFields: [
      { label: "Name to engrave", type: "text", required: true, maxLength: 30 },
      { label: "Subtitle", type: "text", required: false, maxLength: 35 },
    ],
    stock: 38,
    minOrderQty: 1,
    maxOrderQty: 10,
    sku: "GA-ENG-WOOD-002",
    tags: ["wood", "office", "home", "engraved"],
    weightGrams: 420,
    isFeatured: true,
    rating: 4.6,
    numReviews: 28,
  },
  {
    name: "Custom Couple Mug Set",
    slug: "custom-couple-mug-set",
    description:
      "Two ceramic mugs printed with names, date, and a sweet matching design.",
    category: "Mugs",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
    ],
    price: 799,
    discountPercent: 15,
    offerTag: "Couple Gift",
    personalizationFields: [
      { label: "Name 1", type: "text", required: true, maxLength: 20 },
      { label: "Name 2", type: "text", required: true, maxLength: 20 },
      { label: "Special date", type: "date", required: false, maxLength: 50 },
    ],
    stock: 56,
    minOrderQty: 1,
    maxOrderQty: 12,
    sku: "GA-MUG-COUPLE-003",
    tags: ["mug", "couple", "anniversary", "ceramic"],
    weightGrams: 720,
    isFeatured: true,
    rating: 4.7,
    numReviews: 64,
  },
  {
    name: "Personalized Birthday Gift Box",
    slug: "personalized-birthday-gift-box",
    description:
      "A curated birthday box with a custom note, keepsake card, chocolates, and decorative wrap.",
    category: "Gift Boxes",
    images: [
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80",
    ],
    price: 1999,
    discountPercent: 18,
    offerTag: "Limited",
    personalizationFields: [
      { label: "Recipient name", type: "text", required: true, maxLength: 25 },
      { label: "Gift note", type: "textarea", required: true, maxLength: 160 },
    ],
    stock: 18,
    minOrderQty: 1,
    maxOrderQty: 4,
    sku: "GA-BOX-BDAY-004",
    tags: ["birthday", "gift box", "chocolate", "personalized"],
    weightGrams: 1100,
    isFeatured: true,
    rating: 4.9,
    numReviews: 39,
  },
  {
    name: "Custom Acrylic Keychain",
    slug: "custom-acrylic-keychain",
    description:
      "Lightweight acrylic keychain personalized with initials, name, or a mini photo.",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80",
    ],
    price: 299,
    discountPercent: 0,
    offerTag: "Under Rs. 299",
    personalizationFields: [
      { label: "Name or initials", type: "text", required: true, maxLength: 18 },
    ],
    stock: 120,
    minOrderQty: 2,
    maxOrderQty: 50,
    sku: "GA-ACC-KEY-005",
    tags: ["keychain", "return gift", "acrylic"],
    weightGrams: 80,
    isFeatured: false,
    rating: 4.4,
    numReviews: 18,
  },
  {
    name: "Personalized Desk Calendar",
    slug: "personalized-desk-calendar",
    description:
      "A custom desk calendar with 12 photos, birthdays, anniversaries, and personal reminders.",
    category: "Stationery",
    images: [
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80",
    ],
    price: 1199,
    discountPercent: 12,
    offerTag: "2026 Edit",
    personalizationFields: [
      { label: "Cover title", type: "text", required: true, maxLength: 35 },
      { label: "Important dates", type: "textarea", required: false, maxLength: 200 },
    ],
    stock: 31,
    minOrderQty: 1,
    maxOrderQty: 8,
    sku: "GA-STAT-CAL-006",
    tags: ["calendar", "photos", "desk", "stationery"],
    weightGrams: 500,
    isFeatured: false,
    rating: 4.5,
    numReviews: 22,
  },
  {
    name: "Engraved Metal Wallet Card",
    slug: "engraved-metal-wallet-card",
    description:
      "A sleek wallet-sized metal card engraved with a heartfelt message for everyday keepsake value.",
    category: "Engraved Gifts",
    images: [
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
    ],
    price: 699,
    discountPercent: 10,
    offerTag: "Premium",
    personalizationFields: [
      { label: "Engraving message", type: "textarea", required: true, maxLength: 180 },
    ],
    stock: 45,
    minOrderQty: 1,
    maxOrderQty: 10,
    sku: "GA-ENG-CARD-007",
    tags: ["metal", "engraved", "wallet", "keepsake"],
    weightGrams: 120,
    isFeatured: false,
    rating: 4.6,
    numReviews: 17,
  },
  {
    name: "Custom Kids Name Puzzle",
    slug: "custom-kids-name-puzzle",
    description:
      "A colorful name puzzle for children, personalized with safe rounded wooden letters.",
    category: "Kids Gifts",
    images: [
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80",
    ],
    price: 1299,
    discountPercent: 14,
    offerTag: "Kids Pick",
    personalizationFields: [
      { label: "Child name", type: "text", required: true, maxLength: 18 },
    ],
    stock: 27,
    minOrderQty: 1,
    maxOrderQty: 6,
    sku: "GA-KIDS-PUZZLE-008",
    tags: ["kids", "wooden", "puzzle", "name"],
    weightGrams: 850,
    isFeatured: false,
    rating: 4.8,
    numReviews: 33,
  },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let inserted = 0;
  let updated = 0;

  for (const rawProduct of products) {
    const product = withSellingPrice(rawProduct);
    const existing = await Product.findOne({ slug: product.slug });
    if (existing) {
      Object.assign(existing, product);
      await existing.save();
      updated += 1;
    } else {
      await Product.create(product);
      inserted += 1;
    }
  }

  console.log(`Sample products ready. Inserted: ${inserted}, updated: ${updated}`);
  await mongoose.disconnect();
})();

// Run once after deployment (or any time) to populate the shop with demo
// products so the store isn't empty on first launch: npm run seed:products
// Safe to re-run - it skips any product whose slug already exists.
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");

const sampleProducts = [
  {
    name: "Engraved Rose Gold Bracelet",
    category: "Jewelry",
    description:
      "A delicate rose gold-plated bracelet, hand-engraved with a name or short message on the inside — a quiet detail only she'll know is there.",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1602751584547-6d181cb7dfe6?w=800&q=80",
    ],
    price: 1499,
    discountPercent: 10,
    offerTag: "Bestseller",
    stock: 40,
    minOrderQty: 1,
    maxOrderQty: 5,
    isFeatured: true,
    tags: ["jewelry", "engraved", "for her"],
    personalizationFields: [
      { label: "Name to engrave", type: "text", required: true, maxLength: 20 },
    ],
  },
  {
    name: "Personalized Wooden Photo Frame",
    category: "Home & Decor",
    description:
      "Solid mango-wood frame, laser-engraved with a name and date around the border. Holds a 5x7 print. Comes with a soft velvet stand.",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
      "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80",
    ],
    price: 899,
    discountPercent: 0,
    offerTag: "",
    stock: 60,
    minOrderQty: 1,
    maxOrderQty: 10,
    isFeatured: true,
    tags: ["home", "photo", "wood"],
    personalizationFields: [
      { label: "Names", type: "text", required: true, maxLength: 30 },
      { label: "Date", type: "date", required: false },
    ],
  },
  {
    name: "Custom Star Map Print",
    category: "Wall Art",
    description:
      "The night sky exactly as it looked on a date and location you choose — printed on museum-grade matte paper. A quietly emotional gift.",
    images: [
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    ],
    price: 1299,
    discountPercent: 15,
    offerTag: "Limited Edition",
    stock: 25,
    minOrderQty: 1,
    maxOrderQty: 3,
    isFeatured: true,
    tags: ["wall art", "star map", "anniversary"],
    personalizationFields: [
      { label: "Date", type: "date", required: true },
      { label: "Location", type: "text", required: true, maxLength: 40 },
      { label: "Caption below map", type: "text", required: false, maxLength: 40 },
    ],
  },
  {
    name: "Engraved Steel Hip Flask",
    category: "For Him",
    description:
      "6oz brushed stainless steel flask with a leather sleeve, engraved with initials or a short line. Comes gift-boxed.",
    images: [
      "https://images.unsplash.com/photo-1608885898957-a559228e8749?w=800&q=80",
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
    ],
    price: 999,
    discountPercent: 0,
    offerTag: "",
    stock: 0,
    minOrderQty: 1,
    maxOrderQty: 5,
    isFeatured: false,
    tags: ["for him", "steel", "groomsmen"],
    personalizationFields: [
      { label: "Initials or short text", type: "text", required: true, maxLength: 12 },
    ],
  },
  {
    name: "Personalized Recipe Book",
    category: "Home & Decor",
    description:
      "A hardcover blank recipe journal with a family name embossed on the cover — pass down recipes the way they were meant to be kept.",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
      "https://images.unsplash.com/photo-1524169113253-c6ba2b6c7e6e?w=800&q=80",
    ],
    price: 799,
    discountPercent: 5,
    offerTag: "",
    stock: 35,
    minOrderQty: 1,
    maxOrderQty: 10,
    isFeatured: false,
    tags: ["kitchen", "family", "keepsake"],
    personalizationFields: [
      { label: "Family name for cover", type: "text", required: true, maxLength: 25 },
    ],
  },
  {
    name: "Birth Flower Necklace",
    category: "Jewelry",
    description:
      "Sterling silver pendant featuring a hand-illustrated birth-month flower, with a small hidden initial on the back.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    ],
    price: 1199,
    discountPercent: 0,
    offerTag: "New",
    stock: 50,
    minOrderQty: 1,
    maxOrderQty: 5,
    isFeatured: true,
    tags: ["jewelry", "birth flower", "for her"],
    personalizationFields: [
      { label: "Birth month", type: "text", required: true, maxLength: 15 },
      { label: "Initial to engrave (optional)", type: "text", required: false, maxLength: 2 },
    ],
  },
  {
    name: "Kids' Personalized Story Book",
    category: "For Kids",
    description:
      "A softcover storybook where your child becomes the hero — their name and a chosen sidekick appear throughout the story.",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    ],
    price: 699,
    discountPercent: 0,
    offerTag: "Bestseller",
    stock: 3,
    minOrderQty: 1,
    maxOrderQty: 10,
    isFeatured: true,
    tags: ["kids", "book", "story"],
    personalizationFields: [
      { label: "Child's name", type: "text", required: true, maxLength: 20 },
      { label: "Favorite animal (sidekick)", type: "text", required: true, maxLength: 20 },
    ],
  },
  {
    name: "Anniversary Wooden Clock",
    category: "Home & Decor",
    description:
      "A minimalist walnut wall clock with a wedding date engraved quietly along the bottom edge. Silent-sweep movement.",
    images: [
      "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    ],
    price: 1799,
    discountPercent: 12,
    offerTag: "",
    stock: 18,
    minOrderQty: 1,
    maxOrderQty: 3,
    isFeatured: false,
    tags: ["anniversary", "home", "wood"],
    personalizationFields: [
      { label: "Date to engrave", type: "date", required: true },
    ],
  },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let created = 0;
  let skipped = 0;

  for (const item of sampleProducts) {
    const slug = slugify(item.name);
    const exists = await Product.findOne({ slug });
    if (exists) {
      skipped++;
      continue;
    }
    await Product.create({ ...item, slug });
    created++;
  }

  console.log(`Seed complete: ${created} product(s) created, ${skipped} already existed and were skipped.`);
  process.exit(0);
})();

// Run once after deployment: npm run seed:admin
// Creates the first superadmin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before seeding.");
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  await Admin.create({
    name: "Store Owner",
    email,
    password,
    role: "superadmin",
  });

  console.log("Superadmin created:", email);
  process.exit(0);
})();

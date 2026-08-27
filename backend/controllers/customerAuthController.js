const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

const genToken = (id) =>
  jwt.sign({ id, type: "customer" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

// POST /api/customers/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Name, email, phone and password are all required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists. Try signing in." });
    }

    const customer = await Customer.create({ name, email, password, phone });
    res.status(201).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      token: genToken(customer._id),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// POST /api/customers/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer || !(await customer.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      token: genToken(customer._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/customers/me
exports.me = async (req, res) => {
  res.json(req.customer);
};

// GET /api/customers/orders  (order history for the logged-in customer)
exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerAccount: req.customer._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

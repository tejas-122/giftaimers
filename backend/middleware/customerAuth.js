const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

// Protects customer-only routes (placing an order, viewing order history).
// Separate from protectAdmin so a customer token can never be used to
// access the admin panel, and vice versa.
const protectCustomer = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== "customer") {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.customer = await Customer.findById(decoded.id).select("-password");
      if (!req.customer) return res.status(401).json({ message: "Not authorized" });
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Session expired, please sign in again" });
    }
  }
  return res.status(401).json({ message: "Please sign in to continue" });
};

module.exports = { protectCustomer };

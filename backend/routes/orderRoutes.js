const express = require("express");
const router = express.Router();
const {
  placeOrder,
  trackOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getInvoice,
  getStats,
} = require("../controllers/orderController");
const { protectAdmin } = require("../middleware/auth");
const { protectCustomer } = require("../middleware/customerAuth");

// Requires a signed-in customer account
router.post("/", protectCustomer, placeOrder);

// Public - anyone with the order number can check status
router.get("/track/:orderNumber", trackOrder);

// Admin
router.get("/stats/summary", protectAdmin, getStats);
router.get("/", protectAdmin, getOrders);
router.get("/:id", protectAdmin, getOrderById);
router.patch("/:id/status", protectAdmin, updateOrderStatus);
router.get("/:id/invoice", protectAdmin, getInvoice);

module.exports = router;

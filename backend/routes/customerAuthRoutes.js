const express = require("express");
const router = express.Router();
const { register, login, me, myOrders } = require("../controllers/customerAuthController");
const { protectCustomer } = require("../middleware/customerAuth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protectCustomer, me);
router.get("/orders", protectCustomer, myOrders);

module.exports = router;

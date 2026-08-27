const express = require("express");
const router = express.Router();
const { login, me, changePassword } = require("../controllers/authController");
const { protectAdmin } = require("../middleware/auth");

router.post("/login", login);
router.get("/me", protectAdmin, me);
router.post("/change-password", protectAdmin, changePassword);

module.exports = router;

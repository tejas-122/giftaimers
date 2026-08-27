const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  getCategories,
} = require("../controllers/productController");
const { protectAdmin } = require("../middleware/auth");

// Public storefront routes
router.get("/", getProducts);
router.get("/categories/list", getCategories);
router.get("/:slug", getProductBySlug);

// Admin routes
router.get("/admin/all", protectAdmin, getAllProductsAdmin);
router.post("/", protectAdmin, createProduct);
router.put("/:id", protectAdmin, updateProduct);
router.patch("/:id/stock", protectAdmin, updateStock);
router.delete("/:id", protectAdmin, deleteProduct);

module.exports = router;

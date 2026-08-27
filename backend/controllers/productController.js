const Product = require("../models/Product");

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const generateUniqueSlug = async (name, currentId = null) => {
  const baseSlug = slugify(name);
  const query = { slug: baseSlug };
  if (currentId) {
    query._id = { $ne: currentId };
  }
  const existing = await Product.findOne(query);
  return existing ? `${baseSlug}-${Date.now().toString().slice(-5)}` : baseSlug;
};

// GET /api/products  (public storefront: only active products, supports filters)
exports.getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;
    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { sellingPrice: 1 };
    if (sort === "price_desc") sortOption = { sellingPrice: -1 };
    if (sort === "popular") sortOption = { numReviews: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/admin/all  (admin: includes inactive/out-of-stock)
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const { search, page = 1, limit = 30 } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products  (admin)
exports.createProduct = async (req, res) => {
  try {
    const body = req.body;
    const slug = await generateUniqueSlug(body.name);

    const product = await Product.create({ ...body, slug });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/products/:id  (admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    if (req.body.name) {
      product.slug = await generateUniqueSlug(req.body.name, product._id);
    }
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/products/:id/stock (admin) - quick stock/out-of-stock toggle
exports.updateStock = async (req, res) => {
  try {
    const { stock, outOfStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (stock !== undefined) product.stock = stock;
    if (outOfStock !== undefined) product.outOfStock = outOfStock;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/products/:id  (admin - soft delete by default, hard delete with ?hard=true)
exports.deleteProduct = async (req, res) => {
  try {
    if (req.query.hard === "true") {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: "Product permanently deleted" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.isActive = false;
    await product.save();
    res.json({ message: "Product removed from store" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/categories/list
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

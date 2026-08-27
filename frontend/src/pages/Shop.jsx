import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard.jsx";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    api.get("/products/categories/list").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { category, sort, search, limit: 40 } })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, [category, sort, search]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-ivory mb-6">Shop All Gifts</h1>

      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <input
          type="text"
          placeholder="Search personalized gifts..."
          defaultValue={search}
          onKeyDown={(e) => e.key === "Enter" && updateParam("search", e.target.value)}
          className="bg-surface border border-ink/10 rounded-full px-4 py-2 text-sm text-ivory placeholder:text-muted flex-1 min-w-[200px]"
        />
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
          className="bg-surface border border-ink/10 rounded-full px-4 py-2 text-sm text-ivory"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="bg-surface border border-ink/10 rounded-full px-4 py-2 text-sm text-ivory"
        >
          <option value="">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {loading ? (
        <p className="text-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products found. Try a different filter.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

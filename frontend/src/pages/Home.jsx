import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products", { params: { featured: true, limit: 8 } }).then((res) => setFeatured(res.data.products));
    api.get("/products/categories/list").then((res) => setCategories(res.data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-5 pt-14 pb-8">
        <div className="max-w-3xl">
          <p className="font-mono text-gold text-xs uppercase tracking-[0.2em] mb-4">Made for the moment</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-ivory mb-6">
            Gifts that carry <span className="text-gold italic">their name</span>, not just your order number.
          </h1>
          <p className="font-body text-ivory/70 mb-8 max-w-md">
            Engraved, monogrammed, hand-finished. Every piece on GiftAimers is personalized before it ships.
          </p>
          <div className="flex gap-4">
            <Link to="/shop" className="bg-gold text-ink font-semibold px-6 py-3 rounded-full hover:brightness-110 transition">
              Shop the Collection
            </Link>
            <Link to="/track-order" className="border border-ink/15 text-ivory px-6 py-3 rounded-full hover:border-gold transition">
              Track an Order
            </Link>
          </div>
        </div>
      </section>

      <div className="ribbon-divider max-w-7xl mx-auto" />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 py-14">
          <h2 className="font-display text-2xl text-ivory mb-6">Browse by category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="px-5 py-2 rounded-full bg-surface border border-ink/10 text-ivory/80 hover:border-gold hover:text-gold transition text-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-5 py-6 pb-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-2xl text-ivory">Bestsellers</h2>
          <Link to="/shop" className="text-gold text-sm hover:underline">View all -&gt;</Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-muted text-sm">No featured products yet - add some from the admin panel.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import ProductViewer3D from "../components/ProductViewer3D.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [personalization, setPersonalization] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        setQty(res.data.minOrderQty || 1);
      })
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-7xl mx-auto px-5 py-16 text-muted">Loading...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-5 py-16 text-muted">Product not found.</div>;

  const handleAddToCart = () => {
    // Validate required personalization fields
    for (const field of product.personalizationFields || []) {
      if (field.required && !personalization[field.label]) {
        toast.error(`Please fill in: ${field.label}`);
        return;
      }
    }
    if (qty < product.minOrderQty) {
      toast.error(`Minimum order quantity is ${product.minOrderQty}`);
      return;
    }
    if (qty > product.maxOrderQty || qty > product.stock) {
      toast.error(`Only ${Math.min(product.maxOrderQty, product.stock)} available`);
      return;
    }
    addToCart(product, qty, personalization);
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 grid md:grid-cols-2 gap-12">
      <ProductViewer3D model3d={product.model3d} images={product.images} />

      <div>
        {product.offerTag && (
          <span className="inline-block bg-gold text-ink text-xs font-bold uppercase px-3 py-1 rounded-full mb-3">
            {product.offerTag}
          </span>
        )}
        <h1 className="font-display text-3xl text-ivory mb-2">{product.name}</h1>
        <p className="text-muted text-sm mb-4">{product.category}</p>

        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-2xl text-gold">Rs. {product.sellingPrice}</span>
          {product.discountPercent > 0 && (
            <>
              <span className="font-mono text-muted line-through">Rs. {product.price}</span>
              <span className="text-sm text-blush">{product.discountPercent}% off</span>
            </>
          )}
        </div>

        <p className="font-body text-ivory/70 mb-6 leading-relaxed">{product.description}</p>

        {product.outOfStock ? (
          <p className="text-red-600 font-semibold mb-6">Currently out of stock</p>
        ) : (
          <p className="text-sm text-muted mb-6">
            {product.stock} in stock · Min order {product.minOrderQty} · Max order {product.maxOrderQty}
          </p>
        )}

        {/* Personalization fields */}
        {product.personalizationFields?.length > 0 && (
          <div className="space-y-4 mb-6 bg-surface p-5 rounded-xl border border-ink/[0.06]">
            <h3 className="font-semibold text-ivory text-sm uppercase tracking-wide">Personalize this gift</h3>
            {product.personalizationFields.map((field, i) => (
              <div key={i}>
                <label className="block text-xs text-muted mb-1">
                  {field.label} {field.required && <span className="text-blush">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    maxLength={field.maxLength}
                    className="w-full bg-surface2 border border-ink/10 rounded-lg px-3 py-2 text-sm text-ivory"
                    onChange={(e) => setPersonalization({ ...personalization, [field.label]: e.target.value })}
                  />
                ) : (
                  <input
                    type={field.type}
                    maxLength={field.maxLength}
                    className="w-full bg-surface2 border border-ink/10 rounded-lg px-3 py-2 text-sm text-ivory"
                    onChange={(e) => setPersonalization({ ...personalization, [field.label]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {!product.outOfStock && (
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm text-muted">Quantity</label>
            <div className="flex items-center border border-ink/10 rounded-full overflow-hidden">
              <button
                className="px-3 py-1 text-ivory"
                onClick={() => setQty((q) => Math.max(product.minOrderQty, q - 1))}
              >
                −
              </button>
              <span className="px-3 text-ivory font-mono">{qty}</span>
              <button
                className="px-3 py-1 text-ivory"
                onClick={() => setQty((q) => Math.min(product.maxOrderQty, product.stock, q + 1))}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            disabled={product.outOfStock}
            onClick={handleAddToCart}
            className="flex-1 border border-gold text-gold px-6 py-3 rounded-full font-semibold hover:bg-gold/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
          <button
            disabled={product.outOfStock}
            onClick={handleBuyNow}
            className="flex-1 bg-gold text-ink px-6 py-3 rounded-full font-semibold hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

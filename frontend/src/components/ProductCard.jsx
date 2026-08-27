import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercent > 0;
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-surface rounded-2xl overflow-hidden border border-ink/[0.06] hover:border-gold/40 transition-colors"
    >
      <div className="relative aspect-square overflow-hidden bg-surface2">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.offerTag && (
          <span className="absolute top-3 left-3 bg-gold text-ink text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
            {product.offerTag}
          </span>
        )}
        {product.outOfStock && (
          <div className="absolute inset-0 bg-ink/70 flex items-center justify-center">
            <span className="text-ivory text-sm font-semibold uppercase tracking-wider">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-body font-semibold text-ivory text-sm mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-gold text-sm">Rs. {product.sellingPrice}</span>
          {hasDiscount && (
            <span className="font-mono text-muted text-xs line-through">Rs. {product.price}</span>
          )}
        </div>
        <p className="text-[11px] text-muted mt-1">Min order: {product.minOrderQty}</p>
      </div>
    </Link>
  );
}

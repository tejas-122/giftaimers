import React from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  return (
    <div className="max-w-xl mx-auto px-5 py-24 text-center">
      <div className="text-5xl mb-4">🎁</div>
      <h1 className="font-display text-3xl text-ivory mb-3">Order Placed!</h1>
      <p className="text-ivory/70 mb-2">Your order is being wrapped with care.</p>
      <p className="font-mono text-gold text-lg mb-8">{orderNumber}</p>
      <div className="flex justify-center gap-4">
        <Link to="/track-order" className="border border-ink/15 text-ivory px-6 py-3 rounded-full hover:border-gold">
          Track Order
        </Link>
        <Link to="/shop" className="bg-gold text-ink px-6 py-3 rounded-full font-semibold">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

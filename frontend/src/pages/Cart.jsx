import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, itemsTotal } = useCart();
  const { customer, loading } = useCustomerAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h1 className="font-display text-2xl text-ivory mb-4">Your cart is empty</h1>
        <Link to="/shop" className="text-gold hover:underline">Browse the collection →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl text-ivory mb-8">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 bg-surface p-4 rounded-xl border border-ink/[0.06]">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="text-ivory font-semibold">{item.name}</h3>
              {Object.entries(item.personalization || {}).length > 0 && (
                <p className="text-xs text-muted mt-1">
                  {Object.entries(item.personalization).map(([k, v]) => `${k}: ${v}`).join(", ")}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-ink/10 rounded-full overflow-hidden">
                  <button
                    className="px-2 text-ivory"
                    onClick={() => updateQuantity(i, Math.max(item.minOrderQty || 1, item.quantity - 1))}
                  >−</button>
                  <span className="px-2 font-mono text-ivory text-sm">{item.quantity}</span>
                  <button
                    className="px-2 text-ivory"
                    onClick={() => updateQuantity(i, Math.min(item.maxOrderQty || 10, item.stock || 99, item.quantity + 1))}
                  >+</button>
                </div>
                <button onClick={() => removeFromCart(i)} className="text-xs text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </div>
            <div className="font-mono text-gold">Rs. {item.price * item.quantity}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-ink/10 pt-6">
        <span className="text-ivory font-semibold">Items Total</span>
        <span className="font-mono text-xl text-gold">Rs. {itemsTotal}</span>
      </div>
      <p className="text-xs text-muted mt-2">Shipping and COD fee calculated at checkout.</p>

      <button
        onClick={() => navigate("/checkout")}
        disabled={loading}
        className="mt-8 w-full bg-gold text-ink py-3 rounded-full font-semibold hover:brightness-110 transition disabled:opacity-50"
      >
        {loading ? "Checking account..." : customer ? "Proceed to Checkout" : "Sign In to Checkout"}
      </button>
      {!loading && !customer && (
        <p className="mt-3 text-center text-sm text-muted">
          Sign in or <Link to="/signup" state={{ from: "/checkout" }} className="text-gold hover:underline">create an account</Link> to place your order.
        </p>
      )}
    </div>
  );
}

import React, { useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

const STATUS_STEPS = ["placed", "confirmed", "processing", "shipped", "delivered"];

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    try {
      const res = await api.get(`/orders/track/${orderNumber.trim()}`);
      setOrder(res.data);
    } catch {
      toast.error("Order not found. Check your order number.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <h1 className="font-display text-3xl text-ivory mb-6">Track Your Order</h1>
      <form onSubmit={handleTrack} className="flex gap-3 mb-10">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. GA-ORD-000123"
          className="flex-1 bg-surface border border-ink/10 rounded-full px-4 py-3 text-sm text-ivory"
        />
        <button className="bg-gold text-ink px-6 py-3 rounded-full font-semibold" disabled={loading}>
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {order && (
        <div className="bg-surface p-6 rounded-xl border border-ink/[0.06]">
          {order.status === "cancelled" ? (
            <p className="text-red-600 font-semibold">This order has been cancelled.</p>
          ) : (
            <div className="flex justify-between mb-8">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex-1 text-center relative">
                  <div
                    className={`w-4 h-4 mx-auto rounded-full mb-2 ${
                      i <= currentStepIndex ? "bg-gold" : "bg-surface2 border border-ink/15"
                    }`}
                  />
                  <p className={`text-[11px] capitalize ${i <= currentStepIndex ? "text-gold" : "text-muted"}`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-1 text-sm text-ivory/80">
            <p><span className="text-muted">Order:</span> {order.orderNumber}</p>
            <p><span className="text-muted">Total:</span> Rs. {order.grandTotal}</p>
            <p><span className="text-muted">Payment:</span> {order.paymentMethod}</p>
          </div>
        </div>
      )}
    </div>
  );
}

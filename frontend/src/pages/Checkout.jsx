import SelectedOptions from "../components/SelectedOptions.jsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";
import { useCart } from "../context/CartContext.jsx";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";

export default function Checkout() {
  const { items, itemsTotal, clearCart } = useCart();
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    address: "",
    city: "",
    state: "",
    pincode: sessionStorage.getItem("deliveryPin") || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [quoteState, setQuoteState] = useState(null);
  const cartItems = items.map(i => ({ productId: i.productId, name: i.name, quantity: i.quantity, personalization: i.personalization, selectedOptions: i.selectedOptions }));
  const quoteKey = JSON.stringify({ customer: form, items: cartItems });
  const quote = quoteState?.key === quoteKey ? quoteState.quote : null;
  const validPin = /^[1-9][0-9]{5}$/.test(form.pincode.trim());
  const localDelivery = form.pincode.trim() === "466001";
  const quoted = quote && quote.fee !== null && new Date(quote.expiresAt) > new Date();
  const canPlace = validPin && (localDelivery || quoted);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer) {
      navigate("/signin", { state: { from: "/checkout" }, replace: true });
      return;
    }
    if (items.length === 0) return toast.error("Your cart is empty");
    if (!validPin) return toast.error("Enter a valid 6-digit PIN code");
    setSubmitting(true);
    try {
      if (!canPlace) {
        const result = await api.post("/shipping/quote", { customer: form, items: cartItems });
        setQuoteState({ key: quoteKey, quote: result.data });
        toast.success(result.data.fee === null ? "Quote requested. Check back here after we confirm the courier charge." : "Courier charge ready. Review the total before placing your order.");
        return;
      }
      const payload = {
        customer: form,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          personalization: i.personalization,
          selectedOptions: i.selectedOptions,
        })),
        paymentMethod: "COD",
        shippingQuoteId: localDelivery ? undefined : quote?._id,
      };
      const res = await api.post("/orders", payload);
      clearCart();
      navigate(`/order-success/${res.data.orderNumber}`);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        toast.error("Please sign in again to place your order. Your cart is saved.");
        navigate("/signin", { state: { from: "/checkout" }, replace: true });
        return;
      }
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  const shippingFee = localDelivery ? 0 : quoted ? quote.fee : null;
  const codFee = 30;
  const grandTotal = shippingFee === null ? null : itemsTotal + shippingFee + codFee;

  return (
    <div className="max-w-4xl mx-auto px-5 py-12 grid md:grid-cols-2 gap-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="font-display text-2xl text-ivory mb-1">Delivery Details</h1>
        <p className="text-xs text-muted mb-3">Signed in as {customer?.email}</p>
        {["name", "phone", "email", "address", "city", "state", "pincode"].map((field) => (
          <input
            key={field}
            name={field}
            aria-label={field}
            pattern={field === "pincode" ? "[1-9][0-9]{5}" : undefined}
            maxLength={field === "pincode" ? 6 : undefined}
            inputMode={field === "pincode" ? "numeric" : undefined}
            required={field !== "email"}
            type={field === "phone" ? "tel" : field === "email" ? "email" : "text"}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className="w-full bg-surface border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-muted"
          />
        ))}
        <p role="status" className="text-sm text-muted">{localDelivery ? "Free shipping within Sehore, PIN 466001. COD fee applies separately." : "For other locations, request a courier quote. We will check the actual charge; return here and select Check courier quote. No order is placed until you review the charge and select Place Order. Quotes are valid for 7 days; changing the cart or address requires a new quote."}</p>
        <div className="bg-surface border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory">
          Payment Method: <span className="text-gold font-semibold">Cash on Delivery</span>
        </div>
        <button
          disabled={submitting}
          type="submit"
          className="w-full bg-gold text-ink py-3 rounded-full font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {submitting ? "Please wait..." : canPlace ? `Place Order - Rs. ${grandTotal}` : quote ? "Check courier quote" : "Request courier quote"}
        </button>
      </form>

      <div className="bg-surface p-6 rounded-xl border border-ink/[0.06] h-fit">
        <h2 className="font-display text-xl text-ivory mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm text-ivory/80 mb-4">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <div><span>{item.name} × {item.quantity}</span><SelectedOptions item={item} /></div>
              <span className="font-mono">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-ink/10 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-ivory/70">
            <span>Items Total</span><span className="font-mono">Rs. {itemsTotal}</span>
          </div>
          <div className="flex justify-between text-ivory/70">
            <span>Shipping</span><span className="font-mono">{shippingFee === null ? "Awaiting courier quote" : shippingFee === 0 ? "Free" : `Rs. ${shippingFee}`}</span>
          </div>
          <div className="flex justify-between text-ivory/70">
            <span>COD Fee</span><span className="font-mono">Rs. {codFee}</span>
          </div>
          <div className="flex justify-between text-ivory font-semibold text-base pt-2">
            <span>Grand Total</span><span className="font-mono text-gold">{grandTotal === null ? "Pending shipping quote" : `Rs. ${grandTotal}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

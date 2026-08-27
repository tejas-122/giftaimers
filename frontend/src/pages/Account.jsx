import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";

const STATUS_COLORS = {
  placed: "text-blue-600 border-blue-600",
  confirmed: "text-yellow-600 border-yellow-600",
  processing: "text-purple-600 border-purple-600",
  shipped: "text-orange-600 border-orange-600",
  delivered: "text-green-600 border-green-600",
  cancelled: "text-red-600 border-red-600",
};

export default function Account() {
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/customers/orders").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-1">Hi, {customer?.name}</h1>
          <p className="text-muted text-sm">{customer?.email} · {customer?.phone}</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
          Sign out
        </button>
      </div>

      <h2 className="font-display text-xl text-ivory mb-4">Your Orders</h2>
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted text-sm">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="bg-surface p-4 rounded-xl border border-ink/[0.06] flex justify-between items-center">
              <div>
                <p className="font-mono text-sm text-ivory">{o.orderNumber}</p>
                <p className="text-xs text-muted">{o.items.length} item(s) · {new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-gold text-sm mb-1">Rs. {o.grandTotal}</p>
                <span className={`text-xs px-2 py-1 rounded-full border capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

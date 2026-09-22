import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/adminApi";
import { InvoiceButton, OrderStatusEditor } from "./OrderActions.jsx";

const STATUS_COLORS = {
  placed: "text-blue-600 border-blue-600",
  confirmed: "text-yellow-600 border-yellow-600",
  processing: "text-purple-600 border-purple-600",
  shipped: "text-orange-600 border-orange-600",
  delivered: "text-green-600 border-green-600",
  cancelled: "text-red-600 border-red-600",
};

export default function OrdersList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const status = searchParams.get("status") || "";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.get("/orders", { params: { status, limit: 50 } })
      .then((res) => { if (active) setOrders(res.data.orders); })
      .catch(() => { if (active) setError("Could not load orders. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [status, refresh]);

  const onUpdated = (updated) => setOrders((previous) => previous
    .map((order) => order._id === updated._id ? updated : order)
    .filter((order) => !status || order.status === status));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-ivory">Orders</h1>
        <select
          value={status}
          onChange={(e) => setSearchParams(e.target.value ? { status: e.target.value } : {})}
          className="bg-surface border border-ink/10 rounded-full px-4 py-2 text-sm text-ivory"
        >
          <option value="">All statuses</option>
          {["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-muted mb-5">Select a customer to view their profile, all orders and invoice PDFs.</p>
      {error ? (
        <div role="alert"><p className="text-red-600">{error}</p><button onClick={() => setRefresh(refresh + 1)} className="text-gold underline mt-2">Try again</button></div>
      ) : loading ? (
        <p className="text-muted">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted uppercase text-xs border-b border-ink/10">
              <tr>
                <th className="py-3 pr-4">Order #</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Items</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Update status</th>
                <th className="py-3 pr-4">Download</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-ink/[0.06] text-ivory/90 hover:bg-surface2/50">
                  <td className="py-3 pr-4">
                    <Link to={`/admin/orders/${o._id}`} className="text-gold hover:underline font-mono text-xs">{o.orderNumber}</Link>
                  </td>
                  <td className="py-3 pr-4">{o.customerAccount ? <Link to={`/admin/customers/${o.customerAccount}`} className="text-gold hover:underline">{o.customer.name}<span className="block text-xs">View customer & orders</span></Link> : <span>{o.customer.name}<span className="block text-xs text-muted">No linked account</span></span>}</td>
                  <td className="py-3 pr-4">{o.items.length}</td>
                  <td className="py-3 pr-4 font-mono">Rs. {o.grandTotal}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-1 rounded-full border capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-4"><OrderStatusEditor order={o} onUpdated={onUpdated} /></td>
                  <td className="py-3 pr-4"><InvoiceButton order={o} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/adminApi";

const STATUS_FLOW = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const load = () => api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      await api.patch(`/orders/${id}/status`, { status, note });
      toast.success(`Order marked as ${status}`);
      setNote("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      const res = await api.get(`/orders/${id}/invoice`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Failed to generate invoice");
    }
  };

  if (!order) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-1">{order.orderNumber}</h1>
          <p className="text-muted text-sm">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <button onClick={downloadInvoice} className="bg-gold text-ink px-5 py-2.5 rounded-full text-sm font-semibold">
          Download Invoice
        </button>
      </div>

      <section className="bg-surface p-6 rounded-xl border border-ink/[0.06] mb-6">
        <h2 className="text-ivory font-semibold mb-3">Customer</h2>
        {order.customerAccount && <Link to={`/admin/customers/${order.customerAccount}`} className="inline-block text-sm text-gold hover:underline mb-3">View customer profile and all orders →</Link>}
        <p className="text-ivory/80 text-sm">{order.customer.name} · {order.customer.phone}</p>
        <p className="text-ivory/80 text-sm">{order.customer.email}</p>
        <p className="text-ivory/80 text-sm">{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
      </section>

      <section className="bg-surface p-6 rounded-xl border border-ink/[0.06] mb-6">
        <h2 className="text-ivory font-semibold mb-3">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <p className="text-ivory">{item.name} × {item.quantity}</p>
                {Object.entries(item.personalization || {}).length > 0 && (
                  <p className="text-xs text-muted">
                    {Object.entries(item.personalization).map(([k, v]) => `${k}: ${v}`).join(", ")}
                  </p>
                )}
              </div>
              <span className="font-mono text-gold">Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-ink/10 mt-4 pt-4 text-sm space-y-1">
          <div className="flex justify-between text-ivory/70"><span>Items Total</span><span className="font-mono">Rs. {order.itemsTotal}</span></div>
          <div className="flex justify-between text-ivory/70"><span>Shipping</span><span className="font-mono">Rs. {order.shippingFee}</span></div>
          <div className="flex justify-between text-ivory/70"><span>COD Fee</span><span className="font-mono">Rs. {order.codFee}</span></div>
          <div className="flex justify-between text-ivory font-semibold"><span>Grand Total</span><span className="font-mono text-gold">Rs. {order.grandTotal}</span></div>
        </div>
      </section>

      <section className="bg-surface p-6 rounded-xl border border-ink/[0.06]">
        <h2 className="text-ivory font-semibold mb-3">Update Status</h2>
        <p className="text-sm text-muted mb-3">Current: <span className="text-gold capitalize">{order.status}</span></p>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note (e.g. tracking ID)"
          className="w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-2 text-sm text-ivory mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {STATUS_FLOW.map((s) => (
            <button
              key={s}
              disabled={updating || order.status === s}
              onClick={() => updateStatus(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-ink/15 text-ivory/80 hover:border-gold hover:text-gold disabled:opacity-30 capitalize"
            >
              {s}
            </button>
          ))}
        </div>

        <h3 className="text-ivory font-semibold mt-6 mb-2 text-sm">History</h3>
        <ul className="text-xs text-muted space-y-1">
          {order.statusHistory?.map((h, i) => (
            <li key={i}>{new Date(h.changedAt).toLocaleString()} — <span className="capitalize text-ivory/70">{h.status}</span> {h.note && `(${h.note})`}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

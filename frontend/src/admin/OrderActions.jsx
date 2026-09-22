import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/adminApi";

export const ORDER_STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export function OrderStatusEditor({ order, onUpdated }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setStatus(order.status); }, [order._id, order.status]);
  async function save() {
    if (saving || status === order.status) return;
    setSaving(true);
    try {
      const { data } = await api.patch(`/orders/${order._id}/status`, { status });
      onUpdated(data);
      toast.success(`Order ${order.orderNumber} marked as ${data.status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    } finally { setSaving(false); }
  }
  return <div className="flex items-center gap-2">
    <select aria-label={`Status for ${order.orderNumber}`} value={status} disabled={saving} onChange={(e) => setStatus(e.target.value)} className="bg-white border border-ivory/20 rounded-lg px-2 py-2 text-xs capitalize">
      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <button onClick={save} disabled={saving || status === order.status} className="bg-gold text-white rounded-lg px-3 py-2 text-xs disabled:opacity-40 whitespace-nowrap">{saving ? "Saving..." : "Update"}</button>
  </div>;
}

export function InvoiceButton({ order }) {
  const [downloading, setDownloading] = useState(false);
  async function download() {
    setDownloading(true);
    try {
      const { data } = await api.get(`/orders/${order._id}/invoice`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { toast.error("Could not download invoice. Please try again."); }
    finally { setDownloading(false); }
  }
  return <button onClick={download} disabled={downloading} aria-label={`Download invoice PDF for ${order.orderNumber}`} className="text-gold text-xs border border-gold/30 rounded-lg px-3 py-2 hover:bg-surface disabled:opacity-50 whitespace-nowrap">{downloading ? "Downloading..." : "Invoice PDF"}</button>;
}

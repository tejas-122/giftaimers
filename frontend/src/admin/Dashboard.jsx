import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/adminApi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/orders/stats/summary").then((res) => setStats(res.data));
  }, []);

  const cards = stats
    ? [
        { label: "Total Orders", value: stats.totalOrders, link: "/admin/orders" },
        { label: "Pending Orders", value: stats.pendingOrders, link: "/admin/orders?status=placed" },
        { label: "Delivered Orders", value: stats.deliveredOrders, link: "/admin/orders?status=delivered" },
        { label: "Total Revenue", value: `Rs. ${stats.totalRevenue}`, link: "/admin/orders" },
        { label: "Low Stock (<=5)", value: stats.lowStockCount, link: "/admin/products" },
        { label: "Out of Stock", value: stats.outOfStockCount, link: "/admin/products" },
      ]
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl text-ivory mb-8">Dashboard</h1>
      {!stats ? (
        <p className="text-muted">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
          {cards.map((c) => (
            <Link key={c.label} to={c.link} className="bg-surface p-5 rounded-xl border border-ink/[0.06] hover:border-gold/40 transition">
              <p className="text-muted text-xs uppercase tracking-wide mb-2">{c.label}</p>
              <p className="font-display text-2xl text-ivory">{c.value}</p>
            </Link>
          ))}
        </div>
      )}
      <div className="flex gap-4">
        <Link to="/admin/products/new" className="bg-gold text-ink px-5 py-2.5 rounded-full text-sm font-semibold">
          + Add Product
        </Link>
        <Link to="/admin/orders" className="border border-ink/15 text-ivory px-5 py-2.5 rounded-full text-sm">
          View Orders
        </Link>
      </div>
    </div>
  );
}

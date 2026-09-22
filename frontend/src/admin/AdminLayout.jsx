import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm ${isActive ? "bg-gold text-ink font-semibold" : "text-ivory/70 hover:bg-surface2"}`;

  return (
    <div className="min-h-screen flex bg-ink">
      <aside className="w-60 bg-surface border-r border-ink/10 p-5 flex flex-col">
        <h2 className="font-display text-xl text-ivory mb-1">GiftAimers</h2>
        <p className="text-xs text-muted mb-8">Admin Panel</p>
        <nav className="space-y-1 flex-1">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>
        </nav>
        <div className="text-xs text-muted mb-3">{admin?.name} ({admin?.role})</div>
        <button
          onClick={() => { logout(); navigate("/admin/login"); }}
          className="text-xs text-red-600 hover:underline text-left"
        >
          Log out
        </button>
      </aside>
      <main className="flex-1 min-w-0 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

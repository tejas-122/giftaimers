import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/adminApi";
import { InvoiceButton, OrderStatusEditor } from "./OrderActions.jsx";

const date = (value) => new Date(value).toLocaleString();
const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

export default function CustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    api.get(`/orders/customer/${id}`).then((res) => { if (active) setData(res.data); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Could not load customer details"); });
    return () => { active = false; };
  }, [id, attempt]);
  const onUpdated = (updated) => setData((previous) => previous && ({ ...previous, orders: previous.orders.map((order) => order._id === updated._id ? updated : order) }));
  return <div className="max-w-6xl">
    <Link to="/admin/orders" className="text-gold text-sm hover:underline">← Back to orders</Link>
    <h1 className="font-display text-3xl mt-4 mb-6">Customer Details</h1>
    {error ? <div role="alert"><p className="text-red-600">{error}</p><button className="text-gold mt-3 underline" onClick={() => setAttempt(attempt + 1)}>Try again</button></div> : !data ? <p role="status" className="text-muted">Loading customer history...</p> : <>
      <section className="bg-surface rounded-xl p-6 mb-6 border border-ivory/10">
        <h2 className="text-xl font-semibold mb-4">{data.customer.name}</h2>
        <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
          <div><dt className="text-muted mb-1">Email</dt><dd className="break-all">{data.customer.email}</dd></div>
          <div><dt className="text-muted mb-1">Phone</dt><dd>{data.customer.phone}</dd></div>
          <div><dt className="text-muted mb-1">Customer since</dt><dd>{date(data.customer.createdAt)}</dd></div>
          <div><dt className="text-muted mb-1">Total orders</dt><dd>{data.orders.length}</dd></div>
        </dl>
      </section>
      <h2 className="text-xl font-semibold mb-2">All orders ({data.orders.length})</h2>
      <p className="text-sm text-muted mb-5">Newest first. Delivery details are shown for each order and may belong to a gift recipient.</p>
      {data.orders.length === 0 ? <p className="text-muted">This customer has not placed any orders.</p> : <div className="space-y-5">{data.orders.map((order) => <article key={order._id} className="border border-ivory/15 rounded-xl p-5">
        <div className="flex flex-wrap justify-between gap-4 border-b border-ivory/10 pb-4 mb-4">
          <div><Link to={`/admin/orders/${order._id}`} className="text-gold font-semibold hover:underline">{order.orderNumber}</Link><p className="text-xs text-muted mt-1">Ordered {date(order.createdAt)}</p></div>
          <div className="flex flex-wrap items-center gap-3"><span className="text-xs capitalize">Current: {order.status}</span><OrderStatusEditor order={order} onUpdated={onUpdated} /><InvoiceButton order={order} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div><h3 className="font-semibold mb-2">Items</h3><ul className="space-y-3">{order.items.map((item, index) => <li key={index}><p>{item.name} × {item.quantity} <span className="text-muted">({money(item.price * item.quantity)})</span></p>{Object.entries(item.personalization || {}).map(([key, value]) => <p key={key} className="text-xs text-muted break-words">{key}: {String(value)}</p>)}</li>)}</ul><p className="font-semibold mt-4">Order total: {money(order.grandTotal)}</p><p className="text-xs text-muted mt-1">{order.paymentMethod} · Payment: {order.paymentStatus}</p></div>
          <div><h3 className="font-semibold mb-2">Delivery details</h3><p>{order.customer.name}</p><p>{order.customer.phone}</p><p className="break-all">{order.customer.email}</p><p className="mt-2">{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p><Link to={`/admin/orders/${order._id}`} className="inline-block text-gold hover:underline mt-4">View full order and status history →</Link></div>
        </div>
      </article>)}</div>}
    </>}
  </div>;
}

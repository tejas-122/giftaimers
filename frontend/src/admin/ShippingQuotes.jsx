import React, { useEffect, useState } from "react";
import api from "../api/adminApi";
import toast from "react-hot-toast";
import SelectedOptions from "../components/SelectedOptions.jsx";
export default function ShippingQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [fees, setFees] = useState({});
  const [busy, setBusy] = useState(null);
  const load = async () => { try { setQuotes((await api.get("/shipping/quotes")).data); } catch { toast.error("Could not load quotes"); } };
  useEffect(() => { load(); }, []);
  const issue = async (event, quote) => {
    event.preventDefault(); setBusy(quote._id);
    try { await api.patch(`/shipping/quotes/${quote._id}`, { fee: Number(fees[quote._id]) }); toast.success("Quote issued. Customer can review it at checkout."); await load(); }
    catch (e) { toast.error(e.response?.data?.message || "Could not issue quote"); }
    finally { setBusy(null); }
  };
  return <div className="space-y-5"><div className="flex justify-between"><h1 className="text-2xl font-semibold">Courier quotes</h1><button onClick={load} className="text-gold">Refresh</button></div>
    <p className="text-sm text-muted">Check the courier charge and serviceability, then enter the shipping amount. COD is charged separately. Issued quotes cannot be edited and expire 7 days after the request. Requests do not reserve stock or create orders. Contact the customer using their details if delivery is unavailable.</p>
    {!quotes.length && <p>No current quote requests.</p>}
    {quotes.map(q => <section key={q._id} className="border border-ink/10 rounded-xl p-5 space-y-3 bg-surface">
      <h2 className="font-semibold">{q.customer.name} - {q.customer.pincode}</h2>
      <p className="text-sm">{q.customer.address}, {q.customer.city}, {q.customer.state}<br />{q.customer.phone} {q.customer.email}</p>
      <ul className="text-sm space-y-2">{q.items.map((item,i) => <li key={i}>{item.name} x {item.quantity}<SelectedOptions item={item} />{Object.entries(item.personalization || {}).map(([k,v]) => <p key={k}>{k}: {String(v)}</p>)}{item.weightGrams > 0 && <p>Product weight: {item.weightGrams} g</p>}</li>)}</ul>
      <p className="text-xs text-muted">Expires: {new Date(q.expiresAt).toLocaleString()}</p>
      {q.fee === null ? <form onSubmit={e => issue(e,q)} className="flex gap-3"><input required type="number" min="0" max="100000" step="0.01" aria-label={`Courier charge for ${q.customer.name}`} placeholder="Courier charge (Rs.)" value={fees[q._id] ?? ""} onChange={e => setFees({...fees,[q._id]:e.target.value})} className="border border-ink/10 rounded-lg p-2" /><button disabled={busy !== null} className="bg-gold text-white px-4 py-2 rounded-lg">{busy === q._id ? "Saving..." : "Issue quote"}</button></form> : <p className="font-semibold">Courier charge: Rs. {q.fee} - issued</p>}
    </section>)}
  </div>;
}

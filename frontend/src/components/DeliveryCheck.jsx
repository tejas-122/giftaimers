import React, { useState } from "react";
export default function DeliveryCheck() {
  const [pin, setPin] = useState(() => sessionStorage.getItem("deliveryPin") || "");
  const [checked, setChecked] = useState(false);
  const valid = /^[1-9][0-9]{5}$/.test(pin);
  return <section className="border-y border-ink/10 py-5 mb-6">
    <h3 className="font-semibold mb-2">Choose delivery location</h3>
    <label htmlFor="delivery-pin" className="block text-sm text-muted mb-2">India - Delivery PIN code</label>
    <div className="flex gap-2"><input id="delivery-pin" inputMode="numeric" maxLength={6} value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, "")); setChecked(false); }} placeholder="Enter 6-digit PIN code" className="min-w-0 flex-1 border border-ink/10 rounded-lg p-3" />
    <button type="button" onClick={() => { setChecked(true); if(valid) sessionStorage.setItem("deliveryPin", pin); }} className="border border-gold text-gold rounded-lg px-4">Check</button></div>
    {checked && <p role="status" className="text-sm mt-3">{!valid ? "Enter a valid 6-digit PIN code." : pin === "466001" ? "Free shipping in Sehore (466001). COD fee applies separately." : "Shipping at the actual courier charge. Request a quote at checkout and review it before placing your order. Delivery availability will be confirmed with the quote."}</p>}
  </section>;
}

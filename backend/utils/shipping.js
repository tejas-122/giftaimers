const crypto = require("crypto");
const ShippingQuote = require("../models/ShippingQuote");
function pin(value) {
  const p = String(value || "").trim();
  if (!/^[1-9][0-9]{5}$/.test(p)) throw new Error("Enter a valid 6-digit delivery PIN code");
  return p;
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
}
function fingerprint(customer, items) {
  const address = Object.fromEntries(["name", "phone", "email", "address", "city", "state", "pincode"].map(k => [k, String(customer?.[k] || "").trim()]));
  const cart = items.map(i => ({ productId: String(i.productId), quantity: Number(i.quantity), selectedOptions: i.selectedOptions || {}, personalization: i.personalization || {} }));
  return crypto.createHash("sha256").update(JSON.stringify(canonical({ address, cart }))).digest("hex");
}
async function shippingFee(customerAccount, customer, items, quoteId) {
  if (pin(customer?.pincode) === "466001") return 0;
  if (!quoteId || !/^[a-f0-9]{24}$/i.test(quoteId)) throw new Error("Request and review a courier quote before placing your order");
  const quote = await ShippingQuote.findOne({ _id: quoteId, customerAccount, fingerprint: fingerprint(customer, items), expiresAt: { $gt: new Date() }, fee: { $ne: null } });
  if (!quote) throw new Error("Your courier quote is pending, expired, or does not match this cart and address. Request a new quote.");
  return quote.fee;
}
module.exports = { pin, fingerprint, shippingFee };

const test = require("node:test");
const assert = require("node:assert/strict");
const Quote = require("../models/ShippingQuote");
const { pin, fingerprint, shippingFee } = require("../utils/shipping");

test("shipping quotes are bound to customer, cart and address; local shipping is free", async () => {
  const customer = { name: "Test", pincode: "462001", address: "Address" };
  const items = [{ productId: "p", quantity: 1, selectedOptions: { size: "M", colour: "Blue" } }];
  const reordered = [{ productId: "p", quantity: 1, selectedOptions: { colour: "Blue", size: "M" } }];
  assert.equal(fingerprint(customer, items), fingerprint(customer, reordered));
  assert.notEqual(fingerprint(customer, items), fingerprint(customer, [{ ...items[0], quantity: 2 }]));
  assert.throws(() => pin("abc"));
  let reads = 0;
  const original = Quote.findOne;
  Quote.findOne = async query => {
    reads++;
    assert.ok(query.expiresAt.$gt instanceof Date);
    assert.deepEqual(query.fee, { $ne: null });
    return query.customerAccount === "owner" && query.fingerprint === fingerprint(customer, items) ? { fee: 85 } : null;
  };
  try {
    assert.equal(await shippingFee("owner", { pincode: "466001" }, items), 0);
    assert.equal(reads, 0);
    await assert.rejects(shippingFee("owner", customer, items));
    const id = "123456789012345678901234";
    assert.equal(await shippingFee("owner", customer, items, id), 85);
    await assert.rejects(shippingFee("other", customer, items, id));
    await assert.rejects(shippingFee("owner", { ...customer, address: "Changed" }, items, id));
    await assert.rejects(shippingFee("owner", customer, [{ ...items[0], quantity: 2 }], id));
    Quote.findOne = async () => null;
    await assert.rejects(shippingFee("owner", customer, items, id));
  } finally { Quote.findOne = original; }
});

test("orders reject missing courier quotes before changing stock and calculate local delivery on server", async () => {
  const Product = require("../models/Product");
  const Order = require("../models/Order");
  const { placeOrder } = require("../controllers/orderController");
  const oldFind = Product.findById, oldUpdate = Product.findOneAndUpdate, oldCreate = Order.create;
  let writes = 0, saved;
  Product.findById = async () => ({ _id: "p", name: "Gift", isActive: true, stock: 5, minOrderQty: 1, maxOrderQty: 5, sellingPrice: 1200 });
  Product.findOneAndUpdate = async () => { writes++; return { stock: 4 }; };
  Order.create = async body => { saved = body; return body; };
  const response = () => ({ code: 200, status(n) { this.code = n; return this; }, json(body) { this.body = body; return this; } });
  const request = pincode => ({ customer: { _id: "owner" }, body: { customer: { pincode }, items: [{ productId: "p", quantity: 1 }], shippingFee: 0, paymentMethod: "COD" } });
  try {
    let res = response(); await placeOrder(request("462001"), res);
    assert.equal(res.code, 400); assert.equal(writes, 0); // No free shipping threshold, even above Rs. 999.
    res = response(); await placeOrder(request("466001"), res);
    assert.equal(res.code, 201); assert.equal(saved.shippingFee, 0); assert.equal(saved.grandTotal, 1230);
  } finally { Product.findById = oldFind; Product.findOneAndUpdate = oldUpdate; Order.create = oldCreate; }
});

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/adminApi";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/products/admin/all").then((res) => setProducts(res.data.products)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleStock = async (product) => {
    try {
      await api.patch(`/products/${product._id}/stock`, { outOfStock: !product.outOfStock });
      toast.success(`Marked as ${!product.outOfStock ? "out of stock" : "in stock"}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const remove = async (product) => {
    if (!confirm(`Remove "${product.name}" from the store?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      toast.success("Product removed");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-ivory">Products</h1>
        <Link to="/admin/products/new" className="bg-gold text-ink px-5 py-2.5 rounded-full text-sm font-semibold">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-muted uppercase text-xs border-b border-ink/10">
              <tr>
                <th className="py-3 pr-4">Product</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Discount</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Min Order</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-ink/[0.06] text-ivory/90">
                  <td className="py-3 pr-4 flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    {p.name}
                    {!p.isActive && <span className="text-[10px] text-red-600 border border-red-600/40 px-2 py-0.5 rounded-full">Hidden</span>}
                  </td>
                  <td className="py-3 pr-4 font-mono">Rs. {p.sellingPrice}</td>
                  <td className="py-3 pr-4">{p.discountPercent}%</td>
                  <td className="py-3 pr-4">{p.stock}</td>
                  <td className="py-3 pr-4">{p.minOrderQty}</td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => toggleStock(p)}
                      className={`text-xs px-2 py-1 rounded-full border ${p.outOfStock ? "border-red-600 text-red-600" : "border-green-600 text-green-600"}`}
                    >
                      {p.outOfStock ? "Out of Stock" : "In Stock"}
                    </button>
                  </td>
                  <td className="py-3 pr-4 space-x-3">
                    <Link to={`/admin/products/${p._id}/edit`} className="text-gold hover:underline text-xs">Edit</Link>
                    <button onClick={() => remove(p)} className="text-red-600 hover:underline text-xs">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

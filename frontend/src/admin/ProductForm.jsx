import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/adminApi";

const emptyField = { label: "", type: "text", required: true, maxLength: 50 };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    images: [],
    model3d: "",
    price: "",
    discountPercent: 0,
    offerTag: "",
    isPersonalized: true,
    personalizationFields: [{ ...emptyField }],
    stock: 0,
    minOrderQty: 1,
    maxOrderQty: 10,
    sku: "",
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/admin/all`, { params: { limit: 1000 } }).then((res) => {
        const p = res.data.products.find((x) => x._id === id);
        if (p) setForm(p);
      });
    }
  }, [id, isEdit]);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, images: [...f.images, res.data.url] }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Check Cloudinary config on the server.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const updateField = (idx, key, value) => {
    const fields = [...form.personalizationFields];
    fields[idx] = { ...fields[idx], [key]: value };
    setForm({ ...form, personalizationFields: fields });
  };
  const addField = () => setForm({ ...form, personalizationFields: [...form.personalizationFields, { ...emptyField }] });
  const removeField = (idx) => setForm({ ...form, personalizationFields: form.personalizationFields.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) return toast.error("Add at least one product image");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPercent: Number(form.discountPercent),
        stock: Number(form.stock),
        minOrderQty: Number(form.minOrderQty),
        maxOrderQty: Number(form.maxOrderQty),
        personalizationFields: form.isPersonalized ? form.personalizationFields.filter((f) => f.label) : [],
      };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-2.5 text-sm text-ivory";
  const labelClass = "block text-xs text-muted mb-1.5 uppercase tracking-wide";

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-ivory mb-8">{isEdit ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <section className="bg-surface p-6 rounded-xl border border-ink/[0.06] space-y-4">
          <h2 className="text-ivory font-semibold mb-2">Basic Information</h2>
          <div>
            <label className={labelClass}>Product Name *</label>
            <input required value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description *</label>
            <textarea required rows={4} value={form.description} onChange={(e) => handleChange("description", e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category *</label>
              <input required value={form.category} onChange={(e) => handleChange("category", e.target.value)} className={inputClass} placeholder="e.g. Engraved Jewelry" />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input value={form.sku} onChange={(e) => handleChange("sku", e.target.value)} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-surface p-6 rounded-xl border border-ink/[0.06] space-y-4">
          <h2 className="text-ivory font-semibold mb-2">Product Images</h2>
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs">×</button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm text-ivory" />
          {uploading && <p className="text-xs text-muted">Uploading...</p>}
          <div>
            <label className={labelClass}>Optional: 3D Model URL (.glb) for interactive viewer</label>
            <input value={form.model3d} onChange={(e) => handleChange("model3d", e.target.value)} className={inputClass} placeholder="https://.../model.glb" />
          </div>
        </section>

        {/* Pricing & Offers */}
        <section className="bg-surface p-6 rounded-xl border border-ink/[0.06] space-y-4">
          <h2 className="text-ivory font-semibold mb-2">Pricing, Offers & Discount</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (MRP) *</label>
              <input required type="number" min="0" value={form.price} onChange={(e) => handleChange("price", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Discount %</label>
              <input type="number" min="0" max="90" value={form.discountPercent} onChange={(e) => handleChange("discountPercent", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Offer Tag (shown as a badge, e.g. "Bestseller", "Limited Edition")</label>
            <input value={form.offerTag} onChange={(e) => handleChange("offerTag", e.target.value)} className={inputClass} />
          </div>
          <label className="flex items-center gap-2 text-sm text-ivory/80">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => handleChange("isFeatured", e.target.checked)} />
            Feature on homepage
          </label>
        </section>

        {/* Stock & order limits */}
        <section className="bg-surface p-6 rounded-xl border border-ink/[0.06] space-y-4">
          <h2 className="text-ivory font-semibold mb-2">Stock & Order Limits</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Stock Quantity *</label>
              <input required type="number" min="0" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Min Order Qty *</label>
              <input required type="number" min="1" value={form.minOrderQty} onChange={(e) => handleChange("minOrderQty", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Max Order Qty *</label>
              <input required type="number" min="1" value={form.maxOrderQty} onChange={(e) => handleChange("maxOrderQty", e.target.value)} className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ivory/80">
            <input type="checkbox" checked={form.isActive} onChange={(e) => handleChange("isActive", e.target.checked)} />
            Visible in store (uncheck to hide without deleting)
          </label>
        </section>

        {/* Personalization */}
        <section className="bg-surface p-6 rounded-xl border border-ink/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-ivory font-semibold">Personalization Options</h2>
            <label className="flex items-center gap-2 text-sm text-ivory/80">
              <input type="checkbox" checked={form.isPersonalized} onChange={(e) => handleChange("isPersonalized", e.target.checked)} />
              This product is personalized
            </label>
          </div>
          {form.isPersonalized && (
            <div className="space-y-3">
              {form.personalizationFields.map((field, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    placeholder="Field label (e.g. Name to engrave)"
                    value={field.label}
                    onChange={(e) => updateField(i, "label", e.target.value)}
                    className={inputClass}
                  />
                  <select value={field.type} onChange={(e) => updateField(i, "type", e.target.value)} className={inputClass + " w-32"}>
                    <option value="text">Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                  <label className="flex items-center gap-1 text-xs text-muted whitespace-nowrap">
                    <input type="checkbox" checked={field.required} onChange={(e) => updateField(i, "required", e.target.checked)} />
                    Required
                  </label>
                  <button type="button" onClick={() => removeField(i)} className="text-red-600 text-xs">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addField} className="text-gold text-sm hover:underline">+ Add another field</button>
            </div>
          )}
        </section>

        <button
          disabled={saving}
          className="bg-gold text-ink px-8 py-3 rounded-full font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
}

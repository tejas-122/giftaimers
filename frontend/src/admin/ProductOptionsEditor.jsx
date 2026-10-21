import React from "react";

export default function ProductOptionsEditor({ colours, sizesText, images, onColoursChange, onSizesChange }) {
  const input = "w-full min-w-0 border border-ink/10 bg-surface2 rounded-lg px-3 py-2 text-sm";
  const update = (index, field, value) => onColoursChange(colours.map((c, i) => i === index ? { ...c, [field]: value } : c));
  return <section className="bg-surface p-6 rounded-xl border border-ink/10 space-y-5">
    <div><h2 className="font-semibold">Colour &amp; size choices</h2><p className="text-sm text-muted mt-1">Optional choices customers select before adding to cart. All choices share this product's price and stock.</p></div>
    {colours.map((colour, index) => <div key={index} className="border border-ink/10 rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-3">
        <input type="color" aria-label={`Colour ${index + 1} swatch`} value={colour.hex || "#ffffff"} onChange={e => update(index, "hex", e.target.value)} />
        <input required maxLength={50} aria-label={`Colour ${index + 1} name`} placeholder="Colour name, e.g. White" value={colour.name} onChange={e => update(index, "name", e.target.value)} className={input} />
        <button type="button" onClick={() => onColoursChange(colours.filter((_, i) => i !== index))} className="text-red-600 text-xs">Remove</button>
      </div>
      <label className="block text-sm">Colour photo (optional)
        <select value={images.includes(colour.image) ? colour.image : ""} onChange={e => update(index, "image", e.target.value)} className={input + " mt-1"}>
          <option value="">Choose an uploaded product photo</option>
          {images.map((image, i) => <option key={i} value={image}>Product photo {i + 1}</option>)}
        </select>
      </label>
      <input type="url" aria-label={`Colour ${index + 1} image URL`} placeholder="Or paste an https:// image URL" value={colour.image || ""} onChange={e => update(index, "image", e.target.value)} className={input} />
      {colour.image && <img src={colour.image} alt={colour.name || "Colour preview"} className="w-20 h-20 object-contain rounded-lg" />}
    </div>)}
    <button type="button" disabled={colours.length >= 30} onClick={() => onColoursChange([...colours, { name: "", hex: "#ffffff", image: "" }])} className="text-gold text-sm disabled:opacity-50">+ Add colour</button>
    <label className="block text-sm">Available sizes
      <input value={sizesText} onChange={e => onSizesChange(e.target.value)} placeholder="S, M, L, XL, 2XL" className={input + " mt-1"} />
      <span className="block text-xs text-muted mt-1">Separate sizes with commas. Leave blank if there are no size choices.</span>
    </label>
  </section>;
}

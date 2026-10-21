import React from "react";
export default function ProductOptions({ product, selected, onChange }) {
  return <div className="space-y-5 mb-6">
    {product.colours?.length > 0 && <fieldset>
      <legend className="text-sm mb-2">Colour: <strong>{selected.colour || "Choose a colour"}</strong></legend>
      <div className="flex flex-wrap gap-2">
        {product.colours.map(colour => <button type="button" key={colour.name} aria-pressed={selected.colour === colour.name} onClick={() => onChange({ ...selected, colour: colour.name })}
          className={`w-24 rounded-xl border-2 p-2 text-left focus-visible:outline-gold ${selected.colour === colour.name ? "border-gold bg-gold/5" : "border-ink/10"}`}>
          {colour.image ? <img src={colour.image} alt={colour.name} className="w-full h-16 object-contain mb-2" /> : <span className="block w-full h-16 rounded-lg border border-ink/10 mb-2" style={{ backgroundColor: colour.hex }} />}
          <span className="block text-xs font-semibold break-words">{colour.name}</span>
          <span className="block text-xs mt-1">Rs. {product.sellingPrice}</span>
        </button>)}
      </div>
    </fieldset>}
    {product.sizes?.length > 0 && <fieldset>
      <legend className="text-sm mb-2">Size: <strong>{selected.size || "Choose a size"}</strong></legend>
      <div className="flex flex-wrap gap-2">{product.sizes.map(size => <button type="button" key={size} aria-pressed={selected.size === size} onClick={() => onChange({ ...selected, size })}
        className={`min-w-12 px-4 py-2 rounded-lg border-2 text-sm focus-visible:outline-gold ${selected.size === size ? "border-gold bg-gold/5 font-semibold" : "border-ink/10"}`}>{size}</button>)}</div>
    </fieldset>}
  </div>;
}

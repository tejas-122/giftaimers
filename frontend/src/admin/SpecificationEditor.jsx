import React from "react";

const presets = [
  ["Item details", ["Brand Name", "Manufacturer", "Number of Items", "Country of Origin", "Item Type", "Model Number", "Manufacturer Contact Information", "Packer Contact Information", "Importer Contact Information", "Manufacturer Part Number", "Unit Count", "Warranty Description"]],
  ["Measurements", ["Size", "Item Weight", "Item Dimensions (L x W x H)", "Item Thickness", "Number of Labels", "Line Size"]],
  ["Style", ["Colour", "Finish Type", "Item Shape", "Pattern", "Style Name", "Ink Colour"]],
  ["Additional details", ["Material Type", "Item Highlight", "Included Components", "Care Instructions"]],
];

export const createSpecificationSections = () => presets.map(([title, labels]) => ({
  title, rows: labels.map(label => ({ label, value: "" })),
}));

export const cleanSpecifications = (sections = []) => sections.map(section => {
  const title = section.title.trim();
  const rows = section.rows.map(row => ({ label: row.label.trim(), value: row.value.trim() }));
  if (rows.some(row => row.value && !row.label)) {
    throw new Error("Add a detail name for every specification value.");
  }
  const filledRows = rows.filter(row => row.value);
  if (filledRows.length && !title) {
    throw new Error("Add a section name for your specifications.");
  }
  return { title, rows: filledRows };
}).filter(section => section.rows.length);

export default function SpecificationEditor({ sections, onChange }) {
  const updateSection = (index, update) => onChange(sections.map((section, i) => i === index ? { ...section, ...update } : section));
  const updateRow = (sectionIndex, rowIndex, key, value) => updateSection(sectionIndex, {
    rows: sections[sectionIndex].rows.map((row, i) => i === rowIndex ? { ...row, [key]: value } : row),
  });
  const inputClass = "w-full min-w-0 bg-surface2 border border-ink/10 rounded-lg px-3 py-2.5 text-sm text-ivory";

  return (
    <section className="space-y-4" aria-labelledby="specifications-heading">
      <div>
        <h2 id="specifications-heading" className="text-ivory font-semibold">Product specifications</h2>
        <p className="text-sm text-muted mt-1">Optional details shown on the product page. Leave unused values blank. Include units for weights and dimensions, e.g. 180 g or 20 x 15 x 5 cm.</p>
      </div>
      {sections.map((section, sectionIndex) => (
        <details key={sectionIndex} open className="bg-surface rounded-xl border border-ink/10 overflow-hidden">
          <summary className="cursor-pointer px-5 py-4 font-semibold text-ivory bg-surface2 focus-visible:outline-gold">{section.title || "New section"}</summary>
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex items-end gap-3">
              <label className="flex-1 min-w-0 text-xs text-muted">Section name
                <input aria-label={`Section ${sectionIndex + 1} name`} required maxLength={80} value={section.title} onChange={e => updateSection(sectionIndex, { title: e.target.value })} className={inputClass + " mt-1"} />
              </label>
              <button type="button" onClick={() => onChange(sections.filter((_, i) => i !== sectionIndex))} className="text-red-600 text-xs py-3">Remove section</button>
            </div>
            {section.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_auto] gap-2 items-start border-t border-ink/10 pt-3">
                <input aria-label={`${section.title} detail ${rowIndex + 1} label`} placeholder="Detail name" required={Boolean(row.value.trim())} maxLength={100} value={row.label} onChange={e => updateRow(sectionIndex, rowIndex, "label", e.target.value)} className={inputClass} />
                <textarea aria-label={`${section.title}: ${row.label || `detail ${rowIndex + 1}`} value`} placeholder="Enter value (optional)" rows={2} maxLength={1000} value={row.value} onChange={e => updateRow(sectionIndex, rowIndex, "value", e.target.value)} className={inputClass + " resize-y"} />
                <button type="button" aria-label={`Remove ${row.label || "detail"} from ${section.title}`} onClick={() => updateSection(sectionIndex, { rows: section.rows.filter((_, i) => i !== rowIndex) })} className="text-red-600 text-xs py-2.5 justify-self-end">Remove</button>
              </div>
            ))}
            <button type="button" disabled={section.rows.length >= 40} onClick={() => updateSection(sectionIndex, { rows: [...section.rows, { label: "", value: "" }] })} className="text-gold text-sm hover:underline disabled:opacity-50">+ Add detail</button>
          </div>
        </details>
      ))}
      <button type="button" disabled={sections.length >= 10} onClick={() => onChange([...sections, { title: "", rows: [{ label: "", value: "" }] }])} className="text-gold text-sm hover:underline disabled:opacity-50">+ Add section</button>
    </section>
  );
}

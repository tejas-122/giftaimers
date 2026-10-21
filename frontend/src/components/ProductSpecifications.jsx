import React from "react";

export default function ProductSpecifications({ sections = [] }) {
  const visible = sections.map(section => ({ ...section, rows: (section.rows || []).filter(row => row.label?.trim() && row.value?.trim()) }))
    .filter(section => section.title?.trim() && section.rows.length);
  if (!visible.length) return null;

  return (
    <section className="md:col-span-2 min-w-0" aria-labelledby="product-details-heading">
      <h2 id="product-details-heading" className="font-display text-2xl text-ivory mb-5">Product details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {visible.map((section, index) => (
          <details key={index} open className="min-w-0 border border-ink/10 rounded-xl overflow-hidden">
            <summary className="bg-surface2 px-5 py-4 font-semibold text-ivory cursor-pointer focus-visible:outline-gold">{section.title}</summary>
            <dl className="px-4 sm:px-5">
              {section.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-3 border-t border-ink/10 text-sm">
                  <dt className="font-semibold text-muted break-words">{row.label}</dt>
                  <dd className="text-ivory whitespace-pre-wrap break-words">{row.value}</dd>
                </div>
              ))}
            </dl>
          </details>
        ))}
      </div>
    </section>
  );
}

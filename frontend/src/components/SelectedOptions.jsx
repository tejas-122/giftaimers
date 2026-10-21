import React from "react";
export default function SelectedOptions({ item }) {
  const options = item.selectedOptions || {};
  const text = [options.colour && `Colour: ${options.colour}`, options.size && `Size: ${options.size}`].filter(Boolean).join(" / ");
  return text ? <span className="block text-xs text-muted mt-1">{text}</span> : null;
}

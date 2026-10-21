function validateProductOptions(product, selected = {}) {
  const result = {};
  const colours = product.colours || [];
  const sizes = product.sizes || [];
  if (colours.length) {
    if (!colours.some(c => c.name === selected.colour)) throw new Error(`Choose an available colour for ${product.name}`);
    result.colour = selected.colour;
  } else if (selected.colour) throw new Error(`Colour options changed for ${product.name}. Please add it to your cart again.`);
  if (sizes.length) {
    if (!sizes.includes(selected.size)) throw new Error(`Choose an available size for ${product.name}`);
    result.size = selected.size;
  } else if (selected.size) throw new Error(`Size options changed for ${product.name}. Please add it to your cart again.`);
  return result;
}
module.exports = validateProductOptions;

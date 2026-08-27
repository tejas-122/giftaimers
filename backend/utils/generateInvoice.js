const PDFDocument = require("pdfkit");

/**
 * Streams a PDF invoice for the given order directly to an HTTP response.
 * Usage: generateInvoicePDF(order, res)
 */
function generateInvoicePDF(order, res) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order.invoiceNumber || order.orderNumber}.pdf`
  );
  doc.pipe(res);

  const storeName = process.env.STORE_NAME || "GiftAimers";
  const storeAddress = process.env.STORE_ADDRESS || "";
  const storeEmail = process.env.STORE_EMAIL || "";
  const storePhone = process.env.STORE_PHONE || "";

  // Header
  doc.fontSize(22).fillColor("#5B3A29").text(storeName, { continued: false });
  doc.fontSize(9).fillColor("#666666").text(storeAddress);
  doc.text(`${storeEmail}  |  ${storePhone}`);
  doc.moveDown(1.5);

  doc.fontSize(16).fillColor("#000000").text("TAX INVOICE", { align: "right" });
  doc.fontSize(10).fillColor("#333333");
  doc.text(`Invoice #: ${order.invoiceNumber || "N/A"}`, { align: "right" });
  doc.text(`Order #: ${order.orderNumber}`, { align: "right" });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, { align: "right" });
  doc.moveDown(1);

  // Bill To
  doc.fontSize(11).fillColor("#000000").text("Bill To:", { underline: true });
  doc.fontSize(10).fillColor("#333333");
  doc.text(order.customer.name);
  doc.text(order.customer.address);
  doc.text(`${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`);
  doc.text(`Phone: ${order.customer.phone}`);
  if (order.customer.email) doc.text(`Email: ${order.customer.email}`);
  doc.moveDown(1);

  // Table header
  const tableTop = doc.y + 10;
  const colX = { item: 50, qty: 300, price: 360, personalize: 430, total: 500 };

  const renderTableHeader = (currentY) => {
    doc.fontSize(10).fillColor("#ffffff");
    doc.rect(50, currentY, 500, 20).fill("#5B3A29");
    doc.fillColor("#ffffff");
    doc.text("Item", colX.item + 5, currentY + 5);
    doc.text("Qty", colX.qty, currentY + 5);
    doc.text("Price", colX.price, currentY + 5);
    doc.text("Total", colX.total, currentY + 5, { width: 50 });
    return currentY + 25;
  };

  let y = renderTableHeader(tableTop);
  doc.fillColor("#000000").fontSize(9);
  order.items.forEach((item) => {
    const hasPersonalization = item.personalization && Object.keys(item.personalization).length > 0;
    const requiredHeight = hasPersonalization ? 38 : 24;

    if (y + requiredHeight > 720) {
      doc.addPage();
      y = renderTableHeader(50);
      doc.fillColor("#000000").fontSize(9);
    }

    const lineTotal = item.price * item.quantity;
    doc.text(item.name, colX.item + 5, y, { width: 240 });
    doc.text(String(item.quantity), colX.qty, y);
    doc.text(`Rs. ${item.price}`, colX.price, y);
    doc.text(`Rs. ${lineTotal}`, colX.total, y, { width: 50 });
    if (hasPersonalization) {
      y += 14;
      const details = Object.entries(item.personalization)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      doc.fontSize(8).fillColor("#666666").text(`Personalization - ${details}`, colX.item + 5, y, { width: 440 });
      doc.fontSize(9).fillColor("#000000");
    }
    y += 20;
  });

  if (y + 180 > 750) {
    doc.addPage();
    y = 50;
  }

  doc.moveTo(50, y).lineTo(550, y).strokeColor("#dddddd").stroke();
  y += 10;

  const summaryX = 380;
  doc.fontSize(10);
  doc.text("Items Total:", summaryX, y);
  doc.text(`Rs. ${order.itemsTotal}`, 500, y, { width: 50 });
  y += 16;
  if (order.discountApplied) {
    doc.text("Discount:", summaryX, y);
    doc.text(`- Rs. ${order.discountApplied}`, 500, y, { width: 50 });
    y += 16;
  }
  doc.text("Shipping:", summaryX, y);
  doc.text(`Rs. ${order.shippingFee}`, 500, y, { width: 50 });
  y += 16;
  if (order.codFee) {
    doc.text("COD Fee:", summaryX, y);
    doc.text(`Rs. ${order.codFee}`, 500, y, { width: 50 });
    y += 16;
  }
  doc.fontSize(12).fillColor("#5B3A29");
  doc.text("Grand Total:", summaryX, y, { continued: false });
  doc.text(`Rs. ${order.grandTotal}`, 500, y, { width: 50 });

  y += 30;
  doc.fontSize(9).fillColor("#666666");
  doc.text(`Payment Method: ${order.paymentMethod}`, 50, y);
  y += 14;
  doc.text(`Payment Status: ${order.paymentStatus}`, 50, y);

  doc.moveDown(3);
  doc.fontSize(8).fillColor("#999999").text(
    "This is a computer-generated invoice from GiftAimers. Thank you for personalizing a moment with us!",
    50,
    doc.y,
    { align: "center", width: 500 }
  );

  doc.end();
}

module.exports = generateInvoicePDF;

export const renderEUTemplate = async (doc, invoice, b, h) => {
  const { accent, gray, formatDate, autoTable } = h;
  const currency = b.currency || "EUR";
  const c = invoice.client || {};

  let y = 20;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(...accent);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 15, y);

  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.setFont("helvetica", "normal");
  doc.text(`#${invoice.invoice_number}`, 15, y + 6);

  // Company block
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text(b.business_name || "Company", 140, y);

  if (b.address) doc.text(b.address, 140, y + 6);
  if (b.fiscal_code) doc.text(`VAT: ${b.fiscal_code}`, 140, y + 12);
  if (b.iban) doc.text(`IBAN: ${b.iban}`, 140, y + 18);

  y += 35;

  // Client
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", 15, y);

  doc.setFont("helvetica", "normal");
  doc.text(c.name || "Client", 15, y + 6);
  if (c.address) doc.text(c.address, 15, y + 12);

  // Dates
  doc.text(`Date: ${formatDate(invoice.date)}`, 140, y);
  doc.text(`Due: ${formatDate(invoice.due_date)}`, 140, y + 6);

  y += 20;

  // Table
  const items = invoice.items?.map(i => [
    i.description,
    i.quantity,
    `${i.unit_price.toFixed(2)} ${currency}`,
    `${i.total.toFixed(2)} ${currency}`
  ]) || [];

  autoTable(doc, {
    startY: y,
    head: [["Service", "Qty", "Price", "Total"]],
    body: items,
    headStyles: {
      fillColor: accent
    }
  });

  const endY = doc.lastAutoTable.finalY + 10;

  // Summary
  doc.text(`VAT (${b.vat_rate}%):`, 140, endY);
  doc.text(`${invoice.tax_amount.toFixed(2)} ${currency}`, 195, endY, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TOTAL", 140, endY + 10);
  doc.text(`${invoice.total.toFixed(2)} ${currency}`, 195, endY + 10, { align: "right" });
};

export const renderUSTemplate = async (doc, invoice, b, h) => {
  const { accent, gray, formatDate, autoTable } = h;
  const currency = b.currency || "USD";
  const c = invoice.client || {};

  let y = 20;

  doc.setFontSize(26);
  doc.setTextColor(...accent);
  doc.text("Invoice", 15, y);

  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.text(`Status: ${invoice.status}`, 15, y + 6);

  doc.text(`Client: ${c.name || "-"}`, 140, y);
  doc.text(`Date: ${formatDate(invoice.date)}`, 140, y + 6);

  y += 25;

  const items = invoice.items?.map(i => [
    i.description,
    i.quantity,
    i.unit_price,
    i.total
  ]) || [];

  autoTable(doc, {
    startY: y,
    head: [["Item", "Qty", "Unit", "Amount"]],
    body: items
  });

  const endY = doc.lastAutoTable.finalY + 10;

  doc.text("Sales Tax", 140, endY);
  doc.text(invoice.tax_amount.toFixed(2), 195, endY, { align: "right" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Total", 140, endY + 10);
  doc.text(invoice.total.toFixed(2), 195, endY + 10, { align: "right" });
};

export const renderGlobalTemplate = async (doc, invoice, b, h) => {
  const { accent, QRCode, autoTable } = h;
  const currency = b.currency || "USD";

  let y = 20;

  const qr = await QRCode.toDataURL("https://invoice-generator-ungi.vercel.app/");
  doc.addImage(qr, "PNG", 160, 10, 35, 35);

  doc.setFontSize(24);
  doc.setTextColor(...accent);
  doc.text("Freelance Invoice", 15, y);

  y += 25;

  const items = invoice.items?.map(i => [
    i.description,
    i.quantity,
    i.total
  ]) || [];

  autoTable(doc, {
    startY: y,
    head: [["Work", "Hours", "Amount"]],
    body: items
  });

  const endY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(14);
  doc.text("Total", 150, endY);
  doc.text(`${invoice.total.toFixed(2)} ${currency}`, 195, endY, { align: "right" });

  doc.setFontSize(10);
  doc.text("Thank you for your business!", 75, 280);
};

export const renderEnterpriseTemplate = async (doc, invoice, b, h) => {
  const { accent, QRCode, autoTable } = h;
  const currency = b.currency || "EUR";

  let y = 20;

  const qr = await QRCode.toDataURL(invoice._id);
  doc.addImage(qr, "PNG", 160, 10, 35, 35);

  doc.setFontSize(26);
  doc.setTextColor(...accent);
  doc.text("E-INVOICE", 15, y);

  doc.setFontSize(10);
  doc.text(`Document ID: ${invoice._id}`, 15, y + 6);

  y += 25;

  const items = invoice.items?.map(i => [
    i.description,
    i.quantity,
    i.total
  ]) || [];

  autoTable(doc, {
    startY: y,
    head: [["Description", "Qty", "Total"]],
    body: items
  });

  const endY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.text("Grand Total", 140, endY);
  doc.text(`${invoice.total.toFixed(2)} ${currency}`, 195, endY, { align: "right" });
};
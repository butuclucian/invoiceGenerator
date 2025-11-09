import fs from "fs";
import PDFDocument from "pdfkit";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

// ✅ Inițializăm Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * ✅ Creează PDF temporar pentru o factură
 */
const generateInvoicePDF = (invoice, client) => {
  const pdfPath = `./invoice_${invoice.invoice_number}.pdf`;
  const doc = new PDFDocument({ margin: 50 });

  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  // 🔹 Header
  doc
    .fontSize(24)
    .fillColor("#4F46E5")
    .text("BillForge AI", { align: "center" })
    .moveDown(1);

  // 🔹 Invoice info
  doc
    .fontSize(13)
    .fillColor("black")
    .text(`Invoice Number: ${invoice.invoice_number}`)
    .text(`Date: ${invoice.date}`)
    .text(`Due Date: ${invoice.due_date || "—"}`)
    .moveDown(1);

  // 🔹 Client Info
  doc
    .fontSize(13)
    .fillColor("#444")
    .text(`Client: ${client.name}`)
    .text(`Email: ${client.email}`)
    .text(`Phone: ${client.phone || "—"}`)
    .text(`Address: ${client.address || "—"}`)
    .moveDown(1);

  // 🔹 Items
  doc.fontSize(13).fillColor("black").text("Items:").moveDown(0.5);
  invoice.items.forEach((item, i) => {
    doc.text(
      `${i + 1}. ${item.description} — ${item.quantity} × $${item.unit_price} = $${item.total}`
    );
  });

  // 🔹 Totals
  doc.moveDown();
  doc.text(`Subtotal: $${invoice.subtotal}`);
  doc.text(`Tax: ${invoice.tax_rate}%`);
  doc.text(`Discount: ${invoice.discount_rate}%`);
  doc.moveDown();
  doc
    .fontSize(15)
    .fillColor("#4F46E5")
    .text(`Total: $${invoice.total}`, { align: "right" });

  // 🔹 Footer
  doc.moveDown(3);
  doc
    .fontSize(11)
    .fillColor("gray")
    .text("Thank you for your business!", { align: "center" });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(pdfPath));
    stream.on("error", reject);
  });
};

/**
 * ✅ Trimite email prin RESEND (production-ready)
 */
export const sendInvoiceEmail = async (invoice, client) => {
  if (!client?.email) {
    console.warn("⚠️ No client email — skipping send.");
    return;
  }

  console.log(`📨 Sending invoice email via Resend to ${client.email}`);

  try {
    // 1️⃣ Generează PDF
    const pdfPath = await generateInvoicePDF(invoice, client);
    const pdfBuffer = fs.readFileSync(pdfPath);

    // 2️⃣ Conținut email
    const subject = `🧾 Invoice ${invoice.invoice_number}`;
    const html = `
      <div style="font-family:Arial,sans-serif;padding:20px;color:#333;">
        <img src="https://cdn-icons-png.flaticon.com/512/9429/9429026.png" alt="Logo" width="60" style="display:block;margin:auto;margin-bottom:15px;">
        <h2 style="color:#4F46E5;text-align:center;">Hello ${client.name || "Client"},</h2>
        <p style="text-align:center;">You’ve received a new invoice from <b>BillForge AI</b>.</p>
        <div style="margin:20px auto;max-width:400px;background:#f5f5f5;padding:15px;border-radius:10px;">
          <p><b>Invoice Number:</b> ${invoice.invoice_number}</p>
          <p><b>Total:</b> $${invoice.total}</p>
          <p><b>Due Date:</b> ${invoice.due_date || "—"}</p>
        </div>
        <p style="text-align:center;">The PDF invoice is attached below.</p>
        <p style="text-align:center;margin-top:20px;color:#666;">Thank you for your business!<br><b>BillForge AI</b></p>
      </div>
    `;

    // 3️⃣ Trimitem email prin Resend
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: client.email,
      subject,
      html,
      attachments: [
        {
          filename: `Invoice_${invoice.invoice_number}.pdf`,
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    console.log("✅ Resend response:", response);

    // 4️⃣ Ștergem PDF-ul temporar
    fs.unlink(pdfPath, (err) => {
      if (err) console.warn("⚠️ Could not delete temp PDF:", err);
    });
  } catch (error) {
    console.error("❌ Error sending invoice email via Resend:", error);
  }
};

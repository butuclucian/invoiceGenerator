import nodemailer from "nodemailer";
import fs from "fs";
import PDFDocument from "pdfkit";
import dotenv from "dotenv";
dotenv.config();

// ✅ Configurare Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * ✅ Creează PDF temporar pentru o factură
 */
const generateInvoicePDF = (invoice, client) => {
  const pdfPath = `./invoice_${invoice.invoice_number}.pdf`;
  const doc = new PDFDocument({ margin: 50 });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // 🔹 Header
  doc
    .fontSize(22)
    .fillColor("#4F46E5")
    .text("Invoice Generator", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(14)
    .fillColor("black")
    .text(`Invoice Number: ${invoice.invoice_number}`)
    .text(`Date: ${invoice.date}`)
    .text(`Due Date: ${invoice.due_date || "—"}`)
    .moveDown();

  // 🔹 Client Info
  doc
    .fontSize(14)
    .fillColor("#444")
    .text(`Client: ${client.name}`)
    .text(`Email: ${client.email}`)
    .moveDown();

  // 🔹 Items Table
  doc.fontSize(13).fillColor("black").text("Items:", { underline: true }).moveDown(0.5);

  invoice.items.forEach((item, idx) => {
    doc.text(`${idx + 1}. ${item.description} — ${item.quantity} × $${item.unit_price} = $${item.total}`);
  });

  // 🔹 Totals
  doc.moveDown();
  doc.fontSize(13).fillColor("black").text(`Subtotal: $${invoice.subtotal}`);
  doc.text(`Tax Rate: ${invoice.tax_rate}%`);
  doc.text(`Discount: ${invoice.discount_rate}%`);
  doc.moveDown();
  doc.fontSize(15).fillColor("#4F46E5").text(`Total: $${invoice.total}`, { align: "right" });

  // 🔹 Footer
  doc.moveDown(2).fontSize(11).fillColor("gray").text("Thank you for your business!", { align: "center" });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(pdfPath));
    writeStream.on("error", reject);
  });
};

/**
 * ✅ Trimite email cu PDF atașat
 */
export const sendInvoiceEmail = async (invoice, client) => {
  if (!client?.email) {
    console.warn("⚠️ Client has no email, skipping email send.");
    return;
  }

  try {
    // 1️⃣ Generează PDF
    const pdfPath = await generateInvoicePDF(invoice, client);

    // 2️⃣ Trimite email cu atașament
    const mailOptions = {
      from: `"Invoice Generator" <${process.env.EMAIL_USER}>`,
      to: client.email,
      subject: `🧾 New Invoice ${invoice.invoice_number}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;color:#333;">
          <h2 style="color:#4F46E5;">Hello ${client.name || "Client"},</h2>
          <p>You've received a new invoice. Details are attached as PDF.</p>
          <p><b>Invoice Number:</b> ${invoice.invoice_number}</p>
          <p><b>Total:</b> $${invoice.total}</p>
          <p><b>Due Date:</b> ${invoice.due_date || "—"}</p>
          <p>Thank you for your business!</p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${invoice.invoice_number}.pdf`,
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // 3️⃣ Șterge PDF-ul temporar
    fs.unlink(pdfPath, (err) => {
      if (err) console.warn("⚠️ Could not delete temp PDF:", err);
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

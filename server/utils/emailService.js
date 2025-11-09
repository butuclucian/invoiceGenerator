import fs from "fs";
import PDFDocument from "pdfkit";
import { Resend } from "resend";
import dotenv from "dotenv";
import axios from "axios"; // 👈 necesar pentru logo buffer

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// 🎨 Culoare accent albastru închis
const accent = [58 / 255, 110 / 255, 165 / 255];
const gray = [60, 60, 60];
const lightGray = "#dddddd";

/**
 * ✅ Creează PDF profesional (identic cu cel din aplicație)
 */
const generateInvoicePDF = async (invoice, client) => {
  const pdfPath = `./invoice_${invoice.invoice_number}.pdf`;
  const doc = new PDFDocument({ margin: 50 });
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // ===== HEADER =====
  try {
    const logoResponse = await axios.get(
      "https://cdn-icons-png.flaticon.com/512/9429/9429026.png",
      { responseType: "arraybuffer" }
    );
    const logoBuffer = Buffer.from(logoResponse.data, "binary");
    doc.image(logoBuffer, 50, 40, { width: 40 });
  } catch (err) {
    console.warn("⚠️ Could not load logo image:", err.message);
  }

  doc.font("Helvetica-Bold").fontSize(22).fillColor("black").text("BillForge AI", 100, 45);
  doc.font("Helvetica").fontSize(10).fillColor("#666").text("Smart Invoice Generator", 100, 65);
  doc.moveTo(50, 90).lineTo(550, 90).strokeColor(lightGray).stroke();

  // ===== COMPANY & CLIENT INFO =====
  let y = 110;
  doc.fontSize(14).fillColor("rgb(58,110,165)").font("Helvetica-Bold").text("From:", 50, y);
  doc.fontSize(12).fillColor("#333").font("Helvetica");
  y += 18;
  doc.text("BillForge AI Inc.", 50, y);
  doc.text("123 Innovation Blvd", 50, (y += 15));
  doc.text("Timișoara, Romania", 50, (y += 15));
  doc.text("support@billforge.ai", 50, (y += 15));

  let rightY = 110;
  doc.font("Helvetica-Bold").fillColor("rgb(58,110,165)").text("Bill To:", 320, rightY);
  doc.font("Helvetica").fillColor("#333");
  rightY += 18;
  const c = client || {};
  doc.text(c.name || "Unknown Client", 320, rightY);
  if (c.company && c.company !== c.name) doc.text(c.company, 320, (rightY += 15));
  if (c.email) doc.text(c.email, 320, (rightY += 15));
  if (c.phone) doc.text(c.phone, 320, (rightY += 15));
  if (c.address) doc.text(c.address, 320, (rightY += 15));

  // ===== INVOICE INFO =====
  let infoY = Math.max(y, rightY) + 25;
  doc.font("Helvetica-Bold").fillColor("rgb(58,110,165)").text("Invoice Details:", 50, infoY);
  doc.font("Helvetica").fillColor("#333");
  doc.text(`Invoice Number: ${invoice.invoice_number}`, 50, infoY + 15);
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 50, infoY + 30);
  doc.text(
    `Due Date: ${
      invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "-"
    }`,
    50,
    infoY + 45
  );
  doc.text(`Status: ${invoice.status}`, 50, infoY + 60);

  // ===== TABLE HEADER =====
  const tableY = infoY + 90;
  doc.rect(50, tableY, 500, 25).fill("rgb(58,110,165)");
  doc.fillColor("white").font("Helvetica-Bold").fontSize(12);
  doc.text("Description", 60, tableY + 7);
  doc.text("Qty", 290, tableY + 7);
  doc.text("Unit Price", 370, tableY + 7);
  doc.text("Total", 470, tableY + 7);

  // ===== TABLE ROWS =====
  let rowY = tableY + 25;
  doc.font("Helvetica").fontSize(11).fillColor("#333");

  invoice.items.forEach((item, i) => {
    const bg = i % 2 === 0 ? "#f5f7fa" : "#ffffff";
    doc.rect(50, rowY, 500, 20).fill(bg);
    doc.fillColor("#333");
    doc.text(item.description, 60, rowY + 5, { width: 220 });
    doc.text(item.quantity.toString(), 290, rowY + 5);
    doc.text(`$${item.unit_price.toFixed(2)}`, 370, rowY + 5);
    doc.text(`$${item.total.toFixed(2)}`, 470, rowY + 5);
    rowY += 20;
  });

  // ===== TOTALS =====
  rowY += 15;
  doc.font("Helvetica-Bold").fillColor("rgb(58,110,165)").text("Summary", 380, rowY);
  doc.font("Helvetica").fillColor("#333");
  rowY += 15;
  doc.text("Subtotal:", 380, rowY);
  doc.text(`$${invoice.subtotal.toFixed(2)}`, 480, rowY, { align: "right" });
  rowY += 15;
  doc.text("Tax Rate:", 380, rowY);
  doc.text(`${invoice.tax_rate}%`, 480, rowY, { align: "right" });
  rowY += 15;
  doc.text("Discount:", 380, rowY);
  doc.text(`${invoice.discount_rate}%`, 480, rowY, { align: "right" });
  rowY += 20;
  doc.font("Helvetica-Bold").fillColor("rgb(58,110,165)").fontSize(13);
  doc.text("Total:", 380, rowY);
  doc.text(`$${invoice.total.toFixed(2)}`, 480, rowY, { align: "right" });

  // ===== NOTES =====
  if (invoice.notes) {
    rowY += 40;
    doc.font("Helvetica-Bold").fillColor("rgb(58,110,165)").text("Notes:", 50, rowY);
    doc.font("Helvetica").fillColor("#333").fontSize(11);
    doc.text(invoice.notes, 50, rowY + 15, { width: 500 });
  }

  // ===== SIGNATURES =====
  const signY = rowY + 80;
  doc.moveTo(80, signY).lineTo(220, signY).strokeColor(lightGray).stroke();
  doc.moveTo(330, signY).lineTo(470, signY).strokeColor(lightGray).stroke();
  doc.fontSize(10).fillColor("#666");
  doc.text("Client Signature", 110, signY + 5);
  doc.text("Authorized Signature", 350, signY + 5);

  // ===== FOOTER =====
  doc.fontSize(9).fillColor("#999");
  doc.text("Generated by BillForge AI • www.billforge.app", 50, 780, {
    align: "center",
  });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(pdfPath));
    writeStream.on("error", reject);
  });
};

/**
 * ✅ Trimite email cu Resend + PDF identic cu cel din app
 */
export const sendInvoiceEmail = async (invoice, client) => {
  if (!client?.email) {
    console.warn("⚠️ Client has no email, skipping email send.");
    return;
  }

  try {
    console.log("📄 Generating PDF for invoice:", invoice.invoice_number);
    const pdfPath = await generateInvoicePDF(invoice, client);
    console.log("✅ PDF generated:", pdfPath);

    const pdfData = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfData.toString("base64");

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: client.email,
      subject: `🧾 Invoice ${invoice.invoice_number} from BillForge AI`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;color:#333;">
          <h2 style="color:#3a6ea5;">Hello ${client.name || "Client"},</h2>
          <p>You’ve received a new invoice from <b>BillForge AI</b>.</p>
          <p><b>Invoice Number:</b> ${invoice.invoice_number}</p>
          <p><b>Total:</b> $${invoice.total.toFixed(2)}</p>
          <p><b>Due Date:</b> ${
            invoice.due_date
              ? new Date(invoice.due_date).toLocaleDateString()
              : "—"
          }</p>
          <p style="margin-top:20px;">Please find the full invoice attached as PDF.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${invoice.invoice_number}.pdf`,
          path: pdfBase64,
        },
      ],
    });

    console.log("✅ Resend API response:", response);
    console.log("✅ Invoice email sent successfully via Resend");

    fs.unlink(pdfPath, (err) => {
      if (err) console.warn("⚠️ Could not delete temp PDF:", err);
    });
  } catch (error) {
    console.error("❌ Error sending invoice email:", error);
  }
};

import fs from "fs";
import PDFDocument from "pdfkit";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// const accent = [58 / 255, 110 / 255, 165 / 255];
// const lightGray = "#dddddd";
const accent = hexToRgb("#0f6c91");
const gray = [60, 60, 60];

const generateInvoicePDF = (invoice, client, business = {}) => {
  const pdfPath = `./invoice_${invoice.invoice_number}.pdf`;
  const doc = new PDFDocument({ margin: 40 });
  const writeStream = fs.createWriteStream(pdfPath);

  doc.pipe(writeStream);

  const { accent, gray, formatDate, autoTable } = h;
  const currency = b.currency || "RON";
  const c = invoice.client || {};

  let y = 20;

  doc.setFontSize(24);
  doc.setTextColor(...accent);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 15, y);

  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.setFont("helvetica", "normal");
  doc.text(`#${invoice.invoice_number}`, 15, y + 6);

  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text(b.business_name || "Company", 140, y);

  if (b.address) doc.text(b.address, 140, y + 6);
  if (b.fiscal_code) doc.text(`VAT: ${b.fiscal_code}`, 140, y + 12);
  if (b.iban) doc.text(`IBAN: ${b.iban}`, 140, y + 18);

  y += 35;

  doc.setFont("helvetica", "bold");
  doc.text("Bill To", 15, y);

  doc.setFont("helvetica", "normal");
  doc.text(c.name || "Client", 15, y + 6);
  if (c.address) doc.text(c.address, 15, y + 12);

  doc.text(`Date: ${formatDate(invoice.date)}`, 140, y);
  doc.text(`Due: ${formatDate(invoice.due_date)}`, 140, y + 6);

  y += 20;

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

  doc.text(`VAT (${b.vat_rate}%):`, 140, endY);
  doc.text(`${invoice.tax_amount.toFixed(2)} ${currency}`, 195, endY, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TOTAL", 140, endY + 10);
  doc.text(`${invoice.total.toFixed(2)} ${currency}`, 195, endY + 10, { align: "right" });


  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(pdfPath));
    writeStream.on("error", reject);
  });
};


export const sendInvoiceEmail = async (invoice, client) => {
  if (!client?.email) {
    console.warn("⚠️ [EmailService] Client has no email, skipping email send.");
    return;
  }

  try {
    console.log(`[EmailService] Se generează PDF-ul pentru factura ${invoice.invoice_number || 'draft'}...`);
    const pdfPath = await generateInvoicePDF(invoice, client);

    // Citirea fișierului PDF generat temporar din memoria Docker și conversia în Base64
    const pdfData = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfData.toString("base64");

    console.log(`[EmailService] Se expediază e-mailul prin Resend către adresa de test...`);
    
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "butuclucian04@gmail.com", 
      subject: `Factură nouă emisă de invoiceGenAI: ${invoice.invoice_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #4F46E5; text-align: center;">Hello ${client.name || "Client"},</h2>
          <p style="text-align: center; font-size: 15px;">You’ve received a new invoice from <b>invoiceGenAI</b>.</p>
          
          <div style="margin: 20px auto; max-width: 400px; background: #f9f9f9; padding: 20px; border-radius: 10px; border-left: 4px solid #4F46E5;">
            <p style="margin: 5px 0;"><b>Invoice Number:</b> ${invoice.invoice_number}</p>
            <p style="margin: 5px 0;"><b>Total Amount:</b> ${invoice.total?.toFixed(2)} ${invoice.currency || 'RON'}</p>
            <p style="margin: 5px 0;"><b>Due Date:</b> ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('ro-RO') : "—"}</p>
          </div>
          
          <p style="text-align: center; font-size: 14px; color: #666;">The official PDF document is attached to this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #999; font-size: 12px;">Thank you for your business!<br><b>invoiceGenAI Team</b></p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${invoice.series || 'INV'}-${invoice.invoice_number}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    if (response.error) {
      console.error("❌ [EmailService] Resend validation error:", response.error);
      throw new Error(response.error.message || "Resend failed to deliver email");
    } else {
      console.log("\x1b[32m✉️ [EmailService] Invoice email sent successfully via Resend to butuclucian04@gmail.com!\x1b[0m");
    }


    fs.unlink(pdfPath, (err) => {
      if (err) console.warn("⚠️ [EmailService] Could not delete temp PDF:", err.message);
      else console.log("🧹 [EmailService] Temp PDF deleted successfully from workspace.");
    });

    return response;

  } catch (error) {
    console.error("❌ [EmailService] Fatal error sending invoice email:", error.message || error);
    throw error; 
  }
};
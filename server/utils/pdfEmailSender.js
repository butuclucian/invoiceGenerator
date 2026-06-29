import fs from "fs";
import PDFDocument from "pdfkit";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const accent = [58 / 255, 110 / 255, 165 / 255];
const lightGray = "#dddddd";


const generateInvoicePDF = (invoice, client, business = {}) => {
  const pdfPath = `./invoice_${invoice.invoice_number}.pdf`;
  const doc = new PDFDocument({ margin: 40 });
  const writeStream = fs.createWriteStream(pdfPath);

  doc.pipe(writeStream);

  const accent = "#3A6EA5";
  const gray = "#374151";
  const lightGray = "#E5E7EB";

  const currency = business.currency || "EUR";
  const c = invoice.client || client || {};

  let y = 40;

  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor(accent)
    .text("INVOICE", 40, y);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(gray)
    .text(`#${invoice.invoice_number}`, 40, y + 28);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111")
    .text(business.business_name || "Company", 350, y);

  doc.font("Helvetica").fontSize(10).fillColor(gray);

  if (business.address) doc.text(business.address, 350, y + 16);
  if (business.fiscal_code) doc.text(`VAT: ${business.fiscal_code}`, 350, y + 32);
  if (business.iban) doc.text(`IBAN: ${business.iban}`, 350, y + 48);

  doc
    .moveTo(40, 115)
    .lineTo(555, 115)
    .strokeColor(lightGray)
    .stroke();

  y = 135;

  doc.font("Helvetica-Bold").fillColor(accent).fontSize(11).text("BILL TO", 40, y);

  doc.font("Helvetica").fillColor(gray).fontSize(10);

  doc.text(c.name || "Client", 40, y + 18);
  if (c.address) doc.text(c.address, 40, y + 33);
  if (c.email) doc.text(c.email, 40, y + 48);

  doc.font("Helvetica-Bold").fillColor("#111").text("DETAILS", 350, y);

  doc.font("Helvetica").fillColor(gray);

  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 350, y + 18);
  doc.text(
    `Due: ${
      invoice.due_date
        ? new Date(invoice.due_date).toLocaleDateString()
        : "-"
    }`,
    350,
    y + 33
  );

  y = 220;

  doc.rect(40, y, 515, 25).fill(accent);

  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Service", 50, y + 8)
    .text("Qty", 300, y + 8)
    .text("Price", 370, y + 8)
    .text("Total", 460, y + 8);

  y += 25;

  let subtotal = 0;

  (invoice.items || []).forEach((item, i) => {
    const rowHeight = 22;

    if (i % 2 === 0) {
      doc.rect(40, y, 515, rowHeight).fill("#F9FAFB");
    }

    doc.fillColor(gray).font("Helvetica").fontSize(10);

    doc.text(item.description, 50, y + 6, { width: 240 });
    doc.text(String(item.quantity), 300, y + 6);
    doc.text(`${item.unit_price.toFixed(2)} ${currency}`, 370, y + 6);
    doc.text(`${item.total.toFixed(2)} ${currency}`, 460, y + 6);

    subtotal += item.total;
    y += rowHeight;
  });

  y += 20;

  const vat = invoice.tax_amount || 0;

  doc.font("Helvetica").fontSize(10).fillColor(gray);

  doc.text("Subtotal:", 370, y);
  doc.text(`${subtotal.toFixed(2)} ${currency}`, 460, y);

  y += 15;

  doc.text(`VAT (${invoice.tax_rate || 0}%)`, 370, y);
  doc.text(`${vat.toFixed(2)} ${currency}`, 460, y);

  y += 20;

  doc.font("Helvetica-Bold").fillColor(accent).fontSize(13);
  doc.text("TOTAL", 370, y);
  doc.text(`${invoice.total.toFixed(2)} ${currency}`, 460, y);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#9CA3AF")
    .text(
      "This invoice was generated electronically and is valid without signature.",
      40,
      780,
      { align: "center", width: 515 }
    );

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(pdfPath));
    writeStream.on("error", reject);
  });
};


export const sendInvoiceEmail = async (invoice, client) => {
  if (!client?.email) {
    console.warn("[EmailService] Client has no email, skipping email send.");
    return;
  }

  try {
    const pdfPath = await generateInvoicePDF(invoice, client);

    const pdfData = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfData.toString("base64");
    
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
          filename: `Invoice_${invoice.invoice_number}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    if (response.error) {
      throw new Error(response.error.message || "Resend failed to deliver email");
    } else {
      console.log("[EmailService] Invoice email sent successfully via Resend to butuclucian04@gmail.com!");
    }


    fs.unlink(pdfPath, (err) => {
      if (err) console.warn("[EmailService] Could not delete temp PDF:", err.message);
      else console.log("[EmailService] Temp PDF deleted successfully from workspace.");
    });

    return response;

  } catch (error) {
    console.error("[EmailService] Fatal error sending invoice email:", error.message || error);
    throw error; 
  }
};
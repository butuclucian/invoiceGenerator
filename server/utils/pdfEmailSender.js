import fs from "fs";
import PDFDocument from "pdfkit";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const generateInvoicePDF = (invoice, client, business = {}) => {
  const pdfPath = `./invoice_${invoice.invoice_number}.pdf`;
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const writeStream = fs.createWriteStream(pdfPath);

  doc.pipe(writeStream);

  const bgColor = "#F5F2EC";
  const textColor = "#1a1a1a";
  const gray = "#555555";

  doc.rect(0, 0, 600, 900).fill(bgColor);
  
  doc.fillColor(textColor).font("Helvetica-Bold").fontSize(36).text("FACTURĂ", { align: "center" });
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(textColor).stroke();
  doc.moveDown(2);

  const startY = doc.y;
  doc.fontSize(10).font("Helvetica-Bold").fillColor(textColor).text("Furnizor", 50, startY);
  doc.font("Helvetica").fontSize(9).fillColor(textColor);
  doc.text(business.business_name || "Nume firmă", 50, doc.y + 2);
  doc.text(business.email || "", 50, doc.y + 2);
  doc.text(business.cif || "", 50, doc.y + 2);
  doc.text(business.address || "", 50, doc.y + 2);

  doc.font("Helvetica-Bold").text("Detalii Factură", 350, startY);
  doc.font("Helvetica").text(`Nr. Factură: ${invoice.invoice_number}`, 350, startY + 12);
  doc.text(`Dată: ${new Date(invoice.date).toLocaleDateString("en-GB")}`, 350, startY + 24);
  doc.text(`Scadentă: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("en-GB") : "-"}`, 350, startY + 36);

  doc.moveDown(4);

  let y = doc.y;
  doc.moveTo(50, y).lineTo(545, y).stroke();
  y += 10;
  
  doc.font("Helvetica-Bold").fontSize(9).fillColor(gray);
  doc.text("Nr", 50, y);
  doc.text("Descriere", 80, y);
  doc.text("Preț", 350, y);
  doc.text("Cantitate", 420, y);
  doc.text("Total", 490, y);
  
  y += 15;
  doc.moveTo(50, y).lineTo(545, y).stroke();
  y += 10;

  (invoice.items || []).forEach((item, i) => {
    doc.fillColor(textColor).font("Helvetica").fontSize(9);
    doc.text(String(i + 1).padStart(2, "0"), 50, y);
    doc.text(item.description, 80, y, { width: 250 });
    doc.text(`${item.unit_price.toFixed(2)}`, 350, y);
    doc.text(`${item.quantity}`, 420, y);
    doc.text(`${item.total.toFixed(2)}`, 490, y);
    y += 20;
  });

  y += 20;
  const currency = business.currency || "RON";
  doc.font("Helvetica").fontSize(9).fillColor(gray);
  doc.text("Subtotal:", 350, y);
  doc.text(`${invoice.subtotal.toFixed(2)} ${currency}`, 490, y);
  y += 15;
  doc.text(`TVA (${invoice.tax_rate || 19}%):`, 350, y);
  doc.text(`${(invoice.tax_amount || 0).toFixed(2)} ${currency}`, 490, y);
  y += 15;
  doc.font("Helvetica-Bold").fontSize(11).fillColor(textColor);
  doc.text("Total:", 350, y);
  doc.text(`${invoice.total.toFixed(2)} ${currency}`, 490, y);

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(pdfPath));
    writeStream.on("error", reject);
  });
};

export { generateInvoicePDF };


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
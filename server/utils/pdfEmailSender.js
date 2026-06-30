import fs from "fs";
import PDFDocument from "pdfkit";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// const generateInvoicePDF = (invoice, client, business = {}) => {
//   const pdfPath = `./invoice_${invoice.invoice_number}.pdf`;
//   const doc = new PDFDocument({ margin: 50, size: 'A4' });
//   const writeStream = fs.createWriteStream(pdfPath);

//   doc.pipe(writeStream);

//   const bgColor = "#F5F2EC";
//   const textColor = "#1a1a1a";
//   const gray = "#555555";

//   doc.rect(0, 0, 600, 900).fill(bgColor);
  
//   doc.fillColor(textColor).font("Helvetica-Bold").fontSize(36).text("FACTURA", { align: "center" });
//   doc.moveDown(0.5);
//   doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(textColor).stroke();
//   doc.moveDown(2);

//   const startY = doc.y;
//   doc.fontSize(10).font("Helvetica-Bold").fillColor(textColor).text("Furnizor", 50, startY);
//   doc.font("Helvetica").fontSize(9).fillColor(textColor);
//   doc.text(business.business_name || "Nume firmă", 50, doc.y + 2);
//   doc.text(business.email || "", 50, doc.y + 2);
//   doc.text(business.cif || "", 50, doc.y + 2);
//   doc.text(business.address || "", 50, doc.y + 2);

//   doc.font("Helvetica-Bold").text("Detalii Factura", 350, startY);
//   doc.font("Helvetica").text(`Nr. Factura ${invoice.invoice_number}`, 350, startY + 12);
//   doc.text(`Data ${new Date(invoice.date).toLocaleDateString("en-GB")}`, 350, startY + 24);
//   doc.text(`Scadenta ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("en-GB") : "-"}`, 350, startY + 36);

//   doc.moveDown(4);

//   let y = doc.y;
//   doc.moveTo(50, y).lineTo(545, y).stroke();
//   y += 10;
  
//   doc.font("Helvetica-Bold").fontSize(9).fillColor(gray);
//   doc.text("Nr", 50, y);
//   doc.text("Descriere", 80, y);
//   doc.text("Preț", 350, y);
//   doc.text("Cantitate", 420, y);
//   doc.text("Total", 490, y);
  
//   y += 15;
//   doc.moveTo(50, y).lineTo(545, y).stroke();
//   y += 10;

//   (invoice.items || []).forEach((item, i) => {
//     doc.fillColor(textColor).font("Helvetica").fontSize(9);
//     doc.text(String(i + 1).padStart(2, "0"), 50, y);
//     doc.text(item.description, 80, y, { width: 250 });
//     doc.text(`${item.unit_price.toFixed(2)}`, 350, y);
//     doc.text(`${item.quantity}`, 420, y);
//     doc.text(`${item.total.toFixed(2)}`, 490, y);
//     y += 20;
//   });

//   y += 20;
//   const currency = business.currency || "RON";
//   doc.font("Helvetica").fontSize(9).fillColor(gray);
//   doc.text("Subtotal:", 350, y);
//   doc.text(`${invoice.subtotal.toFixed(2)} ${currency}`, 490, y);
//   y += 15;
//   doc.text(`TVA (${invoice.tax_rate || 19}%):`, 350, y);
//   doc.text(`${(invoice.tax_amount || 0).toFixed(2)} ${currency}`, 490, y);
//   y += 15;
//   doc.font("Helvetica-Bold").fontSize(11).fillColor(textColor);
//   doc.text("Total:", 350, y);
//   doc.text(`${invoice.total.toFixed(2)} ${currency}`, 490, y);

//   doc.end();

//   return new Promise((resolve, reject) => {
//     writeStream.on("finish", () => resolve(pdfPath));
//     writeStream.on("error", reject);
//   });
// };


const generateInvoicePDF = (invoice, billingProfile) => {
  const pdfPath = `./invoice_${invoice.invoice_number}.pdf`;
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const writeStream = fs.createWriteStream(pdfPath);

  const b = billingProfile;
  const cl = invoice.client || {};
  const currency = b.currency || "RON";

  const items = invoice.items || [];

  const discountAmount = invoice.discount_rate
    ? (invoice.subtotal * invoice.discount_rate) / 100
    : 0;

  const taxAmount = invoice.tax_rate
    ? ((invoice.subtotal - discountAmount) * invoice.tax_rate) / 100
    : 0;

  doc.pipe(writeStream);

  const bgColor = "#F5F2EC";
  const textColor = "#1a1a1a";
  const gray = "#555555";

  doc.rect(0, 0, 600, 900).fill(bgColor);
  
  doc.fillColor(textColor).font("Helvetica-Bold").fontSize(36).text("FACTURA", { align: "center" });
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(textColor).stroke();
  doc.moveDown(2);

  const startY = doc.y;
  doc.fontSize(10).font("Helvetica-Bold").fillColor(textColor).text("Furnizor", 50, startY);
  doc.font("Helvetica").fontSize(9).fillColor(textColor);
  doc.text(b.business_name || "Nume firma indisponibil", 50, doc.y + 2);
  doc.text(b.email || "Email indisponibil", 50, doc.y + 2);
  doc.text(b.cif || "Cif indisponibil", 50, doc.y + 2);
  doc.text(b.registration_number || "Reg.Com indisponibil", 50, doc.y + 2);
  doc.text(b.address || "Adresă indisponibilă", 50, doc.y + 2);
  doc.text(b.country || "Țară indisponibil", 50, doc.y + 2);
  doc.text(b.iban || "Iban indisponibi", 50, doc.y + 2);
  doc.text(b.bank || "Nume bancă indisponibil", 50, doc.y + 2);

  const clientY = doc.y + 20;
  doc.fontSize(10).font("Helvetica-Bold").fillColor(textColor).text("Client", 50, clientY);
  doc.font("Helvetica").fontSize(9).fillColor(textColor);
  doc.text(cl.brand || "brand indisponibil", 50, doc.y + 2);
  doc.text(cl.cui || "cui indisponibil", 50, doc.y + 2);
  doc.text(cl.reg_com || "reg.com indisponibil", 50, doc.y + 2);
  doc.text(cl.address || "adresă indisponibilă", 50, doc.y + 2);
  doc.text(cl.city || "oraș indisponibil", 50, doc.y + 2);
  doc.text(cl.country || "țară indisponibilă", 50, doc.y + 2);
  doc.text(cl.iban || "iban indisponibil", 50, doc.y + 2);
  doc.text(cl.bank || "nume bancă indisponibil", 50, doc.y + 2);
  doc.text(cl.contact_person || "persoană de contact indisponibilă", 50, doc.y + 2);
  doc.text(cl.email || "email indisponibil", 50, doc.y + 2);

  doc.font("Helvetica-Bold").text("Detalii Factura", 350, startY);
  doc.font("Helvetica").text(`Nr. Factura ${invoice.invoice_number}`, 350, startY + 12);
  doc.text(`Data ${new Date(invoice.date).toLocaleDateString("en-GB")}`, 350, startY + 24);
  doc.text(`Scadenta ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("en-GB") : "-"}`, 350, startY + 36);

  doc.moveDown(4);

  let y = doc.y;
  doc.moveTo(50, y).lineTo(545, y).stroke();
  y += 10;
  
  doc.font("Helvetica-Bold").fontSize(9).fillColor(gray);
  doc.text("Nr", 50, y);
  doc.text("Descriere", 80, y);
  doc.text("Pret", 350, y);
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
  doc.font("Helvetica").fontSize(9).fillColor(gray);
  
  doc.text("Subtotal:", 350, y);
  doc.text(`${(invoice.subtotal || 0).toFixed(2)} ${currency}`, 490, y);
  y += 15;
  
  const finalTax = invoice.taxAmount ?? taxAmount ?? 0;
  doc.text(`TVA (${invoice.tax_rate || 19}%):`, 350, y);
  doc.text(`+${finalTax.toFixed(2)} ${currency}`, 490, y);
  y += 15;
  doc.text(`Reducere:`, 350, y);
  doc.text(`${(discountAmount || 0).toFixed(2)} ${currency}`, 490, y);
  y += 15;
  doc.font("Helvetica-Bold").fontSize(11).fillColor(textColor);
  doc.text("Total:", 350, y);
  doc.text(`${(invoice.total || 0).toFixed(2)} ${currency}`, 490, y);

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(pdfPath));
    writeStream.on("error", reject);
  });
};

export { generateInvoicePDF };


export const sendInvoiceEmail = async (invoice, billingProfile) => {
  if (!cl?.email) {
    console.warn("[EmailService] Client has no email, skipping email send.");
    return;
  }

  try {
    const pdfPath = await generateInvoicePDF(invoice, billingProfile);

    const pdfData = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfData.toString("base64");
    
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "butuclucian04@gmail.com", 
      subject: `Factură nouă emisă de invoiceGenAI: ${invoice.invoice_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #4F46E5; text-align: center;">Salutare ${cl.name || "Client"},</h2>
          <p style="text-align: center; font-size: 15px;">Aceasta este noua factura de la <b>invoiceGenAi</b>.</p>
          
          <div style="margin: 20px auto; max-width: 400px; background: #f9f9f9; padding: 20px; border-radius: 10px; border-left: 4px solid #4F46E5;">
            <p style="margin: 5px 0;"><b>Numarul facturii:</b> ${invoice.invoice_number}</p>
            <p style="margin: 5px 0;"><b>Suma totala:</b> ${invoice.total?.toFixed(2)} ${invoice.currency || 'RON'}</p>
            <p style="margin: 5px 0;"><b>Data scadenta:</b> ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('ro-RO') : "—"}</p>
          </div>
          
          <p style="text-align: center; font-size: 14px; color: #666;">Documentul PDF este atasat in acest email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="text-align: center; color: #999; font-size: 12px;">Multumim pentru colaborare!<br><b>Echipa invoiceGenAi</b></p>
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
      if (err) console.warn(err.message);
      else console.log("[EmailService] Temp PDF deleted successfully from workspace.");
    });

    return response;

  } catch (error) {
    console.error(error.message || error);
    throw error; 
  }
};
export const sendInvoiceEmail = async (invoice, client) => {
  if (!client?.email) {
    console.warn("⚠️ Client has no email, skipping email send.");
    return;
  }

  try {
    console.log("📄 [EmailService] Generating PDF for:", invoice.invoice_number);
    const pdfPath = await generateInvoicePDF(invoice, client);
    console.log("✅ [EmailService] PDF generated:", pdfPath);

    // 📦 Citește PDF-ul și convertește în Base64
    const pdfData = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfData.toString("base64");

    console.log("📤 [EmailService] Sending email via Resend to:", client.email);

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
          <hr style="margin:25px 0;border:none;border-top:1px solid #eee;" />
          <p style="font-size:12px;color:#999;">Generated automatically by BillForge AI • www.billforge.app</p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${invoice.invoice_number}.pdf`,
          content: pdfBase64, // ✅ Trimitem fișierul direct ca Base64
        },
      ],
    });

    // 🔍 Log răspuns complet de la Resend
    console.log("📩 [EmailService] Resend API response:", JSON.stringify(response, null, 2));

    if (response.error) {
      console.error("❌ [EmailService] Resend error:", response.error);
    } else {
      console.log("✅ [EmailService] Invoice email sent successfully via Resend!");
    }

    // 🧹 Ștergere fișier temporar PDF
    fs.unlink(pdfPath, (err) => {
      if (err) console.warn("⚠️ Could not delete temp PDF:", err.message);
      else console.log("🧹 Temp PDF deleted successfully");
    });
  } catch (error) {
    console.error("❌ [EmailService] Fatal error sending invoice email:", error);
  }
};

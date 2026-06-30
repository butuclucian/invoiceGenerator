import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import { generateInvoiceFromTextInternal } from "../controllers/aiController.js";

const config = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
    authTimeout: 5000,
  },
};

export const startEmailWorker = () => {
  console.log("=== Email Background Worker pornit (Verificare la 30s) ===");

  setInterval(async () => {
    let connection;
    try {
      connection = await imaps.connect(config);
      await connection.openBox("INBOX");

      const searchCriteria = ["UNSEEN"];
      const fetchOptions = { bodies: [""], markSeen: true };

      const messages = await connection.search(searchCriteria, fetchOptions);

      if (messages.length === 0) {
        connection.end();
        return;
      }

      console.log(`[IMAP] Am găsit ${messages.length} e-mail(uri) necitite.`);

      for (let i = 0; i < messages.length; i++) {
        const item = messages[i];
        const all = item.parts.find((part) => part.which === "");

        if (!all || !all.body) continue;

        try {
          const parsed = await simpleParser(all.body);
          const emailSenderText = parsed.from?.text || "Unknown Sender";
          const fallbackEmail = parsed.from?.value?.[0]?.address || "";
          const emailBody = parsed.text || "";

          console.log(`[AI Pipeline] Procesez e-mail de la: ${emailSenderText}`);

          const targetUserId = "6a441b768d622aef5ce4aa4d";

          const invoiceResult = await generateInvoiceFromTextInternal(
            emailBody,
            fallbackEmail,
            targetUserId,
          );

          if (!invoiceResult) {
            console.error(`[AI Pipeline] EROARE: AI-ul nu a returnat o factură validă pentru e-mailul de la ${emailSenderText}`);
            continue;
          }

          console.log(`[AI Pipeline] Succes: Factura ${invoiceResult.invoice_number || 'generată'} pentru ${emailSenderText} (Monedă: ${invoiceResult.currency || 'N/A'})`);

        } catch (procErr) {
          console.error(`[AI Pipeline] Eroare la procesarea e-mailului ${i + 1}:`, procErr.message);
        }
      }

      connection.end();
    } catch (error) {
      console.error("❌ Eroare critică în Email Worker:", error.message);
      if (connection) {
        try { connection.end(); } catch (e) { /* silent */ }
      }
    }
  }, 30000);
};
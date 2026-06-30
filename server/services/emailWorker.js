import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import { generateInvoiceFromTextInternal } from "../controllers/aiController.js";
import User from "../models/User.js";

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

      console.log(
        `[IMAP] Am găsit ${messages.length} e-mail(uri) necitite. Se începe procesarea secvențială...`,
      );

      for (let i = 0; i < messages.length; i++) {
        const item = messages[i];
        const all = item.parts.find((part) => part.which === "");

        if (all && all.body) {
          const parsed = await simpleParser(all.body);

          const emailSenderText = parsed.from?.text || "Unknown Sender";

          const fallbackEmail =
            parsed.from?.value?.[0]?.address ||
            parsed.from?.html?.match(/mailto:([^"]+)/)?.[1] ||
            "";

          const emailBody = parsed.text || "";

          console.log(
            `[AI Pipeline - Email ${i + 1}/${messages.length}] Sosit de la: ${emailSenderText} (${fallbackEmail})`,
          );

          const targetUserId = "6a441b768d622aef5ce4aa4d";

          await generateInvoiceFromTextInternal(
            emailBody,
            fallbackEmail,
            targetUserId,
          );
        }
      }

      connection.end();
      console.log(
        "[IMAP] Conexiune închisă. Toate e-mailurile curente au fost procesate.",
      );
    } catch (error) {
      console.error("❌ Eroare în Email Worker:", error.message);
      if (connection) {
        try {
          connection.end();
        } catch (e) {
          console.error("Eroare la închiderea forțată a IMAP:", e.message);
        }
      }
    }
  }, 30000);
};
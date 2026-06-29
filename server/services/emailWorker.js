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
          const targetUserId = "6a2bddddbd03f631953b0521";

          await generateInvoiceFromTextInternal(
            emailBody,
            fallbackEmail,
            targetUserId,
          );
        }
      }
      connection.end();
    } catch (error) {
      console.error(error.message);
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

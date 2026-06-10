import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import { generateInvoiceFromTextInternal } from '../controllers/aiController.js'; // O vom exporta imediat
import User from '../models/User.js';

const config = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        tls: true,
        // ── LOGICĂ NOUĂ PENTRU DOCKER ─────────────────────────────────────
        tlsOptions: {
            rejectUnauthorized: false // Ignoră verificarea strictă a certificatelor în mediul de test
        },
        // ──────────────────────────────────────────────────────────────────
        authTimeout: 3000
    }
};

export const startEmailWorker = () => {
    console.log("=== Email Background Worker pornit (Verificare la 30s) ===");
    
    setInterval(async () => {
        try {
            const connection = await imaps.connect(config);
            await connection.openBox('INBOX');

            // Căutăm emailurile UNSEEN (necitite)
            const searchCriteria = ['UNSEEN'];
            const fetchOptions = { bodies: [''], markSeen: true }; // markSeen: true le marchează ca citite automat

            const messages = await connection.search(searchCriteria, fetchOptions);

            for (const item of messages) {
                const all = item.parts.find(part => part.which === '');
                const id = item.attributes.uid;

                if (all && all.body) {
                    const parsed = await simpleParser(all.body);
                    const emailSender = parsed.from?.text || "Unknown";
                    const emailBody = parsed.text || ""; // Extrage doar textul curat, fără HTML

                    console.log(`[Email Nou] Sosit de la: ${emailSender}. Se trimite către AI...`);

                    // Trimitem textul direct în motorul tău AI (simulând request-ul)
                    // Pasăm un obiect simulat în loc de req/res
                    // Adăugăm ID-ul utilizatorului tău ca al treilea parametru
                    await generateInvoiceFromTextInternal(emailBody, parsed.from?.value[0]?.address, "6a23f72e35c86bdada234dc9");
                }
            }

            connection.end();
        } catch (error) {
            console.error("Eroare în Email Worker:", error.message);
        }
    }, 30000); // 30.000 ms = 30 secunde
};
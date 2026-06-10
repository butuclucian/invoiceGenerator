import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cron from "node-cron";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";

// Import Rute
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";

// Import Controllere / Modele pentru procese asincrone
import { generateNearDueNotifications } from "./controllers/notificationController.js";
import { handleWebhook } from "./controllers/subscriptionController.js";
import User from "./models/User.js";

dotenv.config();

// Inițializare conexiune MongoDB
connectDB();

const app = express();

// ── 1. STRIPE WEBHOOK (Trebuie înregistrat strict ÎNAINTE de express.json()) ──
app.post(
  "/api/subscription/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

// ── 2. MIDDLEWARE-URI GLOBALE ────────────────────────────────────────────────
app.use(express.json());
app.use(morgan("dev")); // Logare request-uri în consolă pentru debugging

app.use(
  cors({
    origin: "*", // În producție/Docker poți pune process.env.FRONTEND_URL
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Rută de tip Base Health-Check
app.get("/", (req, res) => {
  res.send("invoiceGenAI API is running stable...");
});

// ── 3. MAPARE RUTE API ───────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes); // Gestionează /process-email-ai, /chat-ai și /analytics
app.use("/api/notifications", notificationRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/billing-profile", billingRoutes);

// ── 4. PORNIRE SERVER (0.0.0.0 este obligatoriu pentru maparea Docker) ───────
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`\x1b[36m🚀 [Backend] Server running on port ${PORT}\x1b[0m`)
);

// ── 5. CRON JOB ASINCRON (Rulează la fiecare oră fixă) ───────────────────────
cron.schedule("0 * * * *", async () => {
  console.log("⏰ [Cron] Se pornește verificarea automată a scadențelor...");
  try {
    const users = await User.find();

    for (const user of users) {
      // Pasăm un obiect mock pentru request și response securizat
      await generateNearDueNotifications(
        { user },
        {
          status: () => ({ json: () => {} }),
        }
      );
    }
    console.log("✅ [Cron] Notificările automate au fost procesate cu succes.");
  } catch (error) {
    console.error("❌ [Cron Error] Eroare în execuția jobului orar:", error);
  }
});
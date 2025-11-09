import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cron from "node-cron";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

import { generateNearDueNotifications } from "./controllers/notificationController.js";
import User from "./models/User.js";

dotenv.config();
connectDB();

const app = express();

/* -------------------------- 🧩 STRIPE WEBHOOK -------------------------- */
// ⚠️ Trebuie să vină înainte de express.json()!
import { handleWebhook } from "./controllers/subscriptionController.js";
app.post(
  "/api/subscription/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

/* -------------------------- 🌍 MIDDLEWARES ----------------------------- */
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      "https://invoice-generator-olive-gamma.vercel.app",
      "https://invoice-generator-ungi.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

/* -------------------------- ✅ ROUTES ---------------------------------- */
app.get("/", (req, res) => {
  res.send("✅ BillForge AI API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/subscription", subscriptionRoutes);

/* -------------------------- 🚀 SERVER --------------------------------- */
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

/* -------------------------- ⏰ CRON JOB ------------------------------- */
cron.schedule("0 * * * *", async () => {
  try {
    console.log("⏰ Running hourly near-due invoice check...");
    const users = await User.find();

    for (const user of users) {
      await generateNearDueNotifications(
        { user },
        {
          status: () => ({ json: () => {} }),
        }
      );
    }
  } catch (error) {
    console.error("❌ Cron job error:", error);
  }
});

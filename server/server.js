import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cron from "node-cron";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import {startEmailWorker} from "./services/emailWorker.js";

import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";

import { generateNearDueNotifications } from "./controllers/notificationController.js";
import { handleWebhook } from "./controllers/subscriptionController.js";
import User from "./models/User.js";

dotenv.config();

connectDB();

const app = express();


app.post(
  "/api/subscription/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.get("/", (req, res) => {
  res.send("invoiceGenAI API is running stable...");
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/billing-profile", billingRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\x1b[36m🚀 [Backend] Server running on port ${PORT}\x1b[0m`);

  startEmailWorker();
});


cron.schedule("0 * * * *", async () => {
  console.log("⏰ [Cron] Se pornește verificarea automată a scadențelor...");
  try {
    const users = await User.find();

    for (const user of users) {
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
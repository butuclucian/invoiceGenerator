import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
await connectDB(); // asigură-te că db.js exportă o funcție async

const app = express();

// ✅ Config CORS pentru local + Vercel
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://invoice-generator-xwqg.vercel.app", // domeniul real din Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Invoice Generator API (Vercel Serverless) is running...");
});

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

// ❌ IMPORTANT: eliminăm complet app.listen()
// Vercel nu rulează servere permanente
// În schimb, exportăm aplicația Express ca handler pentru funcția serverless
export default app;

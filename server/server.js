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
connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://invoice-generator-olive-gamma.vercel.app",
      "https://invoice-generator-ungi.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);



app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Invoice Generator API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on port ${PORT}`)
);

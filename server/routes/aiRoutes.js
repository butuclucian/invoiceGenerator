import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateInvoiceFromText } from "../controllers/aiController.js";
import { aiChat } from "../controllers/aiChatController.js";

const router = express.Router();

// AI invoice generator
router.post("/generate-invoice", protect, generateInvoiceFromText);

// AI conversational assistant
router.post("/chat", protect, aiChat);

export default router;

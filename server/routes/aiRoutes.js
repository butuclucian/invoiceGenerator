import express from "express";
import { generateInvoiceFromText, invoiceChatAI } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkSubscription } from "../middleware/checkSubscription.js";

const router = express.Router();

// POST /api/ai/generate-invoice
// router.post("/generate-invoice", protect, checkSubscription, generateInvoiceFromText);
router.post("/generate-invoice", protect, generateInvoiceFromText);
router.post("/invoice-chat", protect, invoiceChatAI);
router.post("/chat", protect, aiChat);


export default router;

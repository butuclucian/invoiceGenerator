import express from "express";
import { generateInvoiceFromText } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkSubscription } from "../middleware/checkSubscription.js";

const router = express.Router();

// POST /api/ai/generate-invoice
router.post("/generate-invoice", protect, checkSubscription, generateInvoiceFromText);

export default router;

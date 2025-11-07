import express from "express";
import { generateInvoiceFromText } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/ai/generate-invoice
router.post("/generate-invoice", protect, generateInvoiceFromText);

export default router;

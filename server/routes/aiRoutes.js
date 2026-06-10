import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateInvoiceFromText } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-invoice", protect, generateInvoiceFromText);

export default router;

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateInvoiceFromText } from "../controllers/aiController.js";
import { aiChat } from "../controllers/aiChatController.js";

const router = express.Router();

router.post("/generate-invoice", protect, generateInvoiceFromText);
router.post("/chat", protect, aiChat);

export default router;

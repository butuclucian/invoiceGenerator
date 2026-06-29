import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateInvoiceFromText } from "../controllers/aiController.js";
import {getAiGenerationHistory, deleteAiInvoice} from "../controllers/aiController.js";
import { checkEnterpriseSubscription } from "../middleware/checkSubscription.js";

const router = express.Router();

router.post("/generate-invoice", protect, checkEnterpriseSubscription, generateInvoiceFromText);
router.get("/history", protect, getAiGenerationHistory);
router.delete("/history/:id", protect, deleteAiInvoice);

export default router;

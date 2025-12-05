import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getBillingProfile, updateBillingProfile } from "../controllers/billingController.js";

const router = express.Router();

router.get("/", protect, getBillingProfile);
router.put("/", protect, updateBillingProfile);

export default router;

import express from "express";
import { createCheckoutSession, getMySubscription, cancelSubscription, createBillingPortal, getInvoices } from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/me", protect, getMySubscription);
router.post("/cancel", protect, cancelSubscription);
router.post("/create-billing-portal", protect, createBillingPortal);
router.get("/invoices", protect, getInvoices);

export default router;
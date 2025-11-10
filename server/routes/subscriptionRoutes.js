import express from "express";
import {
  createCheckoutSession,
  handleWebhook,
  getMySubscription,
  cancelSubscription,
  createBillingPortal,
  getInvoices
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";
import bodyParser from "body-parser";

const router = express.Router();

// Stripe webhook trebuie să primească body neparsat
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/me", protect, getMySubscription);
router.post("/cancel", protect, cancelSubscription);
router.post("/create-billing-portal", protect, createBillingPortal);
router.get("/invoices", protect, getInvoices);

export default router;

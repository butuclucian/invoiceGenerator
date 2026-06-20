import express from "express";
import { 
  createCheckoutSession, 
  getMySubscription, 
  cancelSubscription, 
  createBillingPortal, 
  getInvoices 
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Webhook-ul a fost mutat în server.js pentru a evita erorile de parșare
router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/me", protect, getMySubscription);
router.post("/cancel", protect, cancelSubscription);
router.post("/create-billing-portal", protect, createBillingPortal);
router.get("/invoices", protect, getInvoices);

export default router;
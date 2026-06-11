import express from "express";
import { 
  getInvoices, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice, 
  getInvoiceById, 
  getNearDueInvoices,
  approveAndIssueInvoice,
  getAiFinancialAnalytics,
  getAiReportHistory,
} from "../controllers/invoiceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.route("/")
  .get(protect, getInvoices)
  .post(protect, createInvoice);


router.get("/near-due", protect, getNearDueInvoices);


router.put("/:id/approve", protect, approveAndIssueInvoice);


router.route("/:id")
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

router.get("/analytics/ai", protect, getAiFinancialAnalytics);

router.get("/analytics/ai/history", protect, getAiReportHistory);

export default router;
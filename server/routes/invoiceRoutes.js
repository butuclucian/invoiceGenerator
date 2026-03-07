import express from "express";
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, getInvoiceById, getNearDueInvoices} from "../controllers/invoiceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getInvoices)
  .post(protect, createInvoice);

router.get("/near-due", protect, getNearDueInvoices);

router.route("/:id")
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);


export default router;

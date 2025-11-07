import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import { v4 as uuidv4 } from "uuid";

// GET all invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id }) // 👈 schimbat aici
      .populate("client", "name email company")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
  }
};

// GET invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("client");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Error fetching invoice" });
  }
};

// CREATE new invoice
export const createInvoice = async (req, res) => {
  try {
    const { client, invoice_number, date, ...rest } = req.body;

    if (!client || !invoice_number || !date) {
      return res.status(400).json({ message: "Client and date are required" });
    }

    const existingClient = await Client.findById(client);
    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    const newInvoice = await Invoice.create({
      user: req.user._id, // 👈 tot user, nu createdBy
      client: existingClient._id,
      invoice_number,
      date,
      ...rest,
    });

    res.status(201).json(newInvoice);
  } catch (err) {
    console.error("❌ Invoice create error:", err);
    res.status(500).json({ message: "Failed to create invoice", error: err.message });
  }
};

// UPDATE invoice
export const updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Invoice not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating invoice" });
  }
};

// DELETE invoice
export const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting invoice" });
  }
};

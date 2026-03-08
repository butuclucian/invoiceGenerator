import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import { v4 as uuidv4 } from "uuid";
import { sendInvoiceEmail } from "../utils/emailService.js";


export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .populate("client", "name email company phone address")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch invoices", error: err.message });
  }
};


export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("client", "name email company phone address");
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    console.error("Error fetching invoice by ID:", err);
    res.status(500).json({ message: "Error fetching invoice" });
  }
};



export const createInvoice = async (req, res) => {
  try {
    const { client, invoice_number, date, due_date, ...rest } = req.body;

    if (!client || !invoice_number || !date) {
      return res.status(400).json({ message: "Client and date are required" });
    }

    const existingClient = await Client.findById(client);
    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    const newInvoice = await Invoice.create({
      user: req.user._id,
      client: existingClient._id,
      invoice_number,
      date: new Date(date),
      due_date: due_date ? new Date(due_date) : null,
      ...rest,
    });

    try {
      await sendInvoiceEmail(newInvoice, existingClient);
    } catch (mailErr) {
      console.error("Failed to send invoice email:", mailErr);
    }

    res.status(201).json({
      success: true,
      message: "Invoice created and email sent successfully",
      invoice: newInvoice,
    });
  } catch (err) {
    console.error("Invoice create error:", err);
    res.status(500).json({
      message: "Failed to create invoice",
      error: err.message,
    });
  }
};



export const updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Invoice not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating invoice" });
  }
};


export const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting invoice" });
  }
};


export const getNearDueInvoices = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    console.log("Checking near-due invoices for:", todayStr, "to", tomorrowStr);

    // Extragem TOATE facturile utilizatorului
    const allInvoices = await Invoice.find({
      user: userId,
      status: { $ne: "paid" },
    }).populate("client", "name email");

    // Filtrare manuala toleranta la formate
    const nearDue = allInvoices.filter((inv) => {
      if (!inv.due_date) return false;
      const dueStr = inv.due_date.toString().slice(0, 10);
      return dueStr === todayStr || dueStr === tomorrowStr;
    });

    console.log(`Found ${nearDue.length} invoices near due`);
    res.status(200).json(nearDue);
  } catch (err) {
    console.error("Error fetching near-due invoices:", err);
    res.status(500).json({ message: "Error fetching invoice" });
  }
};





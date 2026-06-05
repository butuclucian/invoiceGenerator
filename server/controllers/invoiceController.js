import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import { sendInvoiceEmail } from "../utils/emailService.js";

export const getInvoices = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };

    if (status) {
      filter.status = status;
    } else {
      filter.status = { $ne: "pending" };
    }

    const invoices = await Invoice.find(filter)
      .populate("client", "name email company phone address cui")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("client", "name email company phone address cui");
    
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
    const { client, invoice_number, date, due_date, status, ai_extracted_data, ...rest } = req.body;

    const invoiceData = {
      user: req.user._id,
      date: date ? new Date(date) : new Date(),
      due_date: due_date ? new Date(due_date) : null,
      status: status || "draft",
      ...rest,
    };

    if (status === "pending") {
      if (client) invoiceData.client = client;
      
      invoiceData.invoice_number = invoice_number || `AI-PENDING-${Date.now()}`;
      
      invoiceData.ai_extracted_data = ai_extracted_data;
    } 
    else {
      if (!client || !invoice_number) {
        return res.status(400).json({ message: "Client and invoice number are required for manual invoices" });
      }

      const existingClient = await Client.findById(client);
      if (!existingClient) {
        return res.status(404).json({ message: "Selected client not found" });
      }

      invoiceData.client = existingClient._id;
      invoiceData.invoice_number = invoice_number;
    }

    const newInvoice = await Invoice.create(invoiceData);

    if (newInvoice.status === "sent" && newInvoice.client) {
      const existingClient = await Client.findById(newInvoice.client);
      if (existingClient) {
        try {
          await sendInvoiceEmail(newInvoice, existingClient);
        } catch (mailErr) {
          console.error("Failed to send invoice email:", mailErr);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: status === "pending" ? "AI request saved as pending" : "Invoice created successfully",
      invoice: newInvoice,
    });
  } catch (err) {
    console.error("Invoice create error:", err);
    res.status(500).json({ message: "Failed to create invoice", error: err.message });
  }
};

export const approveAndIssueInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { final_client_data, invoice_number, date, due_date, items, tax_rate, discount_rate, subtotal, total, notes } = req.body;

    let clientId = req.body.client;

    if (!clientId && final_client_data) {
      const noulClient = await Client.create({
        user: req.user._id,
        name: final_client_data.name || final_client_data.company,
        company: final_client_data.company,
        email: final_client_data.email || "contact@client.ro",
        address: final_client_data.address,
        cui: final_client_data.cui
      });
      clientId = noulClient._id;
    }

    const officialInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        client: clientId,
        invoice_number: invoice_number,
        status: "sent",
        date: date ? new Date(date) : new Date(),
        due_date: due_date ? new Date(due_date) : null,
        items: items,
        tax_rate: tax_rate || 0,
        discount_rate: discount_rate || 0,
        subtotal: subtotal || 0,
        total: total || 0,
        notes: notes || "",
        ai_extracted_data: null
      },
      { new: true }
    ).populate("client");

    if (!officialInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    try {
      await sendInvoiceEmail(officialInvoice, officialInvoice.client);
    } catch (mailErr) {
      console.error("Failed to send official invoice email:", mailErr);
    }

    res.json({
      success: true,
      message: "Invoice approved, official records created, and email sent successfully",
      invoice: officialInvoice,
    });
  } catch (err) {
    console.error("Error approving invoice:", err);
    res.status(500).json({ message: "Failed to approve and issue invoice", error: err.message });
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

    const allInvoices = await Invoice.find({
      user: userId,
      status: "sent",
    }).populate("client", "name email");

    const nearDue = allInvoices.filter((inv) => {
      if (!inv.due_date) return false;
      const dueStr = inv.due_date.toString().slice(0, 10);
      return dueStr === todayStr || dueStr === tomorrowStr;
    });

    res.status(200).json(nearDue);
  } catch (err) {
    console.error("Error fetching near-due invoices:", err);
    res.status(500).json({ message: "Error fetching near-due invoices" });
  }
};
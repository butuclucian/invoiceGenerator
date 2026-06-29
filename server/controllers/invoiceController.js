import {Ollama} from "ollama";
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import { sendInvoiceEmail } from "../utils/pdfEmailSender.js";
import axios from "axios";
import Report from "../models/Report.js";

const ollama = new Ollama({ 
  host: process.env.OLLAMA_HOST
});

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
      .populate("client")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("client");
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Error fetching invoice", error: err.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { client, invoice_number, date, due_date, status, ...rest } = req.body;
    const invoiceData = { user: req.user._id, date: date ? new Date(date) : new Date(), due_date: due_date ? new Date(due_date) : null, status: status || "draft", ...rest };
    if (status === "pending") {
      if (client) invoiceData.client = client;
      invoiceData.invoice_number = invoice_number || `AI-PENDING-${Date.now()}`;
    } 
    else {
      if (!client) {
        return res.status(400).json({ message: "Client selection is required for manual invoices." });
      }
      invoiceData.invoice_number = invoice_number || `INV-MANUAL-${Date.now()}`;
      const existingClient = await Client.findById(client);
      if (!existingClient) {
        return res.status(404).json({ message: "Selected client not found in database." });
      }
      invoiceData.client = existingClient._id;
    }
    let newInvoice = await Invoice.create(invoiceData);
    if (newInvoice.status === "sent" && newInvoice.client) {
      newInvoice = await Invoice.findById(newInvoice._id).populate("client");
      if (newInvoice.client) {
        try {
          await sendInvoiceEmail(newInvoice, newInvoice.client);
        } catch (mailErr) {
          console.error(mailErr.message);
        }
      }
    }
    res.status(201).json({ success: true, message: status === "pending" ? "AI request saved as pending" : "Invoice created successfully", invoice: newInvoice });
  } catch (err) {
    res.status(500).json({ message: "Failed to create invoice", error: err.message });
  }
};

export const approveAndIssueInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { final_client_data, invoice_number, date, due_date, items, tax_rate, discount_rate, subtotal, total, notes, series, payment_method, paid_amount, paid_at } = req.body;

    let clientId = req.body.client;

    if (!clientId && final_client_data) {
      const noulClient = await Client.create({
        user: req.user._id,
        name: final_client_data.name || final_client_data.brand || "Client Nou AI",
        brand: final_client_data.brand || "",
        cui: final_client_data.cui || "",
        reg_com: final_client_data.reg_com || "",
        client_code: final_client_data.client_code || "",
        is_tva_payer: final_client_data.is_tva_payer === true || final_client_data.is_tva_payer === 'true' || final_client_data.is_tva_payer === 'Da',
        address: final_client_data.address || "",
        city: final_client_data.city || "",
        county: final_client_data.county || "",
        country: final_client_data.country || "Romania",
        iban: final_client_data.iban || "",
        bank: final_client_data.bank || "",
        contact_person: final_client_data.contact_person || "",
        email: final_client_data.email || "contact@client.ro",
        phone: final_client_data.phone || "",
        company: final_client_data.company || final_client_data.name || ""
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
        series: series || "INV",
        payment_method: payment_method || "not_paid",
        paid_amount: paid_amount || 0,
        paid_at: paid_at ? new Date(paid_at) : null
      },
      { new: true }
    ).populate("client");

    if (!officialInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    try {
      await sendInvoiceEmail(officialInvoice, officialInvoice.client);
    } catch (mailErr) {
      console.error(mailErr.message);
    }

    res.json({
      success: true,
      message: "Invoice approved, official records created, and email sent successfully",
      invoice: officialInvoice,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve and issue invoice", error: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updated) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (req.body.status === "sent") {
      try {
        const targetClient = await Client.findById(updated.client);

        if (targetClient) {
          await sendInvoiceEmail(updated, targetClient);
        } else {
          console.warn("[HTTP Update] Clientul asociat acestei facturi nu a fost găsit în baza de date.");
        }
        
      } catch (mailErr) {
        console.error(mailErr.message);
      }
    }
    const populatedInvoice = await Invoice.findById(updated._id).populate("client");
    res.json(populatedInvoice);

  } catch (err) {
    res.status(500).json({ message: "Error updating invoice", error: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Invoice.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ 
      success: true,
      message: "Invoice deleted successfully",
      invoice: deleted 
    });

  } catch (err) {
    res.status(500).json({ message: "Error deleting invoice", error: err.message });
  }
};

export const getNearDueInvoices = async (req, res) => {
  try {
    const userId = req.user._id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date();
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const nearDueInvoices = await Invoice.find({
      user: userId,
      status: "sent",
      due_date: {
        $gte: startOfToday,
        $lte: endOfTomorrow 
      }
    })

    .populate("client")
    .sort({ due_date: 1 }); 

    res.status(200).json(nearDueInvoices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching near-due invoices", error: err.message });
  }
};

export const getAiFinancialAnalytics = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id }).populate("client");

    if (!invoices || invoices.length === 0) {
      return res.json({
        success: true,
        report: "Nu am găsit suficiente date fiscale în contul tău pentru a genera o analiză. Emite sau încasează câteva facturi mai întâi!"
      });
    }

    const compactInvoicesData = invoices.map(inv => ({
      numar: `${inv.series || 'INV'}-${inv.invoice_number}`,
      client: inv.client?.brand || inv.client?.name || "Client Necunoscut",
      suma: inv.total,
      valuta: inv.currency || "RON", 
      status: inv.status,
      data_creare: inv.date ? new Date(inv.date).toISOString().split('T')[0] : "N/A"
    }));

   const prompt = `
Ești un analist financiar expert și asistent executiv de Business Intelligence pentru freelanceri și IMM-uri.
Analizează următorul set de date fiscale transmise în format JSON reprezentând facturile utilizatorului:

${JSON.stringify(compactInvoicesData, null, 2)}

Generează un raport financiar strategic. Structura trebuie să conțină strict următoarele 3 secțiuni relevante, iar titlul fiecărei categorii trebuie scris cu bold, fără asteriscuri sau emoticoane:

1. Predictie Cashflow si Rulaj
(Oferă o estimare sau o concluzie privind volumul total al încasărilor pe baza facturilor plătite versus cele pending/overdue și o prognoză scurtă).

2. Analiza Comportamentului Clientilor
(Identifică pe nume dacă există clienți cu facturi restante sau care reprezintă un procent prea mare din venituri - risc de concentrare).

3. Recomandari Strategice Active
(Oferă 2-3 sfaturi clare: ex. reducerea termenelor de plată, trimiterea de remindere, diversificare).

Răspunde direct în limba română. Fii concis, profesional și folosește un ton analitic premium. Nu adăuga introduceri inutile, emoticoane sau text în afara structurii cerute.
`;

    const result = await ollama.generate({
      model: "llama3.1:latest",
      prompt: prompt,
      stream: false
    });

    const aiReport = result.response;
    
    const savedReport = await Report.create({
      user: req.user._id,
      title: `Analiză Financiară — ${new Date().toLocaleDateString("ro-RO")}`,
      report: aiReport
    });

    res.json({
      success: true,
      report: aiReport
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Eroare la procesarea analizei financiare de către AI-ul local", 
      error: error.message 
    });
  }
};

export const getAiReportHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await Report.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      history
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch report history", 
      error: error.message 
    });
  }
};
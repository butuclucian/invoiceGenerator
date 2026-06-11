import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import { sendInvoiceEmail } from "../utils/pdfEmailSender.js";
import axios from "axios";
import Report from "../models/Report.js";

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
    // 🕵️ Log de debug: Vedem exact ce vine din Frontend în terminalul Docker
    console.log("[HTTP Frontend Request Body]:", req.body);
    console.log("[HTTP Frontend User ID din Token]:", req.user?._id);

    const { client, invoice_number, date, due_date, status, ai_extracted_data, ...rest } = req.body;

    // Asigurăm legătura cu utilizatorul logat curent (forțat ObjectId dacă e nevoie)
    const invoiceData = {
      user: req.user._id,
      date: date ? new Date(date) : new Date(),
      due_date: due_date ? new Date(due_date) : null,
      status: status || "draft",
      ...rest,
    };

    // 🤖 CASUL 1: Factură venită din procesarea AI Background
    if (status === "pending") {
      if (client) invoiceData.client = client;
      invoiceData.invoice_number = invoice_number || `AI-PENDING-${Date.now()}`;
      invoiceData.ai_extracted_data = ai_extracted_data;
    } 
    // ✍️ CASUL 2: Factură creată manual de tine din interfața grafică
    else {
      // Dacă clientul lipsește, dăm o eroare clară
      if (!client) {
        return res.status(400).json({ message: "Client selection is required for manual invoices." });
      }

      // 💡 REPARARE: Dacă ai uitat să pui număr de factură în formular, 
      // generăm noi unul automat ca să NU mai blocheze salvarea în bază!
      invoiceData.invoice_number = invoice_number || `INV-MANUAL-${Date.now()}`;

      const existingClient = await Client.findById(client);
      if (!existingClient) {
        return res.status(404).json({ message: "Selected client not found in database." });
      }

      invoiceData.client = existingClient._id;
    }

    // 💾 Salvarea sigură în baza de date
    const newInvoice = await Invoice.create(invoiceData);
    console.log("✅ Factură salvată cu succes în MongoDB! ID:", newInvoice._id);

    // ✉️ Trimitere automată prin Resend dacă statusul e "sent"
    if (newInvoice.status === "sent" && newInvoice.client) {
      const existingClient = await Client.findById(newInvoice.client);
      if (existingClient) {
        try {
          // Rulează funcția ta pe care am securizat-o pe adresa ta de mail
          await sendInvoiceEmail(newInvoice, existingClient);
          console.log("✉️ Factura manuală a fost expediată prin Resend!");
        } catch (mailErr) {
          console.error("Failed to send invoice email:", mailErr);
        }
      }
    }

    // Răspunsul către Frontend
    res.status(201).json({
      success: true,
      message: status === "pending" ? "AI request saved as pending" : "Invoice created successfully",
      invoice: newInvoice,
    });
  } catch (err) {
    console.error("❌ Invoice create error:", err);
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

export const getAiFinancialAnalytics = async (req, res) => {
  try {
    // 1. Extragem toate facturile utilizatorului logat
    const invoices = await Invoice.find({ user: req.user._id }).populate("client", "name company");

    if (!invoices || invoices.length === 0) {
      return res.json({
        success: true,
        report: "Nu am găsit suficiente date fiscale în contul tău pentru a genera o analiză. Emite sau încasează câteva facturi mai întâi!"
      });
    }

    const compactInvoicesData = invoices.map(inv => ({
      numar: inv.invoice_number,
      client: inv.client?.name || "Client Necunoscut",
      suma: inv.total,
      valuta: "EUR",
      status: inv.status,
      data_creare: inv.createdAt ? inv.createdAt.toISOString().split('T')[0] : "N/A"
    }));

    const prompt = `
Ești un analist financiar expert și asistent executiv de Business Intelligence pentru freelanceri și IMM-uri.
Analizează următorul set de date fiscale transmise în format JSON reprezentând facturile utilizatorului:

${JSON.stringify(compactInvoicesData, null, 2)}

Generează un raport financiar strategic, structurat strict sub formă de text curat cu Markdown, respectând următoarele 3 secțiuni relevante:

📊 **1. Predicție Cashflow & Rulaj**
(Oferă o estimare sau o concluzie privind volumul total al încasărilor pe baza facturilor plătite versus cele pending/overdue și o prognoză scurtă).

👥 **2. Analiza Comportamentului Clienților**
(Identifică pe nume dacă există clienți cu facturi restante sau care reprezintă un procent prea mare din venituri - risc de concentrare).

💡 **3. Recomandări Strategice Active**
(Oferă 2-3 sfaturi clare: ex. reducerea termenelor de plată, trimiterea de remindere, diversificare).

Răspunde direct în limba română. Fii concis, profesional și folosește un ton analitic premium. Nu adăuga introduceri inutile sau text în afara structurii cerute.
`;

    const ollamaResponse = await axios.post("http://host.docker.internal:11434/api/generate", {
      model: "llama3.1",
      prompt: prompt,
      stream: false
    });

    const aiReport = ollamaResponse.data.response;

    const savedReport = await Report.create({
      user: req.user._id,
      title: `Analiză Financiară — ${new Date().toLocaleDateString("ro-RO")}`,
      report: aiReport
    });

    console.log(`📊 [BI Analytics] Raport salvat cu succes în MongoDB! ID: ${savedReport._id}`);

    res.json({
      success: true,
      report: aiReport
    });

  } catch (error) {
    console.error("Eroare la generarea raportului AI Analytics:", error);
    res.status(500).json({ 
      message: "Eroare la procesarea analizei financiare de către AI-ul local", 
      error: error.message 
    });
  }
};

export const getAiReportHistory = async (req, res) => {
  try {
    const history = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
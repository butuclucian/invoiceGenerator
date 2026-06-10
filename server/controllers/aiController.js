import { Ollama } from "ollama";
import { sendInvoiceEmail } from "../utils/pdfEmailSender.js"; // Importul tău premium de trimitere PDF

// Inițializăm instanța locală a clasei Ollama.
const ollama = new Ollama({ 
  host: process.env.OLLAMA_HOST || "http://host.docker.internal:11434" 
});

import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import Subscription from "../models/Subscription.js";

// ── Prețuri prestabilite per serviciu ─────────────────────────────────────────
const SERVICE_PRICES = {
  "web design": 500,
  "website design": 500,
  "web development": 800,
  "web app": 1200,
  "mobile app": 1500,
  "ui/ux analysis": 100,
  "ui/ux analiza": 100,
  "analiza ui/ux": 100,
  "ux research": 150,
  "seo optimization": 200,
  "seo": 200,
  "logo design": 150,
  "branding": 300,
  "social media management": 250,
  "copywriting": 120,
  "landing page": 350,
  "e-commerce": 1200,
  "maintenance": 100,
  "mentenanta": 100,
  "consulting": 80,
  "consultanta": 80,
  "photography": 200,
  "fotografie": 200,
  "video editing": 300,
  "editare video": 300,
};

// ── 1. FUNCTIA PENTRU INTERFAȚĂ (Ruta HTTP POST /api/ai/generate) ────────────
export const generateInvoiceFromText = async (req, res) => {
  try {
    const { text, customPrices } = req.body;
    const userId = req.user._id;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Missing 'text' in request body" });
    }

    const activePrices = {
      ...SERVICE_PRICES,
      ...(customPrices && typeof customPrices === "object" ? customPrices : {}),
    };

    const priceListText = Object.entries(activePrices)
      .map(([service, price]) => `- ${service}: ${price} EUR`)
      .join("\n");

    const prompt = `You are an AI that extracts invoice data from any text (emails, messages, requests).

PRICE LIST (use these prices for matching services):
${priceListText}

RULES:
1. Extract client name, email, company, address from the text if present.
2. Identify ALL services/products mentioned and match them to the price list above (case-insensitive, partial match allowed).
3. If a service is not in the price list, set unit_price to 0 and price_known to false.
4. If quantity is mentioned (e.g. "7 pages"), use it. Otherwise quantity = 1.
5. Set status based on completeness:
   - "draft" if client name is missing OR no items found OR no contact info (email or address)
   - "pending_review" if all required fields exist but some item has unit_price = 0
   - "ready" if all fields present and all prices known
6. IMPORTANT: Fill the missing_fields array ONLY with fields that are genuinely completely absent from the text. Choose ONLY from: "client_name", "client_email", "client_address", "items", "due_date". If you found items, DO NOT put "items" in this array!
7. Generate invoice_number as "DRAFT-001" if not provided.
8. Use today's date for "date" if not mentioned. Leave "due_date" null if not mentioned.

Return ONLY this JSON, no markdown formatting (DO NOT wrap in \`\`\`json), no explanation, just raw JSON:
{
  "invoice_number": "string",
  "date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD or null",
  "status": "draft or pending_review or ready",
  "missing_fields": [],
  "client": {
    "name": "string or null",
    "email": "string or null",
    "company": "string or null",
    "address": "string or null"
  },
  "items": [
    {
      "description": "string",
      "quantity": 1,
      "unit_price": 0,
      "total": 0,
      "price_known": true
    }
  ],
  "tax_rate": 0,
  "discount_rate": 0,
  "subtotal": 0,
  "total": 0,
  "notes": "",
  "payment_terms": ""
}

Text to analyze:
${text}`;

    let outputText = "";
    const result = await ollama.generate({
      model: "llama3.1:latest",
      prompt: prompt,
      format: "json",
      options: { temperature: 0.1 }
    });
    
    outputText = result.response || "";

    if (!outputText || !outputText.trim()) {
      return res.status(400).json({ message: "Ollama returned empty response" });
    }

    const cleanOutput = outputText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    // Bloc de siguranță la parsare JSON pentru stabilitatea containerului
    let parsedData;
    try {
      parsedData = JSON.parse(cleanOutput);
    } catch (parseError) {
      console.error("Eroare parsare JSON de la AI:", cleanOutput);
      return res.status(422).json({ message: "AI generated an invalid JSON syntax structure. Try again." });
    }

    if (!parsedData.client) parsedData.client = { name: null, email: null, company: null, address: null };
    if (!Array.isArray(parsedData.items)) parsedData.items = [];
    if (!Array.isArray(parsedData.missing_fields)) parsedData.missing_fields = [];

    if (parsedData.items.length > 0) {
      parsedData.missing_fields = parsedData.missing_fields.filter(f => f !== "items");
    }
    if (parsedData.due_date) {
      parsedData.missing_fields = parsedData.missing_fields.filter(f => f !== "due_date");
    }

    const subtotal = parsedData.items.reduce((sum, item) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Number(item.unit_price) || 0;
      item.quantity = qty;
      item.unit_price = price;
      item.total = qty * price;
      return sum + item.total;
    }, 0);

    const taxRate = Number(parsedData.tax_rate) || 0;
    const discountRate = Number(parsedData.discount_rate) || 0;
    const total = subtotal + subtotal * (taxRate / 100) - subtotal * (discountRate / 100);

    parsedData.subtotal = Number(subtotal.toFixed(2));
    parsedData.total = Number(total.toFixed(2));

    const hasClientName = !!(parsedData.client?.name && parsedData.client.name.toLowerCase() !== "null");
    const hasItems = parsedData.items.length > 0;
    const hasContact = !!(parsedData.client?.email || parsedData.client?.address);
    const allPricesKnown = parsedData.items.every(i => i.price_known !== false && Number(i.unit_price) > 0);

    let ai_status = "draft";
    if (hasClientName && hasItems && hasContact) {
      ai_status = allPricesKnown ? "ready" : "pending_review";
    }

    const items_with_unknown_price = parsedData.items
      .filter(i => i.price_known === false || Number(i.unit_price) === 0)
      .map(i => i.description);

    let clientId = null;
    if (hasClientName) {
      let client = await Client.findOne({ name: new RegExp(`^${parsedData.client.name}$`, "i"), user: userId });
      if (!client) {
        client = await Client.create({
          name: parsedData.client.name,
          email: parsedData.client.email || "",
          company: parsedData.client.company || "",
          address: parsedData.client.address || "",
          cui: parsedData.client.cui || "",     
          city: parsedData.client.city || "",   
          county: parsedData.client.county || "", 
          user: userId,
        });
      }
      clientId = client._id;
    } else {
      const defaultClient = await Client.create({ name: "Unknown Client", user: userId });
      clientId = defaultClient._id;
    }

    const cleanItems = parsedData.items.map(({ price_known, ...item }) => ({
      description: item.description || "Item",
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      total: Number(item.total) || 0,
    }));

    const newInvoice = await Invoice.create({
      user: userId,
      client: clientId,
      invoice_number: parsedData.invoice_number || `DRAFT-${Date.now()}`,
      date: parsedData.date ? new Date(parsedData.date) : new Date(),
      due_date: parsedData.due_date ? new Date(parsedData.due_date) : undefined,
      status: "pending", 
      items: cleanItems,
      tax_rate: taxRate,
      discount_rate: discountRate,
      subtotal: parsedData.subtotal,
      total: parsedData.total,
      notes: parsedData.notes || "",
      payment_terms: parsedData.payment_terms || "",
    });

    const populatedInvoice = await Invoice.findById(newInvoice._id).populate("client");

    // 🔥 DISPATCH AUTOMAT EMAIL + PDF ACUM (Ruta Interfață)
    if (populatedInvoice && populatedInvoice.client && populatedInvoice.client.email) {
      sendInvoiceEmail(populatedInvoice, populatedInvoice.client)
        .then(() => console.log(`[Resend] Mail dispatch success to ${populatedInvoice.client.email}`))
        .catch(err => console.error("[Resend Error] Failed to send invoice pdf:", err));
    }

    return res.status(201).json({
      success: true,
      message: "Invoice compiled by local AI successfully",
      invoice: populatedInvoice,
      ai_status,
      missing_fields: parsedData.missing_fields,
      items_with_unknown_price,
    });
  } catch (error) {
    console.error("Invoice Generation Error:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ── 2. FUNCTIA INTERNĂ PENTRU BACKGROUND EMAIL WORKER ───────────────────────
export const generateInvoiceFromTextInternal = async (text, fallbackEmail = null, userId = null) => {
  try {
    const priceListText = Object.entries(SERVICE_PRICES)
      .map(([service, price]) => `- ${service}: ${price} EUR`)
      .join("\n");

    const prompt = `You are an AI that extracts invoice data from any text (emails, messages, requests).

PRICE LIST (use these prices for matching services):
${priceListText}

RULES:
1. Extract client name, email, company, address from the text if present.
2. Identify ALL services/products mentioned and match them to the price list above (case-insensitive, partial match allowed).
3. If a service is not in the price list, set unit_price to 0 and price_known to false.
4. If quantity is mentioned (e.g. "7 pages"), use it. Otherwise quantity = 1.
5. Set status based on completeness:
   - "draft" if client name is missing OR no items found OR no contact info (email or address)
   - "pending_review" if all required fields exist but some item has unit_price = 0
   - "ready" if all fields present and all prices known
6. IMPORTANT: Fill the missing_fields array ONLY with fields that are genuinely completely absent from the text. Choose ONLY from: "client_name", "client_email", "client_address", "items", "due_date". If you found items, DO NOT put "items" in this array!
7. Generate invoice_number as "DRAFT-001" if not provided.
8. Use today's date for "date" if not mentioned. Leave "due_date" null if not mentioned.

Return ONLY this JSON, no markdown formatting (DO NOT wrap in \`\`\`json), no explanation, just raw JSON:
{
  "invoice_number": "string",
  "date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD or null",
  "status": "draft or pending_review or ready",
  "missing_fields": [],
  "client": {
    "name": "string or null",
    "email": "string or null",
    "company": "string or null",
    "address": "string or null"
  },
  "items": [
    {
      "description": "string",
      "quantity": 1,
      "unit_price": 0,
      "total": 0,
      "price_known": true
    }
  ],
  "tax_rate": 0,
  "discount_rate": 0,
  "subtotal": 0,
  "total": 0,
  "notes": "",
  "payment_terms": ""
}

Text to analyze:
${text}`;

    let outputText = "";
    const result = await ollama.generate({
      model: "llama3.1:latest",
      prompt: prompt,
      format: "json",
      options: { temperature: 0.1 }
    });
    
    outputText = result.response || "";

    if (!outputText || !outputText.trim()) {
      console.log("Ollama a întors un răspuns gol pentru email.");
      return null;
    }

    const cleanOutput = textResponse => {
      return textResponse.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    };

    const parsedData = JSON.parse(cleanOutput(outputText));

    if (!parsedData.client) parsedData.client = {};
    if (!parsedData.client.email && fallbackEmail) {
      parsedData.client.email = fallbackEmail;
    }

    if (!Array.isArray(parsedData.items)) parsedData.items = [];
    if (!Array.isArray(parsedData.missing_fields)) parsedData.missing_fields = [];

    if (parsedData.items.length > 0) {
      parsedData.missing_fields = parsedData.missing_fields.filter(f => f !== "items");
    }
    if (parsedData.due_date) {
      parsedData.missing_fields = parsedData.missing_fields.filter(f => f !== "due_date");
    }

    const subtotal = parsedData.items.reduce((sum, item) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Number(item.unit_price) || 0;
      item.quantity = qty;
      item.unit_price = price;
      item.total = qty * price;
      return sum + item.total;
    }, 0);

    const taxRate = Number(parsedData.tax_rate) || 0;
    const discountRate = Number(parsedData.discount_rate) || 0;
    const total = subtotal + subtotal * (taxRate / 100) - subtotal * (discountRate / 100);

    parsedData.subtotal = Number(subtotal.toFixed(2));
    parsedData.total = Number(total.toFixed(2));

    let clientId = null;
    const hasClientName = !!parsedData.client?.name && parsedData.client.name.toLowerCase() !== "null";

    if (hasClientName) {
      let client = await Client.findOne({ name: new RegExp(`^${parsedData.client.name}$`, "i"), user: userId });
      if (!client) {
        client = await Client.create({
          name: parsedData.client.name,
          email: parsedData.client.email || "",
          company: parsedData.client.company || "",
          address: parsedData.client.address || "",
          user: userId
        });
      }
      clientId = client._id;
    } else {
      let defaultClient = await Client.findOne({ name: "Unknown Client", user: userId });
      if (!defaultClient) {
        defaultClient = await Client.create({ name: "Unknown Client", user: userId });
      }
      clientId = defaultClient._id;
    }

    const cleanItems = parsedData.items.map(item => ({
      description: item.description || "Item",
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price) || 0,
      total: Number(item.total) || 0,
    }));

    const newInvoice = await Invoice.create({
      user: userId, 
      client: clientId,
      invoice_number: parsedData.invoice_number || `EMAIL-${Date.now()}`,
      date: parsedData.date ? new Date(parsedData.date) : new Date(),
      due_date: parsedData.due_date ? new Date(parsedData.due_date) : undefined,
      status: "pending", 
      items: cleanItems,
      tax_rate: taxRate,
      discount_rate: discountRate,
      subtotal: parsedData.subtotal,
      total: parsedData.total,
      notes: parsedData.notes || "Generat automat din email.",
      payment_terms: parsedData.payment_terms || "",
    });

    const populatedWorkerInvoice = await Invoice.findById(newInvoice._id).populate("client");

    // 🔥 DISPATCH AUTOMAT EMAIL + PDF ACUM (Background IMAP Worker)
    if (populatedWorkerInvoice && populatedWorkerInvoice.client && populatedWorkerInvoice.client.email) {
      sendInvoiceEmail(populatedWorkerInvoice, populatedWorkerInvoice.client)
        .then(() => console.log(`[Worker Resend] Automated dispatch success to ${populatedWorkerInvoice.client.email}`))
        .catch(err => console.error("[Worker Resend Error] Failed to send document:", err));
    }

    console.log(`\x1b[32m[AI Worker] Factură salvată cu succes din email! ID: ${newInvoice._id}\x1b[0m`);
    return newInvoice;

  } catch (err) {
    console.error("Eroare gravă în funcția internă AI Worker:", err);
  }
};

// ── 3. FUNCTIA PENTRU MODULUL DE CHAT ASISTENT ────────────────────────────────
export const aiChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Missing or invalid messages" });
    }

    const historyText = messages
      .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const clients = await Client.find({ user: userId }).lean();
    const invoices = await Invoice.find({ user: userId }).populate("client").lean();

    const prompt = `You are invoiceGenAI — a smart invoice & client assistant running locally via Ollama.

You ALWAYS answer using the real data below:

CLIENTS:
${JSON.stringify(clients, null, 2)}

INVOICES:
${JSON.stringify(invoices, null, 2)}

Conversation so far:
${historyText}

Rules:
- Be friendly and professional.
- Use ONLY real data from above.
- If user asks for totals, overdue invoices, predictions, calculate them.
- If user asks something impossible, say info is not available.
- Never invent clients or invoices.`;

    const result = await ollama.generate({
      model: "llama3.1:latest",
      prompt: prompt,
    });

    const reply = result.response || "I'm not sure how to answer that.";

    return res.json({ success: true, reply: reply.trim() });

  } catch (error) {
    console.error("AI Chat error:", error);
    return res.status(500).json({ message: "AI chat failed" });
  }
};

// ── EXTRAGERE ISTORIC FACTURI AI ─────────────────────────────────────────────
export const getAiGenerationHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const history = await Invoice.find({
      user: userId,
      status: { $in: ["pending", "draft"] }
    })
    .populate("client", "name company email")
    .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error("Error fetching AI history:", error);
    return res.status(500).json({ message: "Nu s-a putut prelua istoricul AI." });
  }
};

// ── ȘTERGERE FACTURĂ DIN ISTORIC ─────────────────────────────────────────────
export const deleteAiInvoice = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const invoice = await Invoice.findOneAndDelete({ _id: id, user: userId });

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Documentul nu a fost găsit sau nu aveți permisiunea." });
    }

    return res.json({
      success: true,
      message: "Documentul preliminar a fost eliminat din istoric cu succes."
    });
  } catch (error) {
    console.error("Error deleting AI invoice:", error);
    return res.status(500).json({ message: "Eroare la ștergerea documentului." });
  }
};
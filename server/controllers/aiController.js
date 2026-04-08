import genAI from "../config/ai.js";
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import Subscription from "../models/Subscription.js";

// ── Prețuri prestabilite per serviciu ─────────────────────────────────────────
// Modifică aici prețurile și serviciile tale
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
  "mentenanță": 100,
  "consulting": 80,
  "consultanta": 80,
  "photography": 200,
  "fotografie": 200,
  "video editing": 300,
  "editare video": 300,
};

export const generateInvoiceFromText = async (req, res) => {
  try {
    const { text, customPrices } = req.body;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Missing 'text' in request body" });
    }

    // Check subscription
    const sub = await Subscription.findOne({ user: userId });
    if (!sub) {
      console.warn("No subscription found — defaulting to Free plan");
    } else if (sub.status !== "Active") {
      return res.status(403).json({
        message: "AI access restricted. Please upgrade your plan.",
      });
    }

    console.log("AI access granted for plan:", sub?.plan || "Free");

    // Merge prețuri default cu cele custom trimise din frontend
    const activePrices = { ...SERVICE_PRICES, ...(customPrices || {}) };

    const priceListText = Object.entries(activePrices)
      .map(([service, price]) => `  - "${service}": ${price} EUR`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an AI specialized in extracting invoice data from text messages, emails, or any kind of text.

Your job:
1. Extract ALL available information from the text (client name, email, company, address, requested services, quantities).
2. For each service/product mentioned, assign a price from the PRICE LIST below. If a service is not in the list, set unit_price to 0 and mark it as needing review.
3. Determine if the invoice is COMPLETE or a DRAFT based on the rules below.
4. Return ONLY valid JSON, no markdown, no comments, no explanation.

PRICE LIST (EUR):
${priceListText}

COMPLETENESS RULES:
- Set "status": "draft" if ANY of these are missing: client name, at least one service/item, client email OR address.
- Set "status": "pending_review" if all required fields exist BUT some item has unit_price = 0 (unknown service price).
- Set "status": "ready" if all fields are present and all prices are known.
- NEVER set status to "paid" or "sent" — those are set manually by the user.

MISSING FIELDS TRACKING:
- Fill "missing_fields" array with names of fields that are absent or unclear (e.g. ["client_email", "client_address", "due_date"]).
- If a service quantity is not mentioned, assume quantity = 1.
- If a page count or unit count is mentioned (e.g. "7 pages"), use it as quantity.

IMPORTANT:
- Extract partial data even if incomplete — always return whatever you found.
- If client name is unclear, use what seems most like a company or person name.
- If no date is mentioned, use today's date for "date" and leave "due_date" null.
- For "invoice_number", generate a placeholder like "DRAFT-001" if not provided.

Return this exact JSON structure:
{
  "invoice_number": "string",
  "date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD or null",
  "status": "draft" | "pending_review" | "ready",
  "missing_fields": ["field1", "field2"],
  "client": {
    "name": "string or null",
    "email": "string or null",
    "company": "string or null",
    "address": "string or null"
  },
  "items": [
    {
      "description": "string",
      "quantity": number,
      "unit_price": number,
      "total": number,
      "price_known": true | false
    }
  ],
  "tax_rate": 0,
  "discount_rate": 0,
  "subtotal": number,
  "total": number,
  "notes": "string",
  "payment_terms": "string"
}

Now extract all possible data from this text:
${text}
`;

    // Gemini response
    let outputText;
    try {
      const result = await model.generateContent(prompt);
      outputText =
        result?.response?.text?.() ||
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (aiError) {
      console.error("Gemini API error:", aiError);
      return res.status(500).json({
        message: "Failed to connect to Gemini API",
        error: aiError.message,
      });
    }

    const cleanOutput = outputText
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!cleanOutput) {
      return res.status(400).json({ message: "Gemini returned empty response" });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(cleanOutput);
    } catch (err) {
      console.error("Invalid JSON from Gemini:", cleanOutput);
      return res.status(400).json({
        message: "Gemini returned invalid JSON",
        raw: cleanOutput,
      });
    }

    // Ensure required structures
    if (!parsedData.client) {
      parsedData.client = { name: null, email: null, company: null, address: null };
    }

    if (!Array.isArray(parsedData.items)) {
      parsedData.items = [];
    }

    // Recompute subtotal/total from items
    const subtotal = parsedData.items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.unit_price) || 0;
      item.total = Number(item.total) || qty * price;
      return sum + item.total;
    }, 0);

    const taxRate = Number(parsedData.tax_rate) || 0;
    const discountRate = Number(parsedData.discount_rate) || 0;
    const total = subtotal + subtotal * (taxRate / 100) - subtotal * (discountRate / 100);

    parsedData.subtotal = subtotal;
    parsedData.total = Number(total.toFixed(2));

    // missing_fields fallback
    if (!Array.isArray(parsedData.missing_fields)) {
      parsedData.missing_fields = [];
    }

    // Determine final status
    const hasClient = !!parsedData.client?.name;
    const hasItems = parsedData.items.length > 0;
    const hasContact = !!(parsedData.client?.email || parsedData.client?.address);
    const allPricesKnown = parsedData.items.every((i) => i.price_known !== false && i.unit_price > 0);

    let finalStatus = "draft";
    if (hasClient && hasItems && hasContact) {
      finalStatus = allPricesKnown ? "ready" : "pending_review";
    }
    parsedData.status = finalStatus;

    // Create or reuse client
    let clientId = null;
    const clientInfo = parsedData.client;

    if (clientInfo?.name) {
      let client = await Client.findOne({ name: clientInfo.name, createdBy: userId });

      if (!client) {
        client = await Client.create({
          name: clientInfo.name,
          email: clientInfo.email || "",
          company: clientInfo.company || "",
          address: clientInfo.address || "",
          createdBy: userId,
        });
      }

      clientId = client._id;
    } else {
      const defaultClient = await Client.create({
        name: "Unknown Client",
        createdBy: userId,
      });
      clientId = defaultClient._id;
    }

    // Create invoice (always saved, even drafts)
    const newInvoice = await Invoice.create({
      user: userId,
      client: clientId,
      invoice_number: parsedData.invoice_number || `DRAFT-${Date.now()}`,
      date: parsedData.date || new Date().toISOString().split("T")[0],
      due_date: parsedData.due_date || "",
      status: finalStatus === "ready" ? "draft" : finalStatus, // map "ready" → "draft" for DB enum compatibility
      items: parsedData.items.map(({ price_known, ...item }) => item), // strip price_known before saving
      tax_rate: taxRate,
      discount_rate: discountRate,
      subtotal,
      total,
      notes: parsedData.notes || "",
      payment_terms: parsedData.payment_terms || "",
    });

    const populatedInvoice = await Invoice.findById(newInvoice._id).populate("client");

    res.status(201).json({
      success: true,
      message: "Invoice successfully generated",
      invoice: populatedInvoice,
      ai_status: finalStatus,           // "draft" | "pending_review" | "ready"
      missing_fields: parsedData.missing_fields,
      items_with_unknown_price: parsedData.items
        .filter((i) => i.price_known === false || i.unit_price === 0)
        .map((i) => i.description),
    });
  } catch (error) {
    console.error("Invoice Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const aiChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messages } = req.body;

    if (!messages)
      return res.status(400).json({ message: "Missing messages" });

    const historyText = messages
      .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const clients = await Client.find({ createdBy: userId }).lean();
    const invoices = await Invoice.find({ user: userId }).populate("client").lean();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are invoiceGenAI — a smart invoice & client assistant.

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
- If user asks for totals, overdue invoices, predictions → calculate them.
- If user asks something impossible → say info is not available.
- Never invent clients or invoices.
`;

    const result = await model.generateContent(prompt);

    const reply =
      result?.response?.text?.() ||
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm not sure how to answer that.";

    res.json({ success: true, reply: reply.trim() });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ message: "AI chat failed" });
  }
};
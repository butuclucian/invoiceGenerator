import genAI from "../config/ai.js";
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import Subscription from "../models/Subscription.js";

export const generateInvoiceFromText = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Missing 'text' in request body" });
    }

    // ✅ Check dacă userul are abonament activ (dar permitem testarea fără abonament)
    const sub = await Subscription.findOne({ user: userId });
    if (!sub) {
      console.warn("⚠️ No subscription found — defaulting to Free plan");
    } else if (sub.status !== "Active") {
      return res.status(403).json({ message: "AI access restricted. Please upgrade your plan." });
    }

    console.log("✅ AI access granted for plan:", sub?.plan || "Free");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 🧠 Prompt îmbunătățit — forțează completitudinea clientului și a itemelor
    const prompt = `
You are an AI specialized in extracting invoice data from text.
Return ONLY valid JSON in this structure (no markdown, no comments):

{
  "invoice_number": "string",
  "date": "YYYY-MM-DD",
  "due_date": "YYYY-MM-DD or null",
  "client": {
    "name": "string",
    "email": "string or null",
    "company": "string or null",
    "address": "string or null"
  },
  "status": "draft" | "sent" | "paid" | "overdue",
  "items": [
    {
      "description": "string",
      "quantity": number,
      "unit_price": number,
      "total": number
    }
  ],
  "tax_rate": number,
  "discount_rate": number,
  "subtotal": number,
  "total": number,
  "notes": "string",
  "payment_terms": "string"
}

If any client details (like email, company, or address) are missing,
still include the 'client' object with null values.
Never omit any field — even if data is missing.

Now extract all possible data from this text and output JSON only:
${text}
`;

    // 🧠 Gemini request
    let outputText;
    try {
      const result = await model.generateContent(prompt);
      outputText =
        result?.response?.text?.() ||
        result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (aiError) {
      console.error("❌ Gemini API error:", aiError);
      return res.status(500).json({
        message: "Failed to connect to Gemini API",
        error: aiError.message,
      });
    }

    // 🧹 Clean JSON
    const cleanOutput = outputText
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!cleanOutput) {
      return res.status(400).json({ message: "Gemini returned empty response" });
    }

    // 🧩 Parse JSON safely
    let parsedData;
    try {
      parsedData = JSON.parse(cleanOutput);
    } catch (err) {
      console.error("❌ Invalid JSON from Gemini:", cleanOutput);
      return res.status(400).json({
        message: "Gemini returned invalid JSON",
        raw: cleanOutput,
      });
    }

    // 🛡️ Fallback pentru client lipsă
    if (!parsedData.client) {
      parsedData.client = {
        name: "Unknown Client",
        email: "",
        company: "",
        address: "",
      };
    }

    // 🧮 Fallback pentru items (lista goală)
    if (!Array.isArray(parsedData.items)) {
      parsedData.items = [];
    }

    // 🧾 Calcul automat subtotal + total dacă lipsesc sau sunt greșite
    const subtotal = parsedData.items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unit_price) || 0;
      item.total = Number(item.total) || qty * price;
      return sum + item.total;
    }, 0);

    const taxRate = Number(parsedData.tax_rate) || 0;
    const discountRate = Number(parsedData.discount_rate) || 0;
    const total =
      subtotal + subtotal * (taxRate / 100) - subtotal * (discountRate / 100);

    parsedData.subtotal = subtotal;
    parsedData.total = Number(total.toFixed(2));

    // 🧱 Creează sau reusează clientul
    let clientId;
    const clientInfo = parsedData.client;

    if (clientInfo.name) {
      let client = await Client.findOne({
        name: clientInfo.name,
        createdBy: userId,
      });

      if (!client) {
        client = await Client.create({
          name: clientInfo.name || "Unnamed Client",
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
        email: "",
        company: "",
        address: "",
        createdBy: userId,
      });
      clientId = defaultClient._id;
    }

    // 🧮 Creează factura în DB
    const newInvoice = await Invoice.create({
      user: userId,
      client: clientId,
      invoice_number: parsedData.invoice_number || `INV-${Date.now()}`,
      date: parsedData.date || new Date().toISOString().split("T")[0],
      due_date: parsedData.due_date || "",
      status: parsedData.status || "draft",
      items: parsedData.items || [],
      tax_rate: taxRate,
      discount_rate: discountRate,
      subtotal: subtotal,
      total: total,
      notes: parsedData.notes || "",
      payment_terms: parsedData.payment_terms || "",
    });

    // ✅ Populează clientul înainte de a trimite
    const populatedInvoice = await Invoice.findById(newInvoice._id).populate("client");

    res.status(201).json({
      success: true,
      message: "Invoice successfully generated, verified, and saved",
      invoice: populatedInvoice,
    });

  } catch (error) {
    console.error("❌ Invoice Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

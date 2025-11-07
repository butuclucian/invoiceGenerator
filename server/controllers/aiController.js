import genAI from "../config/ai.js";
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";

export const generateInvoiceFromText = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Missing 'text' in request body" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

Now extract all possible data from the following text and output JSON only:
${text}
`;

    // 🧠 Gemini request
    let outputText;
    try {
      const result = await model.generateContent(prompt);
      outputText = result?.response?.text?.() || result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (aiError) {
      console.error("❌ Gemini API error:", aiError);
      return res.status(500).json({ message: "Failed to connect to Gemini API", error: aiError.message });
    }

    // 🧹 Clean JSON
    const cleanOutput = outputText?.replace(/```json/g, "").replace(/```/g, "").trim();
    if (!cleanOutput) {
      return res.status(400).json({ message: "Gemini returned empty response" });
    }

    // 🧩 Parse JSON
    let parsedData;
    try {
      parsedData = JSON.parse(cleanOutput);
    } catch (err) {
      console.error("❌ Invalid JSON from Gemini:", cleanOutput);
      return res.status(400).json({ message: "Gemini returned invalid JSON", raw: cleanOutput });
    }

    // 🧱 Creează clientul sau folosește existentul
    let clientId;
    const clientInfo = parsedData.client || {};

    if (clientInfo.name) {
      let client = await Client.findOne({ name: clientInfo.name, createdBy: userId });

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
      // fallback în caz că AI nu dă clientul
      const defaultClient = await Client.create({
        name: "Unknown Client",
        email: "",
        company: "",
        address: "",
        createdBy: userId,
      });
      clientId = defaultClient._id;
    }

    // 🧮 Creează factura
    const newInvoice = await Invoice.create({
      user: userId,
      client: clientId,
      invoice_number: parsedData.invoice_number || `INV-${Date.now()}`,
      date: parsedData.date || new Date().toISOString().split("T")[0],
      due_date: parsedData.due_date || "",
      status: parsedData.status || "draft",
      items: parsedData.items || [],
      tax_rate: parsedData.tax_rate || 0,
      discount_rate: parsedData.discount_rate || 0,
      subtotal: parsedData.subtotal || 0,
      total: parsedData.total || 0,
      notes: parsedData.notes || "",
      payment_terms: parsedData.payment_terms || "",
    });

    res.status(201).json({
      success: true,
      message: "Invoice successfully generated and saved",
      invoice: newInvoice,
    });
  } catch (error) {
    console.error("❌ Invoice Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

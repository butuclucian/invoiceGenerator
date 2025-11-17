import genAI from "../config/ai.js";
import Client from "../models/Client.js";
import Invoice from "../models/Invoice.js";

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const aiChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ success: false, error: "Missing message." });
    }

    // Load contextual data
    const clients = await Client.find({ createdBy: userId }).lean();
    const invoices = await Invoice.find({ user: userId })
      .populate("client")
      .lean();

    // Build the system prompt
    const systemPrompt = `
You are BillForge AI Assistant.
You help users understand invoices, clients, payments, subscriptions and generate invoice-related insights.

USER DATA CONTEXT:
- Clients: ${JSON.stringify(clients, null, 2)}
- Invoices: ${JSON.stringify(invoices, null, 2)}

IMPORTANT RULES:
- Always respond in a friendly tone.
- If user asks for client/invoice information, answer based on real data.
- If user asks to generate text (emails, notes, summaries), do it.
- If you lack info, say it is not available.
- Keep answers short unless explicitly asked for detail.
    `;

    // Prepare chat messages for Gemini
    const messages = [
      { role: "system", parts: [{ text: systemPrompt }] },
      ...(history || []).map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    // Send conversation to Gemini
    const chat = await model.startChat({ messages });
    const result = await chat.sendMessage(message);

    const reply =
      result?.response?.text?.() ||
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm not sure how to answer that.";

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("AI Chat error:", err);
    res.status(500).json({
      success: false,
      error: "AI processing failed",
    });
  }
};

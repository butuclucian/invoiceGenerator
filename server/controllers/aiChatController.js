import genAI from "../config/ai.js";
import Client from "../models/Client.js";
import Invoice from "../models/Invoice.js";

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export const aiChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Missing message.",
      });
    }

    // 1) Load contextual data
    const clients = await Client.find({ createdBy: userId }).lean();
    const invoices = await Invoice.find({ user: userId })
      .populate("client")
      .lean();

    // 2) History formatting
    const historyText = Array.isArray(history)
      ? history
          .map(
            (msg) =>
              `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
          )
          .join("\n")
      : "";

    // 3) Prompt final (ADDED: no markdown, no *, no **, no bullets)
    const prompt = `
      You are BillForge AI Assistant, a friendly and knowledgeable finance helper.

      You answer questions about:
      invoices, clients, payments, overdue invoices, totals, summaries, insights,
      generating email texts, notes or explanations.

      You MUST use the real user data below.

      IMPORTANT OUTPUT RULES (apply ALWAYS):
      - DO NOT use Markdown.
      - DO NOT use *, **, -, _, #, • or any formatting symbols.
      - DO NOT create bullet points.
      - Respond ONLY in plain clean text.
      - Use normal sentences or line breaks.
      - Lists must be written as simple lines, not bullets.
      - Keep answers concise, clear and human-friendly.

      === CLIENTS ===
      ${JSON.stringify(clients, null, 2)}

      === INVOICES ===
      ${JSON.stringify(invoices, null, 2)}

      === CONVERSATION HISTORY ===
      ${historyText}

      === USER MESSAGE ===
      "${message}"

      RULES:
      - If the user asks something that requires calculations, compute them accurately.
      - NEVER invent invoices or clients.
      - If info is missing, explicitly say it.
      - Keep responses helpful, professional and friendly.
          `;

    // 4) Gemini Response
    const result = await model.generateContent(prompt);

    const reply =
      result?.response?.text?.() ||
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate an answer.";

    return res.json({
      success: true,
      reply: reply.trim(),
    });

  } catch (err) {
    console.error("AI Chat error:", err);
    return res.status(500).json({
      success: false,
      error: "AI processing failed.",
    });
  }
};

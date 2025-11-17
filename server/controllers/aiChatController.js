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

    // 3) Prompt final
    const prompt = `
You are **BillForge AI Assistant**, a friendly and knowledgeable finance helper.

You answer questions about:
- invoices  
- clients  
- payments  
- overdue invoices  
- totals, summaries, and insights  
- generating email texts, notes or explanations  

You MUST use the real user data below:

=== CLIENTS ===
${JSON.stringify(clients, null, 2)}

=== INVOICES ===
${JSON.stringify(invoices, null, 2)}

=== CONVERSATION HISTORY ===
${historyText}

=== USER MESSAGE ===
"${message}"

RULES:
- Be very clear and concise.
- Use bullet points when needed.
- If the user asks something that requires calculations, compute them.
- NEVER invent invoices or clients.
- If info is missing, explicitly say it.
- Keep responses helpful and smart.
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

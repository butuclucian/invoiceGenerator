import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export default genAI;

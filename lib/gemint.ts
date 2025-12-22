import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const generateAI = new GoogleGenerativeAI(apiKey);

const geminiModel = generateAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

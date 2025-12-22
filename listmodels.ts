// scripts/listModels.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

async function main() {
  const apiKey = process.env.GEMINI_API_KEY!;
  const generateAI = new GoogleGenerativeAI(apiKey);
  const models = await generateAI.listModels();
  console.log(models);
}

main();

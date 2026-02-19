
import { GoogleGenAI } from "@google/genai";

// Always use the named parameter and process.env.API_KEY directly for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askGeminiAboutDev = async (question: string) => {
  try {
    // Generate a response using the gemini-3-flash-preview model.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: `You are an AI assistant for a world-class mobile app developer's portfolio. 
        The developer is expert in React Native, Swift, and Flutter. 
        Always be professional, concise, and highlight the developer's skills and creativity. 
        If asked about projects, mention they've worked on FinTrack, HealthFlow, and EcoMarket.
        Answer as if you are part of their futuristic iPhone OS.`,
        temperature: 0.7,
      }
    });
    // Access the .text property directly as it is a getter.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my central processing unit right now. Please try again!";
  }
};


import { GoogleGenAI } from "@google/genai";

// Initializing Gemini client with API_KEY from process.env strictly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCalibrationInsights = async (history: any[]) => {
  // Assuming process.env.API_KEY is available as per requirements
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyse the following calibration history and provide a summary of trends, potential equipment failures, and maintenance recommendations for GMP compliance: ${JSON.stringify(history)}`,
      config: {
        systemInstruction: "You are a professional calibration analyst specializing in GMP/ISO industrial standards."
      }
    });
    // response.text is a property, not a method
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI insights.";
  }
};

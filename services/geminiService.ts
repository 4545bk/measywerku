
import { GoogleGenAI } from "@google/genai";
import { Property } from "../types";

// Function to generate a luxury property description using Gemini
export async function generatePropertyDescription(property: Partial<Property>): Promise<string> {
  try {
    // Create a new instance right before making the call as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write a luxury real estate description for the following property:
    Title: ${property.title}
    Type: ${property.type}
    Bedrooms: ${property.bedrooms}
    Bathrooms: ${property.bathrooms}
    Size: ${property.size} sqm
    Price: ${property.price} ETB
    Location details: Premium Addis Ababa location.
    
    Make it sound sophisticated, exclusive, and appealing to high-end investors. Use around 100-150 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Use .text property directly as per guidelines
    return response.text || "Description could not be generated.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating AI description. Please try again later.";
  }
}

// Function to get analytics insights from property data
export async function getAnalyticsInsights(data: any): Promise<string> {
  try {
    // Create a new instance right before making the call as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze this real estate data and provide 3 quick bullet points of insight for the admin:
    ${JSON.stringify(data)}
    Focus on conversion, most popular property types, and high-performing locations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Use .text property directly as per guidelines
    return response.text || "No insights available.";
  } catch (error) {
    return "Insights unavailable.";
  }
}

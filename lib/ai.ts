'use client';

import { GoogleGenAI, Type } from "@google/genai";
import { BusinessName, Slogan, LogoConcept, BrandStyle } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

function getAI() {
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
}

export async function generateNames(
  description: string,
  industry: string,
  style: BrandStyle
): Promise<BusinessName[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 6 creative business names for a brand in the ${industry} industry. 
    Description: ${description}. 
    Style: ${style}. 
    Provide a short explanation for each name.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["id", "name", "explanation"]
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate names: Empty response");
  }
  return JSON.parse(response.text);
}

export async function generateSlogans(
  name: string,
  description: string,
  industry: string,
  style: BrandStyle
): Promise<Slogan[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 6 catchy slogans for a brand named "${name}". 
    Description: ${description}. 
    Industry: ${industry}. 
    Style: ${style}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING }
          },
          required: ["id", "text"]
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate slogans: Empty response");
  }
  return JSON.parse(response.text);
}

export async function generateLogoConcepts(
  name: string,
  slogan: string,
  description: string,
  industry: string,
  style: BrandStyle
): Promise<LogoConcept[]> {
  const ai = getAI();
  
  // First, generate the concepts
  const conceptResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3 visual logo concepts for a brand named "${name}" with the slogan "${slogan}". 
    Description: ${description}. 
    Industry: ${industry}. 
    Style: ${style}. 
    For each concept, provide a description, a color palette (hex codes), a font suggestion, and a visual idea.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            description: { type: Type.STRING },
            colorPalette: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            fontSuggestion: { type: Type.STRING },
            visualIdea: { type: Type.STRING }
          },
          required: ["id", "description", "colorPalette", "fontSuggestion", "visualIdea"]
        }
      }
    }
  });

  if (!conceptResponse.text) {
    throw new Error("Failed to generate logo concepts: Empty response");
  }
  const concepts: LogoConcept[] = JSON.parse(conceptResponse.text);

  // Then, generate images for each concept using nano banana
  const conceptsWithImages = await Promise.all(concepts.map(async (concept) => {
    try {
      const imageResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: `A professional, minimalist logo design for a brand named "${name}". 
        Visual Idea: ${concept.visualIdea}. 
        Style: ${style}. 
        Colors: ${concept.colorPalette.join(", ")}. 
        The logo should be clean, modern, and suitable for the ${industry} industry. 
        White background. High resolution.`,
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        return {
          ...concept,
          imageUrl: `data:image/png;base64,${imagePart.inlineData.data}`
        };
      }
    } catch (err) {
      console.error("Failed to generate image for concept:", concept.id, err);
    }
    return concept;
  }));

  return conceptsWithImages;
}

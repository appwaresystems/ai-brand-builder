'use client';

import { GoogleGenAI, Type } from "@google/genai";
import { BusinessName, Slogan, LogoConcept, BrandStyle } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export async function generateNames(
  description: string,
  industry: string,
  style: BrandStyle
): Promise<BusinessName[]> {
  const prompt = `
    Generate 20 creative business names for a company with the following details:
    Description: ${description}
    Industry: ${industry}
    Brand Style: ${style}

    For each name, provide a short explanation of why it works.
    Return the data in a structured JSON format as an array of objects with 'id', 'name', and 'explanation'.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["id", "name", "explanation"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}

export async function generateSlogans(
  name: string,
  description: string,
  industry: string,
  style: BrandStyle
): Promise<Slogan[]> {
  const prompt = `
    Generate 15 catchy slogans for a business named "${name}".
    Context:
    Description: ${description}
    Industry: ${industry}
    Brand Style: ${style}

    Return the data in a structured JSON format as an array of objects with 'id' and 'text'.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
          },
          required: ["id", "text"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}

export async function generateLogoConcepts(
  name: string,
  slogan: string,
  description: string,
  industry: string,
  style: BrandStyle
): Promise<LogoConcept[]> {
  const prompt = `
    Generate 4 detailed logo concepts for a business named "${name}" with the slogan "${slogan}".
    Context:
    Description: ${description}
    Industry: ${industry}
    Brand Style: ${style}

    For each concept, provide:
    1. A detailed visual description (visualIdea).
    2. A color palette (array of hex codes).
    3. A font suggestion.
    4. A short description of the concept's vibe.

    Return the data in a structured JSON format as an array of objects with 'id', 'description', 'colorPalette', 'fontSuggestion', and 'visualIdea'.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
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
              items: { type: Type.STRING },
            },
            fontSuggestion: { type: Type.STRING },
            visualIdea: { type: Type.STRING },
          },
          required: ["id", "description", "colorPalette", "fontSuggestion", "visualIdea"],
        },
      },
    },
  });

  const concepts: LogoConcept[] = JSON.parse(response.text || "[]");

  // Generate images for each concept
  const conceptsWithImages = await Promise.all(
    concepts.map(async (concept) => {
      try {
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: `A professional, high-quality logo for a business named "${name}". 
                Concept: ${concept.visualIdea}. 
                Style: ${style}, minimal, clean, vector style, white background. 
                Colors: ${concept.colorPalette.join(', ')}.`,
              },
            ],
          },
        });

        const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart?.inlineData) {
          return {
            ...concept,
            imageUrl: `data:image/png;base64,${imagePart.inlineData.data}`,
          };
        }
      } catch (err) {
        console.error("Image generation failed for concept:", concept.id, err);
      }
      return concept;
    })
  );

  return conceptsWithImages;
}

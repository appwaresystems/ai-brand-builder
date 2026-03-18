'use client';

import { BusinessName, Slogan, LogoConcept, BrandStyle } from "@/types";
import { 
  localGenerateNames, 
  localGenerateSlogans, 
  localGenerateLogos 
} from "./brand-engine";

/**
 * These functions now use a local rule-based engine instead of external APIs.
 * This ensures the app works for free on platforms like Netlify without an API key.
 */

export async function generateNames(
  description: string,
  industry: string,
  style: BrandStyle
): Promise<BusinessName[]> {
  // Simulate a small delay for better UX
  await new Promise(resolve => setTimeout(resolve, 1500));
  return localGenerateNames(description, industry);
}

export async function generateSlogans(
  name: string,
  description: string,
  industry: string,
  style: BrandStyle
): Promise<Slogan[]> {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return localGenerateSlogans(name);
}

export async function generateLogoConcepts(
  name: string,
  slogan: string,
  description: string,
  industry: string,
  style: BrandStyle
): Promise<LogoConcept[]> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return localGenerateLogos(name, style);
}

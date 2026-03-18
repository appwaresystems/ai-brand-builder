export interface BusinessName {
  id: string;
  name: string;
  explanation: string;
}

export interface Slogan {
  id: string;
  text: string;
}

export interface LogoConcept {
  id: string;
  description: string;
  colorPalette: string[];
  fontSuggestion: string;
  visualIdea: string;
  imageUrl?: string;
}

export type BrandStyle = 'modern' | 'luxury' | 'tech' | 'playful' | 'minimal';

export type AppStep = 'input' | 'names' | 'slogans' | 'logos';

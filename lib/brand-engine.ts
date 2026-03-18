import { BusinessName, Slogan, LogoConcept, BrandStyle } from "@/types";

/**
 * A local, rule-based branding engine that doesn't require an API key.
 * Perfect for static deployments like Netlify.
 */

const NAME_PATTERNS = [
  (base: string, ind: string) => `${base}${ind}`,
  (base: string, ind: string) => `${ind}${base}`,
  (base: string) => `${base}ly`,
  (base: string) => `${base}ify`,
  (base: string) => `Neo${base}`,
  (base: string) => `${base} Hub`,
  (base: string) => `${base} Flow`,
  (base: string) => `${base} Logic`,
  (base: string) => `Pure ${base}`,
  (base: string) => `${base} Sphere`,
];

const SLOGAN_TEMPLATES = [
  (name: string) => `${name}: The future of your industry.`,
  (name: string) => `Elevate your world with ${name}.`,
  (name: string) => `${name} — Simply better.`,
  (name: string) => `Innovation meets ${name}.`,
  (name: string) => `Your journey, powered by ${name}.`,
  (name: string) => `${name}: Redefining excellence.`,
  (name: string) => `Smart solutions with ${name}.`,
  (name: string) => `${name} — Built for you.`,
];

const STYLE_PALETTES: Record<BrandStyle, string[]> = {
  modern: ['#6366f1', '#a855f7', '#ec4899'],
  luxury: ['#1e293b', '#fbbf24', '#f8fafc'],
  tech: ['#0ea5e9', '#2dd4bf', '#1e293b'],
  playful: ['#f43f5e', '#fb923c', '#facc15'],
  minimal: ['#0f172a', '#64748b', '#f1f5f9'],
};

const STYLE_FONTS: Record<BrandStyle, string> = {
  modern: 'Inter, sans-serif',
  luxury: 'Playfair Display, serif',
  tech: 'JetBrains Mono, monospace',
  playful: 'Outfit, sans-serif',
  minimal: 'Space Grotesk, sans-serif',
};

function generateSVGLogo(name: string, palette: string[], style: BrandStyle): string {
  const primary = palette[0];
  const secondary = palette[1] || palette[0];
  
  // Simple geometric logo generation
  let shape = '';
  if (style === 'modern') {
    shape = `<rect x="25" y="25" width="50" height="50" rx="12" fill="${primary}" fill-opacity="0.2" stroke="${primary}" stroke-width="4"/>`;
  } else if (style === 'luxury') {
    shape = `<circle cx="50" cy="50" r="30" fill="none" stroke="${primary}" stroke-width="2"/>
             <circle cx="50" cy="50" r="25" fill="none" stroke="${secondary}" stroke-width="1"/>`;
  } else if (style === 'tech') {
    shape = `<path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="${primary}" stroke-width="4" stroke-dasharray="8 4"/>`;
  } else {
    shape = `<circle cx="50" cy="50" r="35" fill="${primary}" fill-opacity="0.1"/>
             <path d="M40 40 L60 60 M60 40 L40 60" stroke="${primary}" stroke-width="6" stroke-linecap="round"/>`;
  }

  const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      ${shape}
      <text x="50" y="55" font-family="sans-serif" font-size="24" font-weight="bold" fill="${primary}" text-anchor="middle" dominant-baseline="middle">
        ${name.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function localGenerateNames(description: string, industry: string): BusinessName[] {
  const base = description.split(' ')[0] || 'Brand';
  const ind = industry.substring(0, 4);
  
  return Array.from({ length: 20 }).map((_, i) => {
    const pattern = NAME_PATTERNS[i % NAME_PATTERNS.length];
    const name = pattern(base, ind);
    return {
      id: `name-${i}`,
      name,
      explanation: `A ${name.length > 8 ? 'sophisticated' : 'clean'} name that highlights your ${industry} roots.`
    };
  });
}

export function localGenerateSlogans(name: string): Slogan[] {
  return Array.from({ length: 15 }).map((_, i) => {
    const template = SLOGAN_TEMPLATES[i % SLOGAN_TEMPLATES.length];
    return {
      id: `slogan-${i}`,
      text: template(name)
    };
  });
}

export function localGenerateLogos(name: string, style: BrandStyle): LogoConcept[] {
  const palette = STYLE_PALETTES[style];
  const font = STYLE_FONTS[style];

  return Array.from({ length: 4 }).map((_, i) => {
    return {
      id: `logo-${i}`,
      description: `A ${style} visual identity using ${palette[0]}.`,
      colorPalette: palette,
      fontSuggestion: font,
      visualIdea: `A minimalist ${style} concept focusing on the letter ${name.charAt(0)}.`,
      imageUrl: generateSVGLogo(name, palette, style)
    };
  });
}

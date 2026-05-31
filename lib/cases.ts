// lib/cases.ts
// Typed wrapper around extracted case data.
// Regenerate cases.json via: node scripts/extract-cases.mjs
import casesData from './cases.json';

export type Image = { src: string; tags?: string[]; cap?: string };
export type Testimonial = { q: string; a: string };
export type Case = {
  k: string;            // slug
  n: string;            // case number (display)
  t: string;            // title
  o: string;            // outcome
  l?: string;
  m?: unknown[];
  challenge?: string;
  solutions?: unknown[];
  stats?: unknown[];
  palette?: string[][];   // each entry: [colorName, hexValue]
  logo?: string;
  testimonial?: Testimonial;
  deliverables?: string[];
  heroImg: string;      // rewritten to /work/<slug>/...
  typography?: string[][];  // each entry: [role, fontDescription]
  images?: Image[];
};

export const cases: Case[] = casesData as Case[];

export function getCaseBySlug(slug: string): Case | undefined {
  return cases.find((c) => c.k === slug);
}

export function getCaseIndex(slug: string): number {
  return cases.findIndex((c) => c.k === slug);
}

export function getPrevCase(slug: string): Case | undefined {
  const idx = getCaseIndex(slug);
  return idx > 0 ? cases[idx - 1] : undefined;
}

export function getNextCase(slug: string): Case | undefined {
  const idx = getCaseIndex(slug);
  return idx >= 0 && idx < cases.length - 1 ? cases[idx + 1] : undefined;
}

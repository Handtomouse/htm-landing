// app/work/components/types.ts
// Shared prop interfaces for all portfolio components.
// Plan 04 owns this file; Plan 05 (Testimonial, DeliverablesIndex) imports from it.
import type { Case, Testimonial, Image } from '@/lib/cases';
import type { ReactNode } from 'react';

export type GalleryGridProps = {
  cases: Case[];
};

export type SectorFilterProps = {
  cases: Case[];
  children: ReactNode; // SectorFilter wraps GalleryGrid; chips toggle data-attr on the wrapper, CSS hides non-matching tiles
  // sectors derived inside the component from cases[].m via m.find(([k]) => k === 'Sector')
};

export type CaseDetailProps = {
  case: Case;
  total: number; // total case count for the "{c.n} / {total}" header; pass cases.length from [slug]/page.tsx
  prevCase?: Case;
  nextCase?: Case;
};

export type CasePlayerProps = {
  images: Image[];
  alt: string;
};

export type TestimonialProps = {
  testimonial?: Testimonial;
  // Plan 05 implements; renders null if testimonial is undefined OR testimonial.a is empty (DATA-03)
};

export type DeliverablesIndexProps = {
  deliverables: string[];
  heroImg: string; // used as hover-thumb fallback per POLISH-02
  caseSlug: string; // for click-to-imagery-section anchor
};

export type NextPrevCardProps = {
  direction: 'prev' | 'next';
  case: Case; // only rendered if case exists; POLISH-03 conditional in parent
};

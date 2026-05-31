// app/work/page.tsx
// Gallery route: lists all 19 cases.
// RENDER-01 + POLISH-04 (counter = cases.length, never hardcoded).
// Per locked default #6: plain <img> tags (not next/image) for v1 visual fidelity.
import { cases } from '@/lib/cases';
import SectorFilter from './components/SectorFilter';
import GalleryGrid from './components/GalleryGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work | HandToMouse',
  description: 'Selected studio work from HandToMouse: 19 cases across hospitality, sport, finance, retail, and motorsport.',
};

export default function WorkPage() {
  return (
    <section className="gallery" id="gallery">
      <header className="gallery-head">
        <span className="eyebrow">HTM · Selected Work · 2020 to present</span>
        <h2>Nineteen <em>brands</em>. Built end-to-end.</h2>
        <p>Each one starts on the shelf, in the page, or on the street. Click any tile to step into the full case file.</p>
        <p className="caseref">
          {/* POLISH-04: source of truth is cases.length, never a string literal */}
          {cases.length} cases &middot; 2020 to present
        </p>
      </header>
      <SectorFilter cases={cases}>
        <GalleryGrid cases={cases} />
      </SectorFilter>
      <section className="gallery-cta" aria-label="Start a project">
        <h2>Got a brand that needs building?</h2>
        <a className="cta" href="mailto:hello@handtomouse.org?subject=New%20project%20enquiry">
          <span>Start a project</span>
          <span className="hand-pixel" aria-hidden="true"></span>
        </a>
      </section>
    </section>
  );
}

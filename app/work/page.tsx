// app/work/page.tsx
// Gallery route: lists all 19 cases.
// RENDER-01 + POLISH-04 (counter = cases.length, never hardcoded).
// Per locked default #6: plain <img> tags (not next/image) for v1 visual fidelity.
import { cases } from '@/lib/cases';
import SectorFilter from './components/SectorFilter';
import GalleryGrid from './components/GalleryGrid';
import type { Metadata } from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = 'https://handtomouse.org';

// Gallery OG image source selection (META-02):
//   1. If public/og-work.png exists, use it. It is the curated gallery card if the studio
//      ever ships one (collage / wordmark / etc.).
//   2. Otherwise default to cases[0].heroImg -- the studio's chosen lead case (currently
//      swich -- "S'WICH") acts as the gallery preview. Rationale: no dynamic OG gen in v1
//      per RESEARCH Pattern 4 (static-OG-first); cases[0] is the most representative single
//      image of the studio's output as ordered by Nate in the canonical.
//   3. To swap: drop the curated PNG into public/og-work.png -- no code edit needed.
//      Single call-site: the galleryOgImage variable below.
// cases[0] at build time: slug="swich", title="S'WICH", heroImg="/work/swich/hero.jpg"
const curatedOgExists = existsSync(join(process.cwd(), 'public', 'og-work.png'));
const galleryHeroSrc = curatedOgExists
  ? '/og-work.png'
  : (cases[0].heroImg.startsWith('/') ? cases[0].heroImg : `/${cases[0].heroImg}`);
const galleryOgImage = `${BASE_URL}${galleryHeroSrc}`;

export const metadata: Metadata = {
  title: 'Work | HandToMouse',
  description: 'Selected studio work from HandToMouse: 19 cases across hospitality, sport, finance, retail, and motorsport.',
  openGraph: {
    title: 'Work | HandToMouse',
    description: 'Selected studio work from HandToMouse: 19 cases across hospitality, sport, finance, retail, and motorsport.',
    images: [galleryOgImage],
    type: 'website',
    url: `${BASE_URL}/work`,
    siteName: 'HandToMouse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work | HandToMouse',
    description: 'Selected studio work from HandToMouse: 19 cases across hospitality, sport, finance, retail, and motorsport.',
    images: [galleryOgImage],
  },
  alternates: { canonical: `${BASE_URL}/work` },
};

export default function WorkPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HandToMouse Selected Work',
    numberOfItems: cases.length,
    itemListElement: cases.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.t,
      url: `${BASE_URL}/work/${c.k}`,
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` },
    ],
  };
  return (
    <section className="gallery" id="gallery">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="gallery-head">
        <span className="eyebrow">HTM · Selected Work · 2020 to present</span>
        {/* Countless wording: the canonical said Seventeen, the port said Nineteen;
            the caseref line below already carries the live count via cases.length */}
        <h2>Real <em>brands</em>. Built end-to-end.</h2>
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

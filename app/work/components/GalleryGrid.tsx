// app/work/components/GalleryGrid.tsx
// Server Component renders all 19 tiles.
// Class names match portfolio.css: .gallery-grid, .gallery-tile, .thumb, .meta,
// .tile-num, .tile-title, .tile-tag, .tile-cta
// The sector filter (SectorFilter parent) toggles CSS visibility via data-sector attribute.
// Plain <img> per locked default #6.
import Link from 'next/link';
import type { GalleryGridProps } from './types';

function getSector(m: unknown[]): string {
  if (!Array.isArray(m)) return '';
  const entry = m.find((row): row is [string, string] => Array.isArray(row) && row[0] === 'Sector');
  return entry ? String(entry[1]) : '';
}

export default function GalleryGrid({ cases }: GalleryGridProps) {
  return (
    <div className="gallery-grid" id="galleryGrid">
      {cases.map((c) => {
        const sector = getSector(c.m as unknown[]);
        const sectorLower = sector.toLowerCase();
        return (
          <Link
            key={c.k}
            href={`/work/${c.k}`}
            className="gallery-tile"
            data-sector={sectorLower}
            aria-label={`Open case ${c.n}, ${c.t}`}
          >
            {/* .thumb uses background-image per canonical tile builder */}
            <div
              className="thumb"
              style={{ backgroundImage: c.heroImg ? `url('${c.heroImg}')` : undefined }}
              aria-hidden="true"
            />
            <div className="meta">
              <span className="tile-num">/CASE-STUDY/{c.n}</span>
              <span className="tile-title">{c.t}</span>
              {sector && <span className="tile-tag">{sector}</span>}
            </div>
            <span className="tile-cta" aria-hidden="true">&#8594; Open case file</span>
          </Link>
        );
      })}
    </div>
  );
}

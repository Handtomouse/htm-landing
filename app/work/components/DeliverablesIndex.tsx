// app/work/components/DeliverablesIndex.tsx
// POLISH-02: deliverables index with hover thumb + click-to-imagery-section.
// Round 2 scope per HANDOFF.md: heroImg as universal hover-thumb fallback.
// Specific-artboard mapping is deferred (content task, per-case).
// Server Component: CSS handles hover behavior (no client JS needed for pointer-fine reveal).
import type { DeliverablesIndexProps } from './types';

export default function DeliverablesIndex({ deliverables, heroImg, caseSlug }: DeliverablesIndexProps) {
  if (!Array.isArray(deliverables) || deliverables.length === 0) return null;

  return (
    <section className="deliverables-section" aria-labelledby={`deliverables-${caseSlug}`}>
      <h2 id={`deliverables-${caseSlug}`} className="deliverables-heading">Deliverables</h2>
      <ol className="ddeliverables ddeliverables-polished">
        {deliverables.map((d, i) => (
          <li key={`${caseSlug}-${i}`} className="deliverable-row">
            <a href="#imagery" className="deliverable-link">
              <span className="deliverable-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="deliverable-name">{d}</span>
              {/* POLISH-02: trailing arrow glyph signals interactivity */}
              <span className="deliverable-arrow" aria-hidden="true">{'↗'}</span>
              {/* POLISH-02: 96x96 hover thumb, heroImg as fallback */}
              <img
                src={heroImg}
                alt=""
                aria-hidden="true"
                className="deliverable-thumb"
                loading="lazy"
              />
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

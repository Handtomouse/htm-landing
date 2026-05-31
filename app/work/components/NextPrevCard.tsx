// app/work/components/NextPrevCard.tsx
// Server Component: whats-next card.
// Parent (CaseDetail) controls conditional render -- POLISH-03: only rendered when case exists.
// Class names match portfolio.css: .next-card.prev-case / .next-card.next-case,
// .next-eyebrow, .next-num, .next-title, .next-sector
// --next-hero CSS var drives the ::before background-image overlay.
import Link from 'next/link';
import type { NextPrevCardProps } from './types';

function getSector(m: unknown[]): string {
  if (!Array.isArray(m)) return '';
  const entry = m.find((row): row is [string, string] => Array.isArray(row) && row[0] === 'Sector');
  return entry ? String(entry[1]) : '';
}

export default function NextPrevCard({ direction, case: c }: NextPrevCardProps) {
  const isPrev = direction === 'prev';
  const cardClass = isPrev ? 'next-card prev-case' : 'next-card next-case';
  const sector = getSector(c.m as unknown[]);

  return (
    <Link
      href={`/work/${c.k}`}
      className={cardClass}
      style={{ '--next-hero': `url('${c.heroImg}')` } as React.CSSProperties}
    >
      <span className="next-eyebrow">
        {isPrev && <span className="hand-pixel left" aria-hidden="true"></span>}
        {isPrev ? 'Previous case' : 'Next case'}
        {!isPrev && <span className="hand-pixel" aria-hidden="true"></span>}
      </span>
      <span className="next-num">{c.n}</span>
      <span className="next-title">{c.t}</span>
      {sector && <span className="next-sector">{sector}</span>}
    </Link>
  );
}

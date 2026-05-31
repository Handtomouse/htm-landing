'use client';
// app/work/components/SectorFilter.tsx
// Client Component: sector filter chip row + gallery grid wrapper.
// Class names match portfolio.css: .sector-filter, .sector-filter-label,
// .sector-chips, button.active
// data-sector-active on wrapper uses lowercase keys matching .gallery-tile[data-sector].
// Sector label (display) uses original case; key (matching) uses lowercase.
import { useMemo, useState } from 'react';
import type { SectorFilterProps } from './types';

function getSector(m: unknown[]): string {
  if (!Array.isArray(m)) return '';
  const entry = m.find((row): row is [string, string] => Array.isArray(row) && row[0] === 'Sector');
  return entry ? String(entry[1]) : '';
}

export default function SectorFilter({ cases, children }: SectorFilterProps) {
  // sectors: array of { key: lowercase, label: original-case }
  // key is used for data-sector-active (CSS matching); label is display text on chip
  const sectors = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ key: string; label: string }> = [{ key: 'all', label: 'All' }];
    for (const c of cases) {
      const label = getSector(c.m as unknown[]);
      if (label) {
        const key = label.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          list.push({ key, label });
        }
      }
    }
    return list;
  }, [cases]);

  const [active, setActive] = useState<string>('all');

  return (
    <>
      <section className="sector-filter" aria-labelledby="sectorFilterLabel">
        <span className="sector-filter-label" id="sectorFilterLabel">Filter &middot; by sector</span>
        <nav className="sector-chips" id="sectorChips" aria-label="Filter cases by sector">
          {sectors.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={active === key ? 'active' : undefined}
              aria-pressed={active === key}
              onClick={() => setActive(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </section>
      {/* data-sector-active drives CSS hide/show of .gallery-tile[data-sector] */}
      <div className="gallery-grid-wrap" data-sector-active={active}>
        {children}
      </div>
    </>
  );
}

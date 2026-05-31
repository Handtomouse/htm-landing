'use client';
// app/work/components/SectorFilter.tsx
// Client Component: filter chip state. Full implementation in Task 2.
// Per Pitfall 3: needs useState for active sector.
import type { SectorFilterProps } from './types';

export default function SectorFilter({ children }: SectorFilterProps) {
  return (
    <div className="sector-filter-wrap">
      {/* TODO Task 2 */}
      {children}
    </div>
  );
}

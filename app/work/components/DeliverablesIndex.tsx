// STUB -- overwritten by Plan 05.
// Basic ordered list render. Plan 05 replaces with hover-thumbnail + icon version (POLISH-02).
import type { DeliverablesIndexProps } from './types';

export default function DeliverablesIndex({ deliverables }: DeliverablesIndexProps) {
  return (
    <ol className="deliv-grid">
      {deliverables.map((d, i) => (
        <li key={d}>
          <span className="deliv-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="deliv-name">{d}</span>
        </li>
      ))}
    </ol>
  );
}

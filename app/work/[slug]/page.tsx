// app/work/[slug]/page.tsx
// Per-case route. Statically pre-rendered at build time for all 19 slugs.
// Pitfall 7: params is Promise<> in Next 15 -- must await before destructuring.
import { cases, getCaseBySlug, getPrevCase, getNextCase } from '@/lib/cases';
import { notFound } from 'next/navigation';
import CaseDetail from '../components/CaseDetail';

// 404 for any slug not in cases.json
export const dynamicParams = false;

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.k }));
}

export default async function CasePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();
  const prevCase = getPrevCase(slug);
  const nextCase = getNextCase(slug);
  // Pass cases.length as total so the case-num header renders "03 / 19" (not "03 / 03" tautology).
  return (
    <CaseDetail
      case={c}
      total={cases.length}
      prevCase={prevCase}
      nextCase={nextCase}
    />
  );
}

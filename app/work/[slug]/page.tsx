// app/work/[slug]/page.tsx
// Per-case route. Statically pre-rendered at build time for all 19 slugs.
// Pitfall 7: params is Promise<> in Next 15 -- must await before destructuring.
import type { Metadata } from 'next';
import { cases, getCaseBySlug, getPrevCase, getNextCase } from '@/lib/cases';
import { notFound } from 'next/navigation';
import CaseDetail from '../components/CaseDetail';

// 404 for any slug not in cases.json
export const dynamicParams = false;

const BASE_URL = 'https://handtomouse.org';

// Em-dash safety strip (META-01 + PROJECT.md constraint):
// OG metadata is user-facing (renders in iMessage / LinkedIn / Twitter previews).
// Uses unicode escapes so no literal em/en dash character appears in source.
const sanitize = (s: string) => s.replace(/[\u2014\u2013]/g, ' ');

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.k }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  const title = `${c.t} | HandToMouse Portfolio`;
  const description = sanitize(c.o || `${c.t}: selected studio work from HandToMouse.`).slice(0, 200);
  // OG stays JPEG (og.jpg emitted per case): social crawlers are unreliable
  // with WebP, which is what heroImg now points at
  const ogImage = `${BASE_URL}/work/${c.k}/og.jpg`;
  const canonical = `${BASE_URL}/work/${c.k}`;
  return {
    title,
    description,
    openGraph: {
      title: c.t,
      description,
      images: [ogImage],
      type: 'article',
      url: canonical,
      siteName: 'HandToMouse',
    },
    twitter: {
      card: 'summary_large_image',
      title: c.t,
      description,
      images: [ogImage],
    },
    alternates: { canonical },
  };
}

export default async function CasePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();
  const prevCase = getPrevCase(slug);
  const nextCase = getNextCase(slug);

  // Structured data: case pages are the site's richest indexable content
  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: c.t,
    description: sanitize(c.o || ''),
    url: `${BASE_URL}/work/${c.k}`,
    image: `${BASE_URL}/work/${c.k}/og.jpg`,
    creator: {
      '@type': 'Organization',
      name: 'Hand To Mouse',
      url: BASE_URL,
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` },
      { '@type': 'ListItem', position: 3, name: c.t, item: `${BASE_URL}/work/${c.k}` },
    ],
  };

  // Pass cases.length as total so the case-num header renders "03 / 19" (not "03 / 03" tautology).
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CaseDetail
        case={c}
        total={cases.length}
        prevCase={prevCase}
        nextCase={nextCase}
      />
    </>
  );
}

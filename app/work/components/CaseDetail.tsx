// app/work/components/CaseDetail.tsx
// Server Component: case-detail layout.
// Class names match portfolio.css: .cover, .readout, .case-num, .case-mark, .case-title,
// .case-outcome, .detail, .section, .chapter-strip, .chap-tab, .testimonial,
// .next-grid, .next-card, .cta-row, .cta
// CasePlayer (client) + NextPrevCard (server) + Testimonial + DeliverablesIndex are imported below.
// Testimonial + DeliverablesIndex are Plan 05 stubs until overwritten.
import CasePlayer from './CasePlayer';
import NextPrevCard from './NextPrevCard';
import Testimonial from './Testimonial';
import DeliverablesIndex from './DeliverablesIndex';
import Link from 'next/link';
import type { CaseDetailProps } from './types';

function getSector(m: unknown[]): string {
  if (!Array.isArray(m)) return '';
  const entry = m.find((row): row is [string, string] => Array.isArray(row) && row[0] === 'Sector');
  return entry ? String(entry[1]) : '';
}

function getRole(m: unknown[]): string {
  if (!Array.isArray(m)) return '';
  const entry = m.find((row): row is [string, string] => Array.isArray(row) && row[0] === 'Role');
  return entry ? String(entry[1]) : '';
}

function getYear(m: unknown[]): string {
  if (!Array.isArray(m)) return '';
  const entry = m.find((row): row is [string, string] => Array.isArray(row) && row[0] === 'Year');
  return entry ? String(entry[1]) : '';
}

export default function CaseDetail({ case: c, total, prevCase, nextCase }: CaseDetailProps) {
  // Case-num header: "{c.n} / {total zero-padded}" e.g. "03 / 19"
  // total comes from cases.length in the route; c.n is the case's own ordinal.
  // NEVER render c.n / c.n -- that is the "03 / 03" tautology.
  const totalLabel = String(total).padStart(2, '0');
  const sector = getSector(c.m as unknown[]);
  const role = getRole(c.m as unknown[]);
  const year = getYear(c.m as unknown[]);

  // Chapter numbering is sequential over the sections actually present for THIS
  // case, so it never shows gaps like 01, 02, 06, 07. The canonical used a fixed
  // 7-chapter scheme (solutions/palette/testimonial sat at 03-05) that this build
  // does not all render; numbering off render order keeps it 01, 02, 03, 04.
  const hasImages = Array.isArray(c.images) && c.images.length > 0;
  const hasDeliverables = Array.isArray(c.deliverables) && c.deliverables.length > 0;
  // Solutions + stats + palette come from the canonical's fixed 7-chapter
  // scheme; the data has been in cases.json all along, now rendered.
  const solutions = (Array.isArray(c.solutions) ? c.solutions : []).filter(
    (s): s is string => typeof s === 'string' && s.length > 0
  );
  type Stat = { v: string | number; s?: string; l: string };
  const stats = (Array.isArray(c.stats) ? c.stats : []).filter(
    (s): s is Stat => !!s && typeof s === 'object' && 'v' in (s as object) && 'l' in (s as object)
  );
  const palette = (Array.isArray(c.palette) ? c.palette : []).filter(
    (p) => Array.isArray(p) && p.length === 2
  );
  const chapters = [
    c.challenge ? { id: 'challenge', href: '#challenge', label: 'Challenge' } : null,
    hasImages ? { id: 'imagery', href: '#imagery', label: 'Artboards' } : null,
    solutions.length > 0 ? { id: 'solutions', href: '#solutions', label: 'Solutions' } : null,
    palette.length > 0 ? { id: 'palette', href: '#palette', label: 'System' } : null,
    hasDeliverables ? { id: 'deliverables', href: '#deliverables', label: 'Index' } : null,
    { id: 'whatsnext', href: '#whatsnext', label: 'Next' },
  ].filter((x): x is { id: string; href: string; label: string } => x !== null);
  const chapNum = (id: string) =>
    String(chapters.findIndex((ch) => ch.id === id) + 1).padStart(2, '0');

  return (
    <main id="top" className="case-section">
      {/* COVER: hero image + readout panel */}
      <section className="cover" data-section="cover">
        <section className="case-file" aria-label="Case file image">
          {/* case-file-img uses background-image per canonical */}
          <div
            className="case-file-img has-bg"
            style={{ backgroundImage: `url('${c.heroImg}')` }}
            aria-hidden="true"
          />
          <span className="file-tag">
            <span className="dot" aria-hidden="true"></span>
            CASE FILE :: {c.n}/{totalLabel}
          </span>
        </section>

        <section className="readout">
          <div className="term-line">
            <span className="prompt">htm@portfolio:~$</span> cat {c.k}
          </div>
          <div className="case-num">{c.n} / {totalLabel}</div>
          <div className={`case-mark style-${c.k}`}>{c.t}</div>
          <h1 className="case-title">{c.t}</h1>
          <div className="hr"></div>
          {c.o && <p className="case-outcome">{c.o}</p>}
          {c.l && <p className="case-lesson">{c.l}</p>}
          <div className="hr"></div>
          <div className="case-meta">
            {year && <><span className="k">Year</span><span className="v">{year}</span></>}
            {sector && <><span className="k">Sector</span><span className="v">{sector}</span></>}
            {role && <><span className="k">Role</span><span className="v">{role}</span></>}
          </div>
          {Array.isArray(c.images) && c.images.length > 0 && (
            <a className="open-case" href="#imagery">
              <span>Jump to artboards</span>
              <span className="hand-pixel" aria-hidden="true"></span>
            </a>
          )}
        </section>
      </section>

      {/* DETAIL: sectioned content */}
      <section className="detail">
        {/* Chapter strip navigation */}
        <nav className="chapter-strip" aria-label="Case sections">
          {chapters.map((ch) => (
            <a key={ch.id} className="chap-tab" href={ch.href} data-section={ch.id}>
              <span className="chap-icon" aria-hidden="true"></span>
              <span className="chap-num">{chapNum(ch.id)}</span>
              <span className="chap-lbl">{ch.label}</span>
            </a>
          ))}
        </nav>

        {/* Challenge section */}
        {c.challenge && (
          <div className="section" id="challenge" data-section="Challenge" data-num={chapNum('challenge')}>
            <span className="spine" aria-hidden="true">
              <span className="spine-icon"></span>
              <em className="spine-num">{chapNum('challenge')}</em>
              <span className="spine-lbl">Challenge</span>
            </span>
            <h2>Challenge</h2>
            <div className="section-body">
              <p className="lead-p">{c.challenge}</p>
            </div>
          </div>
        )}

        {/* Imagery / artboards player */}
        {Array.isArray(c.images) && c.images.length > 0 && (
          <div className="section" id="imagery" data-section="Artboards" data-num={chapNum('imagery')}>
            <span className="spine" aria-hidden="true">
              <span className="spine-icon"></span>
              <em className="spine-num">{chapNum('imagery')}</em>
              <span className="spine-lbl">Artboards</span>
            </span>
            <h2>Artboards &middot; selected work</h2>
            <div className="section-body">
              <CasePlayer images={c.images} alt={c.t} />
            </div>
          </div>
        )}

        {/* Solutions + results in numbers (canonical chapter 03) */}
        {solutions.length > 0 && (
          <div className="section" id="solutions" data-section="Solutions" data-num={chapNum('solutions')}>
            <span className="spine" aria-hidden="true">
              <span className="spine-icon"></span>
              <em className="spine-num">{chapNum('solutions')}</em>
              <span className="spine-lbl">Solutions</span>
            </span>
            <h2>Solutions</h2>
            <div className={stats.length > 0 ? 'section-body two-col' : 'section-body'}>
              <div>
                <ul>
                  {solutions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              {stats.length > 0 && (
                <div>
                  <h3 style={{ marginTop: 0 }}>Results &middot; in numbers</h3>
                  <div className="stats">
                    {stats.map((s, i) => (
                      <div className="stat" key={i}>
                        <div className="num">
                          <em>{s.v}</em>
                          {s.s && <span className="suf">{s.s}</span>}
                        </div>
                        <div className="label">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Brand system palette (canonical chapter 04) */}
        {palette.length > 0 && (
          <div className="section" id="palette" data-section="Palette" data-num={chapNum('palette')}>
            <span className="spine" aria-hidden="true">
              <span className="spine-icon"></span>
              <em className="spine-num">{chapNum('palette')}</em>
              <span className="spine-lbl">System</span>
            </span>
            <h2>Brand system</h2>
            <div className="section-body">
              <div className="subhead">Palette</div>
              <div className="palette-grid">
                {palette.map(([name, hex], idx) => (
                  <div
                    className="swatch-card"
                    key={idx}
                    title={`${name} · ${String(hex).toUpperCase()}`}
                  >
                    <div className="chip" style={{ background: hex }}>
                      <span className="chip-num">/{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="meta">
                      <span className="name">{name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deliverables index (Plan 05 stub until overwritten) */}
        {Array.isArray(c.deliverables) && c.deliverables.length > 0 && (
          <div className="section" id="deliverables" data-section="Deliverables" data-num={chapNum('deliverables')}>
            <span className="spine" aria-hidden="true">
              <span className="spine-icon"></span>
              <em className="spine-num">{chapNum('deliverables')}</em>
              <span className="spine-lbl">Index</span>
            </span>
            <h2>Deliverables &middot; index</h2>
            <div className="section-body">
              <DeliverablesIndex
                deliverables={c.deliverables}
                heroImg={c.heroImg}
                caseSlug={c.k}
              />
            </div>
          </div>
        )}

        {/* Testimonial (Plan 05 stub; renders null when testimonial absent or a is empty) */}
        <Testimonial testimonial={c.testimonial} />

        {/* What's next */}
        <div className="section" id="whatsnext" data-section="Next" data-num={chapNum('whatsnext')}>
          <span className="spine" aria-hidden="true">
            <span className="spine-icon"></span>
            <em className="spine-num">{chapNum('whatsnext')}</em>
            <span className="spine-lbl">Next</span>
          </span>
          <h2>What&apos;s next</h2>
          <div className="section-body">
            {/* POLISH-03: only render NextPrevCard if the case exists -- no greyed-out dead cards */}
            {(prevCase || nextCase) && (
              <div className="next-grid">
                {prevCase && <NextPrevCard direction="prev" case={prevCase} />}
                {nextCase && <NextPrevCard direction="next" case={nextCase} />}
              </div>
            )}
            <div className="cta-row">
              <Link href="/work" className="cta cta-primary">
                <span>See all {total} cases</span>
                <span className="hand-pixel" aria-hidden="true"></span>
              </Link>
              <a className="cta cta-secondary" href="mailto:hello@handtomouse.org?subject=New%20project%20enquiry">
                <span>Start a project</span>
                <span className="hand-pixel" aria-hidden="true"></span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

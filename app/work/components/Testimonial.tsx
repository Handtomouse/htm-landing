// app/work/components/Testimonial.tsx
// POLISH-01: testimonial scale + serif glyph + amber rule.
// DATA-03: render null if testimonial absent OR author empty (no fabricated content).
// The 6 cases with real quotes (per research): swich, fishbowl, sbts, maplemoon, ferrari, troodpratt.
// The 13 without get a clean absence -- no empty box, no TODO placeholder.
import type { TestimonialProps } from './types';

export default function Testimonial({ testimonial }: TestimonialProps) {
  // DATA-03 graceful absence: render nothing for cases without an attributed quote.
  if (!testimonial || !testimonial.q || !testimonial.a || testimonial.a.trim() === '') {
    return null;
  }

  const { q, a } = testimonial;

  return (
    <figure className="testimonial testimonial-polished" data-has-quote="true">
      {/* POLISH-01: 120px serif quote-glyph at 15% opacity, top-left to avoid data-num at right:4% */}
      <span className="testimonial-glyph" aria-hidden="true">{'"'}</span>
      <blockquote className="testimonial-quote">
        {/* Scale: 28-32px, line-height 1.3, max-width 28ch (set via portfolio.css below) */}
        {q}
      </blockquote>
      {/* POLISH-01: 1px amber rule above attribution */}
      <hr className="testimonial-rule" aria-hidden="true" />
      <figcaption className="testimonial-author">{a}</figcaption>
    </figure>
  );
}

// app/work/layout.tsx
// Scoping wrapper for the portfolio sub-app.
// - imports portfolio.css (route-segment CSS, auto code-split out of other routes)
// - applies .htm-portfolio class to a wrapping div so canonical CSS vars stay scoped
// - exposes next/font variables on the same wrapper so font-family lookups resolve
import './portfolio.css';
import { inter, vt323, geistMono } from './fonts';

// Argent Pixel CF (italic display lockups) loads via the Adobe Fonts web project
// "HTM Portfolio" under Creative Cloud. CSS family is "argent-pixel-cf" (matches
// --font-display in portfolio.css, VT323 fallback). React hoists this stylesheet
// link to <head> and dedupes it via the precedence prop.
const ADOBE_FONTS_KIT = 'https://use.typekit.net/isk4jau.css';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${inter.variable} ${vt323.variable} ${geistMono.variable}`;
  return (
    <>
      <link rel="stylesheet" href={ADOBE_FONTS_KIT} precedence="default" />
      <div className={`htm-portfolio ${fontVars}`}>
        {children}
      </div>
    </>
  );
}

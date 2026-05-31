// app/work/layout.tsx
// Scoping wrapper for the portfolio sub-app.
// - imports portfolio.css (route-segment CSS, auto code-split out of other routes)
// - applies .htm-portfolio class to a wrapping div so canonical CSS vars stay scoped
// - exposes next/font variables on the same wrapper so font-family lookups resolve
import './portfolio.css';
import { inter, vt323, geistMono } from './fonts';

// TODO(adobe-fonts-kit): insert Argent Pixel CF web kit before Wave 5 deploy:
//     <link rel="stylesheet" href="https://use.typekit.net/KITID.css" />
//     Confirm the Adobe-assigned CSS font-family name matches the value used in portfolio.css.
// When the kit ID is available, add it to app/work/layout.tsx in the <head> via
// a Next.js <Head> wrapper or by placing a <link> in the returned JSX above the wrapper div.

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${inter.variable} ${vt323.variable} ${geistMono.variable}`;
  return (
    <div className={`htm-portfolio ${fontVars}`}>
      {children}
    </div>
  );
}

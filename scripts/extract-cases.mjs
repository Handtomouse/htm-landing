// scripts/extract-cases.mjs
// One-shot extraction of the cases array from the canonical mockup.
// Per Plan 01-02 locked default #1: vm.runInNewContext sandboxed eval.
// Never regex -- canonical contains escaped quotes (S\'WICH, "It's", Women's).
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import os from 'node:os';

const CANONICAL = path.join(
  os.homedir(),
  'UFC/spins/htm_v2_5round_loop_20260517/mockups/04_portfolio_v2.html'
);
const OUTPUT = 'lib/cases.json';

const html = fs.readFileSync(CANONICAL, 'utf8');
const start = html.indexOf('const cases = [');
if (start < 0) throw new Error('cases array not found in canonical');
const arrayStart = html.indexOf('[', start);

// Walk braces to find the matching close, respecting strings + escapes.
let depth = 0, inStr = false, strChar = '', escaped = false, end = -1;
for (let i = arrayStart; i < html.length; i++) {
  const ch = html[i];
  if (escaped) { escaped = false; continue; }
  if (ch === '\\') { escaped = true; continue; }
  if (inStr) { if (ch === strChar) inStr = false; continue; }
  if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strChar = ch; continue; }
  if (ch === '[') depth++;
  else if (ch === ']') { depth--; if (depth === 0) { end = i + 1; break; } }
}
if (end < 0) throw new Error('matching ] not found');
const literal = html.slice(arrayStart, end);

const cases = vm.runInNewContext('(' + literal + ')', {});
if (!Array.isArray(cases)) throw new Error('eval did not return an array');
if (cases.length !== 19) throw new Error(`expected 19 cases, got ${cases.length}`);

// Rewrite asset paths: assets/<slug>/... -> /work/<slug>/...
const rewrite = (p) => (typeof p === 'string' ? p.replace(/^assets\//, '/work/') : p);
for (const c of cases) {
  if (c.heroImg) c.heroImg = rewrite(c.heroImg);
  if (Array.isArray(c.images)) for (const im of c.images) im.src = rewrite(im.src);
}

const jsonOut = JSON.stringify(cases, null, 2);
if (jsonOut.length < literal.length * 0.5) {
  throw new Error(`Output suspiciously small: ${jsonOut.length} vs input ${literal.length}`);
}

fs.writeFileSync(OUTPUT, jsonOut);
console.log(`Extracted ${cases.length} cases, ${jsonOut.length} bytes -> ${OUTPUT}`);

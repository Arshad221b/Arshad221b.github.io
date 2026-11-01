// Checks every stylesheet against the design standard (DESIGN.md): any raw
// size, spacing, radius, layer, speed or breakpoint that bypasses the tokens
// in src/styles/global.css is reported, and the check fails.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(astro|css)$/.test(name)) files.push(p);
  }
})('src');

const BREAKPOINTS = new Set([480, 481, 600, 601, 759, 760, 761, 1099, 1100, 1101, 1239, 1240]);
const SPACING = /^(margin|padding|gap|row-gap|column-gap)(-|$)/;

// What each property may hold besides a token.
const ok = {
  'font-size': v => /TOKEN|^\d*\.?\d+em$|^inherit$|^(\d*\.?\d+)vw$/.test(v),
  'font-weight': v => /TOKEN|^(normal|inherit|bold)$/.test(v),
  'line-height': v => /TOKEN|^(normal|inherit|0)$/.test(v),
  'letter-spacing': v => /TOKEN|^(normal|inherit|0)$/.test(v),
  'border-radius': v => v.split(/\s+/).every(p => /^TOKEN$|^0$|^50%$|^inherit$/.test(p)),
  'z-index': v => /TOKEN|^-?[0-3]$|^auto$/.test(v),
};

let problems = 0;
for (const f of files) {
  let src = readFileSync(f, 'utf8');
  const blocks = f.endsWith('.css') ? [src] : [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
  for (const css of blocks) {
    const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of text.matchAll(/(?<![\w-])([a-z-]+)\s*:\s*([^;{}]+);/g)) {
      const prop = m[1], raw = m[2].replace(/\s*!important$/, '').trim();
      // A token, or a token's fallback, is fine: read past every var(...).
      let val = raw;
      while (/var\([^()]*\)/.test(val)) val = val.replace(/var\([^()]*\)/g, 'TOKEN');
      let bad = false;
      if (ok[prop]) bad = !ok[prop](val);
      else if (SPACING.test(prop)) bad = /(?<![\w.-])\d*\.?\d+(rem|px)/.test(val.replace(/(?<![\w.-])1px/g, '')) && !/vw|vh|%/.test(val);
      else if (prop === 'transition' || prop === 'transition-duration') {
        for (const d of val.matchAll(/(?<![\w.-])(\d*\.?\d+)(ms|s)(?![\w-])/g)) {
          const s = d[2] === 'ms' ? d[1] / 1000 : +d[1];
          if (s > 0 && s <= 0.5) bad = true;
        }
      }
      if (bad) { problems++; console.log(`${f}: ${prop}: ${raw}`); }
    }
    for (const m of text.matchAll(/\((?:max|min)-width:\s*(\d+)px\)/g)) {
      if (!BREAKPOINTS.has(+m[1])) { problems++; console.log(`${f}: breakpoint ${m[1]}px`); }
    }
  }
}
console.log(problems ? `\n${problems} value(s) outside the design standard (see DESIGN.md).` : 'All styles follow the design standard.');
process.exit(problems ? 1 : 0);

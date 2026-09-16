/* Tokenising, for the model built in thought-model.ts.
   Nothing here is clever. It is the boring half that decides whether the
   clever half has anything to work with. */

/* Function words, contraction fragments left over from "doesn't", and a
   short list of fillers. Deliberately no further than that: words like
   work, life, people, write and time are the subject matter here, not
   noise, and anything that genuinely is everywhere gets dropped later by
   the document-frequency ceiling rather than by my opinion of it. */
const STOP = new Set(`a about above after again against all am an and any are aren't as at be because been
before being below between both but by can cannot could couldn't did didn't do does doesn't doing don't down
during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's
hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's me
more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own
same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them
themselves then there there's these they they'd they'll they're they've this those through to too under until
up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while
who who's whom why why's with won't would wouldn't you you'd you'll you're you've your yours yourself
yourselves
just like get got also even still much many really thing things way ways lot lots maybe perhaps
actually basically literally bit quite rather pretty another every something someone anything nothing
everything always never often sometimes around almost already instead however therefore though although
yet within without upon toward towards etc okay yeah thus hence per via able enough
make makes made making take takes took taking come comes came coming go goes going went
put puts let lets
doesn isn wasn aren couldn wouldn shouldn didn don won hasn haven ain shan mustn
`.split(/\s+/));

/* A deliberately light stemmer. Full Porter over-stems on prose like this
   ("relativity" -> "relat"), and every stem it mangles is a stem that later
   turns up as the name of a topic. This only collapses the endings that
   genuinely split one idea across two vocabulary entries, and the page
   never prints a stem anyway: surfaceOf() maps it back to the commonest
   spelling it was actually written in. */
export function stem(w: string): string {
  if (w.length <= 4) return w;
  if (w.endsWith('iness') && w.length >= 7) return w.slice(0, -5) + 'y';   // happiness -> happy
  if (w.endsWith('ies') && w.length >= 5) return w.slice(0, -3) + 'y';     // stories -> story
  if (w.endsWith('ness') && w.length >= 7) return w.slice(0, -4);
  if (w.endsWith('ement') && w.length >= 8) return w.slice(0, -5);

  if (w.endsWith('ing') && w.length >= 6) return undouble(w.slice(0, -3));
  if (w.endsWith('ed') && w.length >= 5) return undouble(w.slice(0, -2));

  // Only the endings that genuinely take -es take -es off; everything else
  // is a plain plural. This is what turned "becomes" into "becom".
  if (w.endsWith('es') && w.length >= 5 && /(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && w.length >= 5) return w.slice(0, -1);
  return w;
}

/* "running" -> "run", but a stripped stem that no longer looks like a word
   is left alone rather than guessed at. */
function undouble(base: string): string {
  if (base.length < 3) return base;
  const a = base[base.length - 1], b = base[base.length - 2];
  if (a === b && !'aeiou'.includes(a)) base = base.slice(0, -1);
  if (base.length >= 3 && !/[aeiou]/.test(base.slice(-3))) return base + 'e';
  return base;
}

/* Curly apostrophes are the reason "doesn't" was arriving as the token
   "doesn": the tokeniser split on a character it did not recognise as part
   of a word. Everything is flattened to straight quotes first, and
   contracted endings come off before the word is looked at. */
function normalise(text: string): string {
  return text.toLowerCase()
    .replace(/[\u2018\u2019\u02bc\u2032]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, ' ')
    .replace(/'(s|t|re|ve|ll|d|m)\b/g, '');
}

/* Tokens are stems, but every stem remembers the spellings it came from so
   the page can print a word rather than a stump. */
const surfaces = new Map<string, Map<string, number>>();

export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const raw of normalise(text).match(/[a-z][a-z'-]{2,21}/g) ?? []) {
    const w = raw.replace(/[^a-z]/g, '');
    if (w.length < 3 || STOP.has(w)) continue;
    const s = stem(w);
    if (s.length < 3 || STOP.has(s)) continue;
    let seen = surfaces.get(s);
    if (!seen) surfaces.set(s, (seen = new Map()));
    seen.set(w, (seen.get(w) ?? 0) + 1);
    out.push(s);
  }
  return out;
}

/* The commonest spelling a stem was actually written in. */
export function surfaceOf(stemmed: string): string {
  const seen = surfaces.get(stemmed);
  if (!seen) return stemmed;
  let best = stemmed, n = -1;
  seen.forEach((count, word) => { if (count > n) { n = count; best = word; } });
  return best;
}

/* The prose out of one essay's source: frontmatter, the component wrapper,
   code and markup all dropped, entities unescaped. */
export function proseOf(raw: string): string {
  let s = raw.replace(/^---[\s\S]*?---/, '');
  s = s.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&(?:nbsp|#160);/g, ' ')
       .replace(/&(?:amp|#38);/g, '&')
       .replace(/&(?:quot|#34);/g, '"')
       .replace(/&(?:#39|apos|rsquo|lsquo);/g, "'")
       .replace(/&(?:lt|#60);/g, '<')
       .replace(/&(?:gt|#62);/g, '>');
  return s.replace(/\s+/g, ' ').trim();
}

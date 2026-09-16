/* ── Where the Thoughts page gets everything ─────────────────────────
   There is no list of essays to keep up to date. An essay is a file in
   src/pages/thoughts, and this reads the files: the title, date and
   standfirst it already declares to ThoughtPost, its first picture, and
   its full prose. Drop a new .astro in that folder and it turns up in the
   ledger, gets embedded, gets its topics, joins the map and becomes
   searchable, without anything here being edited.

   A post may optionally declare tags={[...]} and they will be folded into
   its text as extra signal, but nothing requires them. The themes on the
   page are fitted, not typed.                                          */

import { proseOf } from './text';
import { buildThoughtModel, type Doc } from './thought-model';

const sources = import.meta.glob('../pages/thoughts/*.astro', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

function prop(raw: string, name: string): string {
  const m = raw.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|\\{\`([^\`]*)\`\\})`));
  return (m?.[1] ?? m?.[2] ?? m?.[3] ?? '').trim();
}

function unescape(s: string): string {
  return s.replace(/&(?:amp|#38);/g, '&').replace(/&(?:quot|#34);/g, '"')
          .replace(/&(?:#39|apos);/g, "'").replace(/&(?:lt|#60);/g, '<')
          .replace(/&(?:gt|#62);/g, '>');
}

export type Post = {
  slug: string; title: string; date: string; description: string;
  tags: string[]; thumb?: string; plate?: string; text: string; words: number;
};

const collected: Post[] = [];

for (const [path, raw] of Object.entries(sources)) {
  const slug = path.split('/').pop()!.replace('.astro', '');
  if (!slug) continue;
  const title = unescape(prop(raw, 'title'));
  const date = prop(raw, 'date');
  // A file with no title or no date is a stub, not a published essay.
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

  const tagBlock = raw.match(/\btags=\{(\[[\s\S]*?\])\}/)?.[1] ?? '';
  const tags = [...tagBlock.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);

  /* Thumbnails point straight at Cloudinary with the resize in the URL, so
     nothing is copied into this repository. Two sizes: one for the line in
     the ledger, one for the picture that lifts off it. */
  const img = raw.match(/https:\/\/res\.cloudinary\.com\/[^"']+/)?.[0];
  const prose = proseOf(raw);

  collected.push({
    slug, title, date,
    description: unescape(prop(raw, 'description')),
    tags,
    thumb: img?.replace('/upload/', '/upload/w_300,h_200,c_fill,g_center,q_auto,f_auto/'),
    plate: img?.replace('/upload/', '/upload/w_720,h_480,c_fill,g_center,q_auto,f_auto/'),
    text: prose,
    words: (prose.match(/[A-Za-z'’]+/g) ?? []).length,
  });
}

collected.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const posts = collected;

/* Fitted once per build. Both the page and the search endpoint import this
   module, and Vite hands them the same instance, so the sampler runs once. */
const docs: Doc[] = posts.map(p => ({
  slug: p.slug,
  title: p.title,
  // Hand tags, where a post bothers to declare them, are just more words
  // about what it is. They are a nudge, never a requirement.
  description: [p.description, ...p.tags].join(' '),
  text: p.text,
}));

export const model = buildThoughtModel(docs);

/* What the page itself needs: small enough to inline. */
export const pageModel = {
  projection: model.projection,
  topics: model.topics,
  theta: model.theta,
  edges: model.edges,
  stats: model.stats,
};

/* What only a search needs: fetched on demand, never on first paint. */
export const searchModel = {
  dims: model.dims,
  vocab: model.vocab,
  termScale: model.termScale,
  termVectors: model.termVectors,
  docVectors: model.docVectors,
  postings: model.postings,
  rareIdf: model.rareIdf,
};

/* ── Nearest neighbours, for the foot of each essay ─────────────────
   The same latent space the map and the search are drawn from, asked a
   different question: given this essay, which others sit closest to it.
   Cosine, so what comes back is a ranking with a confidence attached
   rather than a list of things sharing a label. */
const byIdx = new Map(posts.map((p, i) => [p.slug, i]));

export function relatedTo(slug: string, count = 3) {
  const self = byIdx.get(slug);
  if (self === undefined) return [];
  const a = model.docVectors[self];
  return model.docVectors
    .map((b, i) => {
      if (i === self) return { i, sim: -1 };
      let s = 0;
      for (let j = 0; j < a.length; j++) s += a[j] * b[j];
      return { i, sim: s };
    })
    .filter(r => r.sim > 0.12)   // below this they are not actually alike
    .sort((x, y) => y.sim - x.sim)
    .slice(0, count)
    .map(r => ({ ...posts[r.i], sim: r.sim }));
}

/* What the model reads this essay as being about. */
export function topicsOf(slug: string, count = 2) {
  const i = byIdx.get(slug);
  if (i === undefined) return [];
  return model.theta[i]
    .map((p, k) => ({ p, label: model.topics[k].words.slice(0, 2).join(' · ') }))
    .sort((a, b) => b.p - a.p)
    .slice(0, count)
    .filter(t => t.p >= 0.1);
}

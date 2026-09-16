/* ── The model behind the Thoughts page ──────────────────────────────
   Everything here runs once, at build time, over the full text of every
   essay. What ships to the browser is the fitted model, not the corpus.

   Three things come out of it:

     · a latent space (truncated SVD of the tf-idf matrix — LSA), which is
       what makes search work on meaning rather than on matching letters;
     · topics (latent Dirichlet allocation, fitted by collapsed Gibbs
       sampling), which give every essay a distribution over themes
       instead of the handful of labels I typed by hand;
     · a nearest-neighbour graph in the latent space, which is what the
       map on the page is drawn from.

   Seventy-nine documents is a small corpus and I am not pretending
   otherwise. It is enough for this to be useful and not enough for it to
   be authoritative.                                                    */

import { tokenize, surfaceOf } from './text';

export type Doc = { slug: string; title: string; description: string; text: string };

const LATENT_DIMS = 24;   // rank of the truncated SVD
const TOPICS = 12;        // K
const GIBBS_ITERS = 260;
const ALPHA = 0.1;        // Dirichlet prior on topics per document, sparse
const BETA = 0.01;        // Dirichlet prior on words per topic, sparse
const MAX_TOKENS = 1500;  // per document, so the sampler stays quick
const MIN_DF = 2;         /* A query can only reach a term the model has
                             kept, so the floor is low on purpose: it is the
                             difference between "burnout" finding something
                             and finding nothing at all. */
/* Nearly all of it. One person writing seventy-nine essays in one voice
   uses "life", "people" and "brain" constantly, and those are the subject
   matter, not noise: a 45% ceiling threw "brain" out of the vocabulary
   entirely. Weighting common terms down is idf's job, and idf does it. */
const MAX_DF_RATIO = 0.92;
const RARE_DF = 8;        // below this a term is distinctive enough to index

/* The sampler needs a narrower vocabulary than search does. Search can
   afford every common word because idf weighs it down automatically; the
   sampler has no idf and counts raw occurrences, so leaving "know", "feel"
   and "people" in gets topics that are all four of those words and nothing
   else. These two bounds apply to the topic model alone. */
const TOPIC_MIN_DF = 3;
const TOPIC_MAX_DF_RATIO = 0.4;
/* Two, not three. At three the field came out as a mesh in which no
   structure was visible; at two the same clusters are still joined and
   there is paper left between them. */
const NEIGHBOURS = 2;

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Symmetric eigendecomposition by cyclic Jacobi rotations. The matrix is
   only (documents × documents), so this is cheap and exact and saves
   bringing in a linear algebra dependency for one call. */
function jacobiEigen(Min: number[][], sweeps = 60) {
  const n = Min.length;
  const A = Min.map(r => r.slice());
  const V: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

  for (let sweep = 0; sweep < sweeps; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-14) break;

    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-15) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p], akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k], aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p], vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  const order = A.map((_, i) => i).sort((a, b) => A[b][b] - A[a][a]);
  return {
    values: order.map(i => A[i][i]),
    vectors: order.map(i => V.map(row => row[i])),  // vectors[j][d]
  };
}

export function buildThoughtModel(docs: Doc[]) {
  const N = docs.length;

  /* ── Vocabulary and tf-idf ─────────────────────────────────────── */
  // The title and the standfirst are what the essay is announcing itself
  // to be about, so they are worth more than a sentence from the middle.
  const streams: string[][] = docs.map(d =>
    [...tokenize(d.title), ...tokenize(d.title), ...tokenize(d.title),
     ...tokenize(d.description), ...tokenize(d.description),
     ...tokenize(d.text)]);

  let df = new Map<string, number>();
  streams.forEach(toks => new Set(toks).forEach(t => df.set(t, (df.get(t) ?? 0) + 1)));

  /* Stripping -ing and -ed leaves a stem that has lost a silent e, so
     "changing" lands on "chang" while "change" stays whole and the corpus
     ends up holding one idea under two entries. Rather than guess the e
     back on inside the stemmer, merge the pair here, where both spellings
     are visible at once. */
  const canon = new Map<string, string>();
  for (const t of df.keys()) if (df.has(t + 'e')) canon.set(t, t + 'e');
  if (canon.size) {
    streams.forEach((toks, i) => { streams[i] = toks.map(t => canon.get(t) ?? t); });
    df = new Map();
    streams.forEach(toks => new Set(toks).forEach(t => df.set(t, (df.get(t) ?? 0) + 1)));
  }

  const vocab = [...df.entries()]
    .filter(([, n]) => n >= MIN_DF && n <= N * MAX_DF_RATIO)
    .map(([t]) => t)
    .sort();
  const termId = new Map(vocab.map((t, i) => [t, i]));
  const V = vocab.length;
  const idf = vocab.map(t => Math.log((N + 1) / (df.get(t)! + 0.5)));

  // A, documents by terms, sublinear tf, idf weighted, rows normalised.
  const A: Float64Array[] = streams.map(toks => {
    const row = new Float64Array(V);
    const tf = new Map<number, number>();
    toks.forEach(t => {
      const i = termId.get(t);
      if (i !== undefined) tf.set(i, (tf.get(i) ?? 0) + 1);
    });
    tf.forEach((n, i) => { row[i] = (1 + Math.log(n)) * idf[i]; });
    let norm = 0;
    for (let i = 0; i < V; i++) norm += row[i] * row[i];
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < V; i++) row[i] /= norm;
    return row;
  });

  /* ── Latent semantic space ─────────────────────────────────────────
     A ≈ W Σ Uᵀ. Because there are far fewer documents than terms, the
     cheap way in is the (documents × documents) Gram matrix: A Aᵀ = W Σ² Wᵀ.
     Eigendecompose that for W and Σ, then U = Aᵀ W Σ⁻¹.                */
  const gram: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let a = 0; a < N; a++) {
    for (let b = a; b < N; b++) {
      let s = 0;
      for (let i = 0; i < V; i++) s += A[a][i] * A[b][i];
      gram[a][b] = gram[b][a] = s;
    }
  }

  const { values, vectors } = jacobiEigen(gram);
  const K = Math.min(LATENT_DIMS, N - 1);
  const sigma = values.slice(0, K).map(v => Math.sqrt(Math.max(v, 0)));

  // U: terms × K. U[t][j] = (Σ_d A[d][t] · W[d][j]) / σ_j
  const U: Float64Array[] = Array.from({ length: V }, () => new Float64Array(K));
  for (let j = 0; j < K; j++) {
    const w = vectors[j];
    const inv = sigma[j] > 1e-9 ? 1 / sigma[j] : 0;
    for (let d = 0; d < N; d++) {
      const wd = w[d] * inv;
      if (!wd) continue;
      const row = A[d];
      for (let i = 0; i < V; i++) if (row[i]) U[i][j] += row[i] * wd;
    }
  }

  // A document's coordinates are σ ⊙ W[d], stored unit length so that a
  // cosine in the browser is one dot product.
  const docVecs = Array.from({ length: N }, (_, d) => {
    const v = new Float64Array(K);
    for (let j = 0; j < K; j++) v[j] = sigma[j] * vectors[j][d];
    let n = 0; for (let j = 0; j < K; j++) n += v[j] * v[j];
    n = Math.sqrt(n) || 1;
    return Array.from(v, x => x / n);
  });

  /* ── Topics, by collapsed Gibbs sampling ──────────────────────────── */
  const rand = mulberry32(20260917);
  const forTopics = vocab.map(t => {
    const n = df.get(t)!;
    return n >= TOPIC_MIN_DF && n <= N * TOPIC_MAX_DF_RATIO;
  });

  const docTokens = streams.map(toks => {
    const ids: number[] = [];
    for (const t of toks) {
      const i = termId.get(t);
      if (i !== undefined && forTopics[i]) ids.push(i);
      if (ids.length >= MAX_TOKENS) break;
    }
    return ids;
  });

  const nDK = Array.from({ length: N }, () => new Float64Array(TOPICS));
  const nKW = Array.from({ length: TOPICS }, () => new Float64Array(V));
  const nK = new Float64Array(TOPICS);
  const z: number[][] = docTokens.map(ids => ids.map(() => 0));

  docTokens.forEach((ids, d) => {
    ids.forEach((w, i) => {
      const k = Math.floor(rand() * TOPICS);
      z[d][i] = k; nDK[d][k]++; nKW[k][w]++; nK[k]++;
    });
  });

  const p = new Float64Array(TOPICS);
  const betaV = BETA * V;
  for (let it = 0; it < GIBBS_ITERS; it++) {
    for (let d = 0; d < N; d++) {
      const ids = docTokens[d], zs = z[d];
      for (let i = 0; i < ids.length; i++) {
        const w = ids[i], old = zs[i];
        nDK[d][old]--; nKW[old][w]--; nK[old]--;
        let total = 0;
        for (let k = 0; k < TOPICS; k++) {
          p[k] = (nDK[d][k] + ALPHA) * (nKW[k][w] + BETA) / (nK[k] + betaV);
          total += p[k];
        }
        let r = rand() * total, k = 0;
        while (k < TOPICS - 1 && (r -= p[k]) > 0) k++;
        zs[i] = k; nDK[d][k]++; nKW[k][w]++; nK[k]++;
      }
    }
  }

  // θ: what each essay is made of. This is the probabilistic part, and it
  // is what the page filters and sorts on.
  const theta = Array.from({ length: N }, (_, d) => {
    const total = nDK[d].reduce((s, x) => s + x, 0) + TOPICS * ALPHA;
    return Array.from(nDK[d], x => (x + ALPHA) / total);
  });

  /* A topic is named by the words that are far likelier inside it than in
     the corpus at large, which keeps the names specific instead of
     handing every topic the same few common words. */
  const topicVocab = forTopics.filter(Boolean).length;
  const wordTotal = new Float64Array(V);
  for (let k = 0; k < TOPICS; k++) for (let i = 0; i < V; i++) wordTotal[i] += nKW[k][i];
  const grandTotal = wordTotal.reduce((s, x) => s + x, 0) || 1;

  const topics = Array.from({ length: TOPICS }, (_, k) => {
    const denom = nK[k] + betaV;
    const scored = vocab.map((term, i) => {
      if (!forTopics[i]) return { term, weight: -Infinity };
      const pwk = (nKW[k][i] + BETA) / denom;
      const pw = (wordTotal[i] + 1) / grandTotal;
      return { term: surfaceOf(term), weight: pwk * Math.log(pwk / pw) };
    }).sort((a, b) => b.weight - a.weight);
    const mass = theta.reduce((s, t) => s + t[k], 0);
    return { words: scored.slice(0, 6).map(s => s.term), mass };
  });

  // Order topics by how much of the writing they actually account for.
  const topicOrder = topics.map((t, k) => ({ k, mass: t.mass }))
    .sort((a, b) => b.mass - a.mass).map(t => t.k);
  const orderedTopics = topicOrder.map(k => ({
    label: topics[k].words.slice(0, 3).join(' · '),
    words: topics[k].words,
  }));
  const orderedTheta = theta.map(row => topicOrder.map(k => row[k]));

  /* ── Where each essay sits on the page ──────────────────────────────
     A neighbour-preserving embedding (t-SNE), not a linear projection.

     Classical MDS was the obvious thing to reach for and it does not work
     on this: the first two principal directions of the latent space
     account for about an eighth of the variance, so flattening onto them
     throws away most of what distinguishes one essay from another and the
     result is a scatter with no visible grouping in it. t-SNE optimises
     something else entirely — it tries to keep each essay near the essays
     that were near it in 24 dimensions, and lets the global arrangement
     fall where it may. That is exactly the trade worth making for a
     picture: what you want to see is which essays belong together.

     Seventy-nine points is small enough to do this exactly, with no
     approximation, in a few hundred milliseconds.

     One honest caveat: distances *between* clusters in a t-SNE carry very
     little meaning, and the size of a cluster carries none. Which essays
     sit together is the part to trust. */
  const PERPLEXITY = 8;
  const TSNE_ITERS = 600;

  // Squared distances. The vectors are unit length, so this is 2 - 2cos.
  const d2: Float64Array[] = Array.from({ length: N }, () => new Float64Array(N));
  for (let a = 0; a < N; a++) {
    for (let b = a + 1; b < N; b++) {
      let dot = 0;
      for (let j = 0; j < K; j++) dot += docVecs[a][j] * docVecs[b][j];
      const v = Math.max(0, 2 - 2 * dot);
      d2[a][b] = v; d2[b][a] = v;
    }
  }

  /* Each point gets its own bandwidth, chosen so that it has the same
     effective number of neighbours as every other point. This is what
     stops a dense cluster and a lonely essay being treated alike. */
  const P: Float64Array[] = Array.from({ length: N }, () => new Float64Array(N));
  const targetH = Math.log(PERPLEXITY);
  for (let i = 0; i < N; i++) {
    let lo = 1e-8, hi = Infinity, beta = 1;
    const row = new Float64Array(N);
    for (let tries = 0; tries < 60; tries++) {
      let sum = 0, H = 0;
      for (let j = 0; j < N; j++) {
        if (j === i) { row[j] = 0; continue; }
        row[j] = Math.exp(-d2[i][j] * beta);
        sum += row[j];
      }
      if (sum < 1e-12) sum = 1e-12;
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const p = row[j] / sum;
        if (p > 1e-12) H -= p * Math.log(p);
      }
      if (Math.abs(H - targetH) < 1e-5) break;
      // Too many effective neighbours means the bandwidth is too wide.
      if (H > targetH) { lo = beta; beta = hi === Infinity ? beta * 2 : (beta + hi) / 2; }
      else { hi = beta; beta = (beta + lo) / 2; }
    }
    let sum = 0;
    for (let j = 0; j < N; j++) sum += row[j];
    for (let j = 0; j < N; j++) P[i][j] = row[j] / (sum || 1);
  }

  // Symmetrise into a joint distribution over pairs.
  for (let a = 0; a < N; a++) {
    for (let b = a + 1; b < N; b++) {
      const v = (P[a][b] + P[b][a]) / (2 * N);
      P[a][b] = v; P[b][a] = v;
    }
    P[a][a] = 0;
  }

  const tsneRand = mulberry32(915231);
  const Y = Array.from({ length: N }, () => [(tsneRand() - 0.5) * 1e-2, (tsneRand() - 0.5) * 1e-2]);
  const gains = Array.from({ length: N }, () => [1, 1]);
  const velocity = Array.from({ length: N }, () => [0, 0]);

  for (let iter = 0; iter < TSNE_ITERS; iter++) {
    /* Early exaggeration: for the first stretch the target affinities are
       overstated, which drives tight clusters apart from each other before
       anything settles. Without it everything collapses into one ball. */
    const exaggeration = iter < 120 ? 4 : 1;
    const momentum = iter < 120 ? 0.5 : 0.8;

    const num: Float64Array[] = Array.from({ length: N }, () => new Float64Array(N));
    let qSum = 0;
    for (let a = 0; a < N; a++) {
      for (let b = a + 1; b < N; b++) {
        const dx = Y[a][0] - Y[b][0], dy = Y[a][1] - Y[b][1];
        const v = 1 / (1 + dx * dx + dy * dy);   // Student t, one degree of freedom
        num[a][b] = v; num[b][a] = v;
        qSum += 2 * v;
      }
    }
    if (qSum < 1e-12) qSum = 1e-12;

    for (let a = 0; a < N; a++) {
      let gx = 0, gy = 0;
      for (let b = 0; b < N; b++) {
        if (a === b) continue;
        const q = num[a][b] / qSum;
        const mul = 4 * (P[a][b] * exaggeration - q) * num[a][b];
        gx += mul * (Y[a][0] - Y[b][0]);
        gy += mul * (Y[a][1] - Y[b][1]);
      }
      const g = [gx, gy];
      for (let k2 = 0; k2 < 2; k2++) {
        // Gains: step further where the gradient keeps pointing one way.
        gains[a][k2] = Math.max(0.01,
          Math.sign(g[k2]) === Math.sign(velocity[a][k2]) ? gains[a][k2] * 0.8 : gains[a][k2] + 0.2);
        velocity[a][k2] = momentum * velocity[a][k2] - 200 * gains[a][k2] * g[k2];
        Y[a][k2] += velocity[a][k2];
      }
    }

    // Re-centre, or the whole cloud drifts off on its own.
    let mx = 0, my = 0;
    for (let a = 0; a < N; a++) { mx += Y[a][0] / N; my += Y[a][1] / N; }
    for (let a = 0; a < N; a++) { Y[a][0] -= mx; Y[a][1] -= my; }
  }

  const projection = Y.map(p => [p[0], p[1]]);

  /* ── The map: nearest neighbours in the latent space ──────────────── */
  const edgeSet = new Set<string>();
  const edges: { a: number; b: number; w: number }[] = [];
  for (let a = 0; a < N; a++) {
    const sims = [];
    for (let b = 0; b < N; b++) {
      if (a === b) continue;
      let s = 0;
      for (let j = 0; j < K; j++) s += docVecs[a][j] * docVecs[b][j];
      sims.push({ b, s });
    }
    sims.sort((x, y) => y.s - x.s);
    for (const { b, s } of sims.slice(0, NEIGHBOURS)) {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      edges.push({ a: Math.min(a, b), b: Math.max(a, b), w: s });
    }
  }

  /* ── What ships ───────────────────────────────────────────────────
     Term vectors are the bulk of it, so they go over as int8 with one
     shared scale. The reconstruction error is far below the precision
     anyone can perceive in a ranking.                                 */
  let maxAbs = 0;
  for (let i = 0; i < V; i++) for (let j = 0; j < K; j++) maxAbs = Math.max(maxAbs, Math.abs(U[i][j] * idf[i]));
  const scale = maxAbs / 127 || 1;
  const quant = new Int8Array(V * K);
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < K; j++) {
      quant[i * K + j] = Math.max(-127, Math.min(127, Math.round(U[i][j] * idf[i] / scale)));
    }
  }

  // Distinctive terms get a posting list, so an exact rare word still
  // pulls its own essay up even when the latent space is lukewarm on it.
  const postings: Record<number, number[]> = {};
  const rareIdf: Record<number, number> = {};
  vocab.forEach((t, i) => {
    if (df.get(t)! > RARE_DF) return;
    const hits: number[] = [];
    for (let d = 0; d < N; d++) if (A[d][i] > 0) hits.push(d);
    if (!hits.length) return;
    postings[i] = hits;
    rareIdf[i] = Math.round(idf[i] * 100) / 100;
  });

  return {
    projection: projection.map(p => p.map(x => Math.round(x * 1000) / 1000)),
    dims: K,
    // One newline-joined string rather than an array of quoted strings:
    // same words, a third less of the wire.
    vocab: vocab.join('\n'),
    vocabCount: V,
    rareIdf,
    termScale: scale,
    termVectors: Buffer.from(quant.buffer).toString('base64'),
    docVectors: docVecs.map(v => v.map(x => Math.round(x * 10000) / 10000)),
    postings,
    topics: orderedTopics,
    theta: orderedTheta.map(r => r.map(x => Math.round(x * 10000) / 10000)),
    edges,
    stats: {
      docs: N, vocab: V, topicVocab,
      tokens: streams.reduce((s, t) => s + t.length, 0),
      sampled: docTokens.reduce((s, t) => s + t.length, 0),
    },
  };
}

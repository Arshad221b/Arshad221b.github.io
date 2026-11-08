/* The notebooks, as the Blogs page lists them. Each is a thread of days;
   every figure here (days, reading time) is counted from the day data
   itself, so the index can never drift from what is written inside. */

import { days as neuroscienceDays } from '../data/neuroscience-days';
import { days as emotionDays } from '../data/emotion-days';
import { days as modernNetsDays } from '../data/modern-nets-days';
import { days as vlmSearchDays } from '../data/vlm-search-days';
import { days as reconstructionDays } from '../data/3d-reconstruction-days';

export interface NotebookDay {
  day: number;
  title: string;
  href: string | null;
  minutes: number;
  words: number;
}

export interface Notebook {
  title: string;
  slug: string;
  commitment: string;
  startDate: string;
  endDate: string;
  description: string;
  conclusion: string;
  tags: string[];
  days: NotebookDay[];
  minutes: number;
  words: number;
  inProgress?: boolean;
}

const meta = [
  {
    title: '3D Reconstruction',
    slug: '3d-reconstruction',
    commitment: '',
    startDate: '2026-11-03',
    endDate: '2026-11-08',
    description: 'Geometry-based 3D reconstruction from images: camera models, epipolar geometry, triangulation and structure from motion.',
    conclusion: '',
    tags: ['computer vision', '3D vision'],
    inProgress: true,
    data: reconstructionDays,
  },
  {
    title: 'Overview of Modern Nets',
    slug: 'modern-nets',
    commitment: '1 hr a day',
    startDate: '2026-04-27',
    endDate: '2026-05-05',
    description: 'Revisiting transformers, tokenizers, attention, and the GPT family. Intuitive understanding for interviews and curiosity.',
    conclusion: 'Everything builds on the same transformer attention mechanism. From BPE tokenization to multi-head attention to the full GPT family. The ecosystem on top (RAG, LangChain, agents) is plumbing to make it useful. Still want to go deeper on RoPE, SwiGLU, the chain of thought paper, and diffusion models.',
    tags: ['deep learning', 'transformers', 'LLMs'],
    data: modernNetsDays,
  },
  {
    title: 'Search Images with Words',
    slug: 'vlm-search',
    commitment: '1 hr a day, weekdays',
    startDate: '2026-03-30',
    endDate: '2026-04-04',
    description: 'From neuroscience to CLIP to building a working on-device search prototype. How do VLMs bind words to pixels?',
    conclusion: 'Went from the CLIP paper to a working implementation from scratch. Two encoders, one shared embedding space, contrastive loss. The key insight is that aligning text and image representations lets you do zero-shot classification and text-to-image search without task-specific training.',
    tags: ['computer vision', 'machine learning', 'multimodal'],
    data: vlmSearchDays,
  },
  {
    title: 'Understanding Emotion',
    slug: 'emotion',
    commitment: '1 hr a day',
    startDate: '2026-03-28',
    endDate: '2026-04-09',
    description: 'What are emotions, really? The neuroscience of feeling, and why an autistic brain might process them differently.',
    conclusion: 'Nobody agrees on what emotions are, but evolution built them for a reason. Basic emotions are universal biology. Higher cognitive emotions like guilt are trust signals. Happiness comes from relationships, not money. Emotions actively distort memory, attention, and judgement. Empathy is not mirroring, it is feeling what others feel.',
    tags: ['neuroscience', 'psychology', 'autism'],
    data: emotionDays,
  },
  {
    title: 'Understanding the Visual Cortex',
    slug: 'neuroscience',
    commitment: '1 hr a day',
    startDate: '2026-03-21',
    endDate: '2026-03-27',
    description: 'How does the brain process what the eye sees? Tracing the path from retina through two parallel streams, the mechanisms at each stage, and the computations behind perception.',
    conclusion: "The brain doesn't see the world as it is. It builds a model of what the world should be, and checks it against incoming data. The whole journey, from photon hitting the retina to a fully contextualised, emotionally-tagged memory, takes roughly 150 milliseconds.",
    tags: ['neuroscience', 'perception', 'visual cortex'],
    data: neuroscienceDays,
  },
];

// Words in a day: the prose a reader reads. Figure code, display maths and
// block kinds aren't words; inline maths and markup are dropped too.
const SKIP = new Set(['svg', 'tex', 'kind', 'date', 'day', 'n', 'stages']);
function words(v: unknown): number {
  if (typeof v === 'string') {
    const prose = v.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, ' ').replace(/<[^>]+>/g, ' ');
    return (prose.match(/[A-Za-z'’]+/g) ?? []).length;
  }
  if (Array.isArray(v)) return v.reduce((n, x) => n + words(x), 0);
  if (v && typeof v === 'object')
    return Object.entries(v).reduce((n: number, [k, x]) => n + (SKIP.has(k) ? 0 : words(x)), 0);
  return 0;
}

export const notebooks: Notebook[] = meta.map(({ data, ...m }) => {
  const days = (data as any[])
    .filter(d => d.curiosityTitle)
    .map(d => ({
      day: d.day,
      title: d.curiosityTitle as string,
      // A day page is only built when there is something written on it.
      href: (d.bullets?.length ?? 0) > 0 ? `/notebooks/${m.slug}/day-${d.day}` : null,
      words: words(d),
      minutes: Math.max(2, Math.round(words(d) / 220)),
    }));
  return { ...m, days, minutes: days.reduce((n, d) => n + d.minutes, 0), words: days.reduce((n, d) => n + d.words, 0) };
});

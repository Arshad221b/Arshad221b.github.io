/* The notebooks, as the Blogs page lists them. Each is a thread of days;
   every figure here (days, reading time) is counted from the day data
   itself, so the index can never drift from what is written inside. */

import { days as neuroscienceDays } from '../data/neuroscience-days';
import { days as emotionDays } from '../data/emotion-days';
import { days as modernNetsDays } from '../data/modern-nets-days';
import { days as vlmSearchDays } from '../data/vlm-search-days';

export interface NotebookDay {
  day: number;
  title: string;
  href: string | null;
  minutes: number;
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
}

const meta = [
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

// Words in a day: every string in it, at an unhurried 220 words a minute.
function words(v: unknown): number {
  if (typeof v === 'string') return v.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(v)) return v.reduce((n, x) => n + words(x), 0);
  if (v && typeof v === 'object') return Object.values(v).reduce((n: number, x) => n + words(x), 0);
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
      minutes: Math.max(2, Math.round(words(d) / 220)),
    }));
  return { ...m, days, minutes: days.reduce((n, d) => n + d.minutes, 0) };
});

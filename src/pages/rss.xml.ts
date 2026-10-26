import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { posts } from '../lib/thoughts-data';

const technical = [
  {
    title: 'The Visual Cortex as a Computer Vision Architecture: Dorsal and Ventral Streams',
    pubDate: new Date('2026-04-05'),
    description: 'How the brain\'s visual cortex uses two parallel streams, feedback loops, and relative perception to process vision. Everything rewritten for engineers who build vision systems.',
    link: '/blog/cnns-design-flaw-evolution/',
  },
  {
    title: 'Building a Sign Language Recognition System with CNNs and OpenCV',
    pubDate: new Date('2024-03-10'),
    description: 'A practical walkthrough of building a real-time ASL alphabet recogniser. Dataset, CNN architecture with the actual math, and live webcam inference using OpenCV.',
    link: '/sign-language-recognition-using-cnn-and-opencv/',
  },
  {
    title: 'Temporal and Spatial Attention for 3D Pose Estimation',
    pubDate: new Date('2026-02-22'),
    description: 'How temporal and spatial attention mechanisms enable accurate 2D-to-3D human pose estimation, with a deep dive into DSTformer.',
    link: '/blog/temporal-spatial-attention-3d-pose/',
  },
  {
    title: 'ROC Curves and AUC: Picking the Right Threshold for Your Model',
    pubDate: new Date('2024-02-01'),
    description: 'Why accuracy fails on skewed data, how confusion matrices work, and how to use ROC curves and AUC to evaluate and compare probabilistic classifiers.',
    link: '/blog/roc-curve-auc/',
  },
  {
    title: 'Vector Database Management Systems: Architecture and Internals',
    pubDate: new Date('2024-01-15'),
    description: 'A technical overview of how Vector Database Management Systems work, covering vectorization, indexing, hardware tradeoffs, and the core challenges in building systems that search by meaning rather than exact match.',
    link: '/blog/vector-databases-vdbms/',
  },
  {
    title: 'Probability Mass Functions, Expectation, and Variance',
    pubDate: new Date('2023-11-15'),
    description: 'Relearning probability from a machine learning perspective. What PMFs are, how to compute expectation and variance from first principles, and why any of this matters for ML.',
    link: '/blog/probability-mass-function/',
  },
];

export function GET(context: APIContext) {
  return rss({
    title: 'Arshad Kazi',
    description: 'Technical blogs on computer vision, geometry, 3D understanding, and life.',
    site: context.site!.toString(),
    // Opened in a browser, the feed is laid out as a page in the site's own
    // style; feed readers ignore this and read it as usual.
    stylesheet: '/rss/styles.xsl',
    // Essays come from the same files as the Thoughts page, so every
    // published essay is here and nothing goes stale; the technical posts
    // are listed by hand above.
    items: [
      ...posts.map(p => ({
        title: p.title,
        pubDate: new Date(p.date),
        description: p.description,
        link: `/thoughts/${p.slug}/`,
      })),
      ...technical,
    ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
  });
}

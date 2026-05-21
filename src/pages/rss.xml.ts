import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export function GET(context: APIContext) {
  return rss({
    title: 'Arshad Kazi',
    description: 'Technical blogs on computer vision, geometry, 3D understanding, and life.',
    site: context.site!.toString(),
    items: [
      {
        title: 'What You See in a City Is What You Brought to It',
        pubDate: new Date('2026-05-10'),
        description: 'I went to Bangalore to test an idea: that whatever you see in other people is just a reflection of you. Every encounter became a report on my own interior.',
        link: '/thoughts/what-you-see-in-a-city/',
      },
      {
        title: 'Why High-Functioning Autistic Never Learn to Ask for HELP!',
        pubDate: new Date('2026-04-15'),
        description: 'High-functioning autism creates an invisible struggle. You\'re smart enough to act normal, but the cost of that performance is something nobody sees.',
        link: '/thoughts/why-high-functioning-autistic/',
      },
      {
        title: 'The Visual Cortex as a Computer Vision Architecture: Dorsal and Ventral Streams',
        pubDate: new Date('2026-04-05'),
        description: 'How the brain\'s visual cortex uses two parallel streams, feedback loops, and relative perception to process vision. Everything rewritten for engineers who build vision systems.',
        link: '/blog/cnns-design-flaw-evolution/',
      },
      {
        title: 'Why Do You Feel Like You Are Missing Something?',
        pubDate: new Date('2026-04-01'),
        description: 'The scroll shows you lives you didn\'t live. But that feeling of missing out isn\'t insight. It\'s a trap built on a premise worth questioning.',
        link: '/thoughts/why-do-you-feel-like-missing-something/',
      },
      {
        title: 'Eid, Sheer Khurma and Mother-Son Bond',
        pubDate: new Date('2026-03-28'),
        description: 'I am an atheist in a Muslim household. But Eid evening, when my mum makes Sheer Khurma, is the one time the usual friction between us temporarily stops interfering.',
        link: '/thoughts/eid-sheer-khurma/',
      },
      {
        title: 'Stories We Tell to Survive Each Other...',
        pubDate: new Date('2026-03-20'),
        description: 'A philosophical reflection on loneliness, meaning, and the human. Exploring Camus, absurdism, and the hidden depths of everyday life.',
        link: '/thoughts/stories-we-tell-to-survive/',
      },
      {
        title: 'Building a Sign Language Recognition System with CNNs and OpenCV',
        pubDate: new Date('2024-03-10'),
        description: 'A practical walkthrough of building a real-time ASL alphabet recogniser. Dataset, CNN architecture with the actual math, and live webcam inference using OpenCV.',
        link: '/sign-language-recognition-using-cnn-and-opencv/',
      },
      {
        title: 'You Are Not Einstein. Neither Was He.',
        pubDate: new Date('2026-03-10'),
        description: 'Einstein\'s genius wasn\'t about being smarter. It was about staring at the gap between expectation and reality until it revealed something new.',
        link: '/thoughts/you-are-not-einstein/',
      },
      {
        title: 'Why you are living just to never feel lonely...',
        pubDate: new Date('2026-02-25'),
        description: 'Strip away everything materialistic and emotional from your life, and you\'re left with just a body, a soul, and an almost empty mind.',
        link: '/thoughts/living-to-never-feel-lonely/',
      },
      {
        title: 'Temporal and Spatial Attention for 3D Pose Estimation',
        pubDate: new Date('2026-02-22'),
        description: 'How temporal and spatial attention mechanisms enable accurate 2D-to-3D human pose estimation, with a deep dive into DSTformer.',
        link: '/blog/temporal-spatial-attention-3d-pose/',
      },
      {
        title: 'Why should I write about me when nobody cares?',
        pubDate: new Date('2026-02-15'),
        description: 'I\'m just another Indian guy from a small town. Statistically insignificant, emotionally immature, underdeveloped as a writer. Yet I continue because I exist.',
        link: '/thoughts/why-should-i-write/',
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
    ],
  });
}

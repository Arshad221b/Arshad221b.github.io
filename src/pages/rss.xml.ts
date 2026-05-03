import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export function GET(context: APIContext) {
  return rss({
    title: 'Arshad Kazi',
    description: 'Technical blogs on computer vision, geometry, 3D understanding, and life.',
    site: context.site!.toString(),
    items: [
      {
        title: 'Temporal and Spatial Attention for 3D Pose Estimation',
        pubDate: new Date('2026-02-22'),
        description: 'How temporal and spatial attention mechanisms enable accurate 2D-to-3D human pose estimation, with a deep dive into DSTformer.',
        link: '/blog/temporal-spatial-attention-3d-pose/',
      },

    ],
  });
}

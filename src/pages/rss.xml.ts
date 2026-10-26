import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { feedItems, feedTitle, feedDescription } from '../lib/feed';

// A plain feed for feed readers. People who follow the RSS link land on
// /rss, an ordinary page that explains it; the feed carries no styling of
// its own (browsers are dropping XSLT).
export function GET(context: APIContext) {
  return rss({
    title: feedTitle,
    description: feedDescription,
    site: context.site!.toString(),
    items: feedItems,
  });
}

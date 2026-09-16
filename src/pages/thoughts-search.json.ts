/* The fitted search model, served as its own file so the Thoughts page
   costs nothing to open. The page fetches this the first time someone
   touches the search box. */
import type { APIRoute } from 'astro';
import { searchModel } from '../lib/thoughts-data';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(searchModel), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });

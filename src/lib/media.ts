/* ── Where the pictures live ─────────────────────────────────────
   Every photograph and drawing on the site is kept in Cloudinary, under
   site/ with the same path it once had in public/images. Pages still name
   a picture by that path; this turns it into the address it is served
   from. To add a picture: upload it to site/<folder>/<name> and add
   "<folder>/<name>.jpg" to src/data/media.json. */

import uploaded from '../data/media.json';

const CLOUD = 'https://res.cloudinary.com/dpq4fqlde/image/upload';
const known = new Set(uploaded as string[]);
const rel = (path: string) => path.replace(/^\/?images\//, '');
/* A picture replaced since it was first uploaded: Cloudinary keeps the old
   one under its name, so the new one has a name of its own. */
const replaced: Record<string, string> = {
  'thoughts/drive-my-car-a-movie-about-love-and-disconnect': 'thoughts/drive-my-car-a-movie-about-love-and-disconnect-poster',
  'thoughts/steve-jobs-by-walter-isaacson': 'thoughts/steve-jobs-by-walter-isaacson-poster',
  'thoughts/dabholkar-on-scientific-thinking': 'thoughts/dabholkar-on-scientific-thinking-photo',
};
const id = (path: string) => {
  const name = rel(path).replace(/\.[a-z]+$/i, '');
  return 'site/' + (replaced[name] ?? name);
};

/* For the page: in whatever format the browser reads best, and no wider
   than it is shown when a width is given. */
export const img = (path: string, w?: number) =>
  `${CLOUD}/f_auto,q_auto${w ? `,w_${w},c_limit` : ''}/${id(path)}`;

/* The same picture at a few widths, for a srcset. */
export const widths = (path: string, ws = [800, 1200, 1600]) =>
  ws.map(w => `${img(path, w)} ${w}w`).join(', ');

/* For a shared link's card: always a JPEG, as some chat apps want. */
export const share = (path: string) => `${CLOUD}/f_jpg,q_auto,w_1200/${id(path)}.jpg`;

/* Whether a picture has been uploaded at all. */
export const has = (path: string) => known.has(rel(path));

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
const id = (path: string) => 'site/' + rel(path).replace(/\.[a-z]+$/i, '');

/* For the page: in whatever format the browser reads best. */
export const img = (path: string) => `${CLOUD}/f_auto,q_auto/${id(path)}`;

/* For a shared link's card: always a JPEG, as some chat apps want. */
export const share = (path: string) => `${CLOUD}/f_jpg,q_auto,w_1200/${id(path)}.jpg`;

/* Whether a picture has been uploaded at all. */
export const has = (path: string) => known.has(rel(path));

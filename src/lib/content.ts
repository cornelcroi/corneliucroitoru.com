import { getCollection, type CollectionEntry } from "astro:content";
import { EXTERNAL } from "../data/external";

export type ListedPost = {
  title: string;
  description: string;
  date: Date;
  href: string;
  // Set for articles hosted elsewhere; the row then links out.
  where?: string;
  minutes?: number;
  featured?: boolean;
};

const WORDS_PER_MINUTE = 230;
// webp quality for photographs; night shots stay above 1 MB without it.
export const PHOTO_QUALITY = 72;

export function readingMinutes(markdown: string) {
  return Math.max(1, Math.round(markdown.split(/\s+/).length / WORDS_PER_MINUTE));
}

export async function getArticles() {
  const all = await getCollection("writing", ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getAllPosts(): Promise<ListedPost[]> {
  const own = (await getArticles()).map((a) => ({
    title: a.data.title,
    description: a.data.description,
    date: a.data.date,
    href: `/writing/${a.id}/`,
    minutes: readingMinutes(a.body ?? ""),
    featured: a.data.featured,
  }));
  const external = EXTERNAL.map((e) => ({ ...e, href: e.url }));
  return [...own, ...external].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getSeries() {
  const all = await getCollection("photos");
  return all.sort((a, b) => (b.data.year ?? 0) - (a.data.year ?? 0) || a.data.title.localeCompare(b.data.title));
}

export function shootingParts(photo: CollectionEntry<"photos">["data"]["photos"][number]) {
  const taken = photo.taken
    ? new Date(photo.taken).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : undefined;
  return [photo.camera, photo.lens, photo.focal, photo.aperture, photo.shutter, photo.iso, taken].filter(
    (part): part is string => Boolean(part),
  );
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Email written as HTML entities: people and browsers read it normally,
// naive scrapers that grep the page source for addresses do not.
export function encodedEmailLink(email: string, label = email) {
  const encode = (text: string) => [...text].map((ch) => `&#${ch.codePointAt(0)};`).join("");
  return `<a href="${encode(`mailto:${email}`)}">${encode(label)}</a>`;
}

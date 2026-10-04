import { getCollection, type CollectionEntry } from "astro:content";
import { EXTERNAL } from "../data/external";
import { TALKS } from "../data/talks";

export type ListedPost = {
  title: string;
  description: string;
  date?: Date;
  href: string;
  // Set for articles hosted elsewhere; the row then links out.
  where?: string;
  minutes?: number;
  series?: string;
  featured?: boolean;
};

const WORDS_PER_MINUTE = 230;
// webp quality for photographs; night shots stay above 1 MB without it.
export const PHOTO_QUALITY = 72;

export function readingMinutes(markdown: string) {
  return Math.max(1, Math.round(markdown.split(/\s+/).length / WORDS_PER_MINUTE));
}

// Newest first; an undated article is the newest of all (it is waiting for its day).
const when = (d?: Date) => d?.getTime() ?? Infinity;

export async function getArticles() {
  const all = await getCollection("writing", ({ data }) => !data.draft);
  return all.sort((a, b) => when(b.data.date) - when(a.data.date));
}

// Oldest first: a series is read in the order it was written.
export async function getArticleSeries(name: string) {
  return (await getArticles()).filter((a) => a.data.series === name).reverse();
}

// Articles, talks and podcasts about one project, newest first.
// A talk that shares its article's title rides on the article's line instead of repeating it.
export function aboutProject(name: string) {
  const talks = TALKS.filter((t) => t.project === name && t.url);
  const articles = EXTERNAL.filter((e) => e.project === name).map((e) => {
    const talk = talks.find((t) => t.title === e.title);
    return {
      kind: "Article", title: e.title, where: e.where, year: e.date.getFullYear(), url: e.url,
      also: talk && { label: `also a talk, ${talk.event}`, url: talk.url! },
    };
  });
  const rest = talks.filter((t) => !articles.some((a) => a.title === t.title)).map((t) => ({
    kind: t.format, title: t.title, where: t.event, year: t.year, url: t.url!, also: undefined,
  }));
  return [...articles, ...rest].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export async function getAllPosts(): Promise<ListedPost[]> {
  const own = (await getArticles()).map((a) => ({
    title: a.data.title,
    description: a.data.description,
    date: a.data.date,
    href: `/writing/${a.id}/`,
    minutes: readingMinutes(a.body ?? ""),
    featured: a.data.featured,
    series: a.data.series,
  }));
  const external = EXTERNAL.map((e) => ({ ...e, href: e.url, series: e.project }));
  return [...own, ...external].sort((a, b) => when(b.date) - when(a.date));
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

export function formatDate(date?: Date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Email written as HTML entities: people and browsers read it normally,
// naive scrapers that grep the page source for addresses do not.
export function encodedEmailLink(email: string, label = email) {
  const encode = (text: string) => [...text].map((ch) => `&#${ch.codePointAt(0)};`).join("");
  return `<a href="${encode(`mailto:${email}`)}">${encode(label)}</a>`;
}

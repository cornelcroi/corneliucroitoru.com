import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const writing = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    // Optional search title for <title> and link previews; the page keeps `title` as its headline.
    // Keep it under 60 characters and saying the same thing as the headline, in the words people search.
    seoTitle: z.string().max(60).optional(),
    description: z.string(),
    // Optional: an article can go up before its scheduled day, undated, and get its date later.
    date: z.coerce.date().optional(),
    // Optional: the date of the last meaningful change, sent to search engines as dateModified.
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    devto: z.string().url().optional(),
    // A YouTube video the article embeds. It becomes a VideoObject, so Google can list the article in video results.
    video: z.object({
      youtube: z.string(),
      title: z.string(),
      description: z.string(),
      uploaded: z.coerce.date(),
      duration: z.string(), // ISO 8601, e.g. PT1M49S
    }).optional(),
    // Articles about one product; they link to each other in date order.
    series: z.string().optional(),
    draft: z.boolean().default(false),
    // Shown on the home page. Pick three that show range, not the three newest.
    featured: z.boolean().default(false),
  }),
});

// One folder per series, written by scripts/import_photos.py.
const photos = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/photos" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      source: z.string(),
      year: z.number().nullable(),
      cover: image(),
      photos: z.array(
        z.object({
          src: image(),
          camera: z.string().optional(),
          lens: z.string().optional(),
          focal: z.string().optional(),
          aperture: z.string().optional(),
          shutter: z.string().optional(),
          iso: z.string().optional(),
          taken: z.string().optional(),
        }),
      ),
    }),
});

export const collections = { writing, photos };

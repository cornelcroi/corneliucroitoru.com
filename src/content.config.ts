import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const writing = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    devto: z.string().url().optional(),
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

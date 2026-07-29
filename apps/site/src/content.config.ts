import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

// ---------------------------------------------------------------------------
// Site-wide collections (apps/site/src/content/{en,es}/*)
// ---------------------------------------------------------------------------

const guides = defineCollection({
  loader: glob({
    pattern: "{en,es}/guides/**/*.{md,mdx}",
    base: "./src/content",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(999),
    locale: z.enum(["en", "es"]).default("en"),
  }),
})

const blog = defineCollection({
  loader: glob({
    pattern: "{en,es}/blog/**/*.{md,mdx}",
    base: "./src/content",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().optional(),
    locale: z.enum(["en", "es"]).default("en"),
  }),
})

const changelog = defineCollection({
  loader: glob({
    pattern: "{en,es}/changelog/**/*.{md,mdx}",
    base: "./src/content",
  }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    date: z.coerce.date(),
    locale: z.enum(["en", "es"]).default("en"),
  }),
})

const pages = defineCollection({
  loader: glob({
    pattern: "{en,es}/pages/**/*.{md,mdx}",
    base: "./src/content",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    locale: z.enum(["en", "es"]).default("en"),
  }),
})

// ---------------------------------------------------------------------------
// Package-level documentation (packages/*/docs/**)
// Loaded directly from colocated package directories — no file copying needed.
// The glob loader references the monorepo packages/ dir via a relative path
// from the Astro project root (apps/site/).
// ---------------------------------------------------------------------------

const primitives = defineCollection({
  loader: glob({
    pattern: "*/docs/**/*.{md,mdx}",
    base: "../../packages",
  }),
  schema: z.object({
    title: z.string(),
    primitive: z.string(),
    section: z
      .enum(["overview", "accessibility", "examples"])
      .default("overview"),
    locale: z.enum(["en", "es"]).default("en"),
    status: z
      .enum(["draft", "published", "deprecated"])
      .default("draft"),
  }),
})

// ---------------------------------------------------------------------------
// Export all collections
// ---------------------------------------------------------------------------

export const collections = {
  guides,
  blog,
  changelog,
  pages,
  primitives,
}

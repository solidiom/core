import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const localizedContentFields = {
  title: z.string().min(1),
  description: z.string().min(1),
  locale: z.enum(["en", "es"]).default("en"),
  /** GA entries must have a fresh human-reviewed translation. */
  maturity: z.enum(["draft", "beta", "ga"]).default("beta"),
  translationSourceHash: z
    .string()
    .regex(/^[a-f0-9]{64}$/)
    .optional(),
  translationStatus: z.enum(["draft", "human-reviewed", "stale"]).optional(),
  translationReviewedBy: z.string().min(1).optional(),
  translationReviewedAt: z.coerce.date().optional(),
}

// Site-wide collections are loaded directly from apps/site/src/content.
const guides = defineCollection({
  loader: glob({ pattern: "{en,es}/guides/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({ ...localizedContentFields, order: z.number().default(999) }),
})

const blog = defineCollection({
  loader: glob({ pattern: "{en,es}/blog/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    ...localizedContentFields,
    date: z.coerce.date(),
    author: z.string().optional(),
  }),
})

const changelog = defineCollection({
  loader: glob({ pattern: "{en,es}/changelog/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({ ...localizedContentFields, version: z.string(), date: z.coerce.date() }),
})

const pages = defineCollection({
  loader: glob({ pattern: "{en,es}/pages/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object(localizedContentFields),
})

// Package-level documentation is loaded from colocated package directories.
const primitives = defineCollection({
  loader: glob({ pattern: "*/docs/**/*.{md,mdx}", base: "../../packages" }),
  schema: z.object({
    ...localizedContentFields,
    primitive: z.string(),
    section: z.enum(["overview", "accessibility", "examples"]).default("overview"),
    status: z.enum(["draft", "published", "deprecated"]).default("draft"),
  }),
})

export const collections = {
  guides,
  blog,
  changelog,
  pages,
  primitives,
}

import { defineCollection } from "astro:content"
import { z } from "astro/zod"
import { glob } from "astro/loaders"
import {
  accessibilityContractFields,
  validateAccessibilityContractCoverage,
} from "./lib/accessibility-contract"

/**
 * CONTENT-002: every content entry declares this versioned frontmatter
 * contract. Defaults keep existing CONTENT-001 entries valid while making
 * migration of newly authored content explicit and mechanical.
 */
export const CONTENT_SCHEMA_VERSION = 1 as const

const localeSchema = z.enum(["en", "es"])
const maturitySchema = z.enum(["draft", "beta", "ga"])
const publicationStatusSchema = z.enum(["draft", "published", "deprecated"])

const localizedContentFields = {
  contentSchemaVersion: z.literal(CONTENT_SCHEMA_VERSION).default(CONTENT_SCHEMA_VERSION),
  title: z.string().min(1),
  description: z.string().min(1),
  /** Discovery terms are authored with the content they describe. */
  keywords: z.array(z.string().trim().min(1)).default([]),
  locale: localeSchema.default("en"),
  /** GA entries must have a fresh human-reviewed translation. */
  maturity: maturitySchema.default("beta"),
  translationSourceHash: z
    .string()
    .regex(/^[a-f0-9]{64}$/)
    .optional(),
  translationStatus: z.enum(["draft", "human-reviewed", "stale"]).optional(),
  translationReviewedBy: z.string().min(1).optional(),
  translationReviewedAt: z.coerce.date().optional(),
}

const productFields = {
  product: z.string().min(1),
  productLayer: z.enum(["primitive", "component", "block", "template", "theme"]),
  status: publicationStatusSchema.default("draft"),
  package: z.string().min(1).optional(),
}

const sourceReferenceSchema = z.object({
  path: z.string().min(1),
  export: z.string().min(1).optional(),
  language: z.enum(["ts", "tsx", "css", "json", "md", "mdx"]).optional(),
})

// Site-wide content stays in apps/site/src/content.
const guides = defineCollection({
  loader: glob({ pattern: "{en,es}/guides/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    ...localizedContentFields,
    order: z.number().int().nonnegative().default(999),
    audience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  }),
})

/** Articles are published under the existing /blog content directory. */
const articles = defineCollection({
  loader: glob({ pattern: "{en,es}/articles/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    ...localizedContentFields,
    date: z.coerce.date(),
    /** @deprecated Use authors[] instead; kept for backward compatibility. */
    author: z.string().min(1).optional(),
    /** Author IDs referencing entries in data/authors.json. */
    authors: z.array(z.string().min(1)).default([]),
    tags: z.array(z.string().min(1)).default([]),
  }),
})

const changelog = defineCollection({
  loader: glob({ pattern: "{en,es}/changelog/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    ...localizedContentFields,
    version: z.string().min(1),
    date: z.coerce.date(),
    kind: z.enum(["release", "migration", "deprecation"]).default("release"),
  }),
})

const pages = defineCollection({
  loader: glob({ pattern: "{en,es}/pages/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object(localizedContentFields),
})

// Package-level documentation remains colocated under packages/*/docs.
const primitives = defineCollection({
  loader: glob({ pattern: "*/docs/**/*.{md,mdx}", base: "../../packages" }),
  schema: z.object({
    ...localizedContentFields,
    ...productFields,
    productLayer: z.literal("primitive").default("primitive"),
    primitive: z.string().min(1),
    section: z.enum(["overview", "accessibility", "examples"]).default("overview"),
  }),
})

const examples = defineCollection({
  loader: glob({ pattern: "*/docs/{examples,es/examples}/**/*.{md,mdx}", base: "../../packages" }),
  schema: z.object({
    ...localizedContentFields,
    ...productFields,
    exampleId: z.string().min(1),
    source: sourceReferenceSchema,
    runnable: z.boolean().default(false),
  }),
})

const accessibilityContracts = defineCollection({
  loader: glob({
    pattern: "*/docs/{accessibility,es/accessibility}/**/*.{md,mdx}",
    base: "../../packages",
  }),
  schema: z
    .object({
      ...localizedContentFields,
      ...productFields,
      primitive: z.string().min(1),
      ...accessibilityContractFields,
    })
    .superRefine((contract, context) => {
      for (const message of validateAccessibilityContractCoverage(contract)) {
        context.addIssue({ code: "custom", message })
      }
    }),
})

const components = defineCollection({
  loader: glob({ pattern: "{en,es}/components/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    ...localizedContentFields,
    ...productFields,
    productLayer: z.literal("component").default("component"),
    recipe: z.string().min(1).optional(),
    stylingOutputs: z.array(z.enum(["css", "tailwind", "unocss"])).default([]),
  }),
})

const blocks = defineCollection({
  loader: glob({ pattern: "{en,es}/blocks/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    ...localizedContentFields,
    ...productFields,
    productLayer: z.literal("block").default("block"),
    category: z.string().min(1),
    requiredStates: z.array(z.enum(["loading", "empty", "error", "restricted"])).default([]),
  }),
})

const templates = defineCollection({
  loader: glob({ pattern: "{en,es}/templates/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    ...localizedContentFields,
    ...productFields,
    productLayer: z.literal("template").default("template"),
    stack: z.enum(["solidstart", "tanstack-start-solid", "vite-solid-router"]),
    portfolios: z.array(z.enum(["balanced-product", "enterprise-platform-governance"])).min(1),
  }),
})

const themes = defineCollection({
  loader: glob({ pattern: "{en,es}/themes/**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    ...localizedContentFields,
    ...productFields,
    productLayer: z.literal("theme").default("theme"),
    themeSchemaVersion: z.number().int().positive(),
    outputs: z.array(z.enum(["css", "tailwind", "unocss"])).default([]),
  }),
})

export const collections = {
  guides,
  articles,
  changelog,
  pages,
  primitives,
  examples,
  accessibilityContracts,
  components,
  blocks,
  templates,
  themes,
}

import { getCollection } from "astro:content"
import type { Locale } from "./locale"
import type { CatalogLayer, CatalogView } from "./catalog"

type CollectionName = "components" | "blocks" | "templates" | "themes"

/** Extracts the entry name from a content collection entry id. */
export function extractName(id: string): string {
  const basename = id.split("/").pop()
  if (!basename) return id
  return basename.replace(/\.(md|mdx)$/, "")
}

export const VIEWS: ReadonlyArray<Exclude<CatalogView, "overview">> = [
  "api",
  "examples",
  "accessibility",
] as const

/**
 * Generates static paths for a layer overview route from a content collection.
 */
export async function getLayerOverviewPaths(
  collection: CollectionName,
  layer: CatalogLayer,
  locale: Locale,
): Promise<
  Array<{
    params: { name: string }
    props: {
      collectionName: CollectionName
      layer: CatalogLayer
      entryId: string
      name: string
      locale: Locale
    }
  }>
> {
  const entries = await getCollection(collection, (entry) => entry.data.locale === locale)
  return entries.map((entry) => {
    const name = extractName(entry.id)
    return {
      params: { name },
      props: {
        collectionName: collection,
        layer,
        entryId: entry.id,
        name,
        locale,
      },
    }
  })
}

/**
 * Generates static paths for a layer view route from a content collection.
 */
export async function getLayerViewPaths(
  collection: CollectionName,
  layer: CatalogLayer,
  locale: Locale,
): Promise<
  Array<{
    params: { name: string; view: Exclude<CatalogView, "overview"> }
    props: {
      collectionName: CollectionName
      layer: CatalogLayer
      entryId: string
      name: string
      locale: Locale
      view: Exclude<CatalogView, "overview">
    }
  }>
> {
  const entries = await getCollection(collection, (entry) => entry.data.locale === locale)
  return entries.flatMap((entry) => {
    const name = extractName(entry.id)
    return VIEWS.map((view) => ({
      params: { name, view },
      props: {
        collectionName: collection,
        layer,
        entryId: entry.id,
        name,
        locale,
        view,
      },
    }))
  })
}
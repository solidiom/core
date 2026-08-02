/**
 * Maturity metadata — single source of truth for platform maturity labels.
 *
 * BETA-001: Every area of the platform has a maturity level. This module is the
 * canonical mapping consumed by the MaturityBadge component, catalog pages,
 * and any automated "no dead CTA" checks.
 *
 * The contract is documented in docs/contracts/beta-coverage-matrix.md.
 */

export type MaturityLevel = "stable" | "beta" | "alpha" | "upcoming"

export interface MaturityInfo {
  level: MaturityLevel
  label: string
  tooltip: string
}

const MATURITY_COPY: Record<MaturityLevel, Record<"en" | "es", MaturityInfo>> = {
  stable: {
    en: {
      level: "stable",
      label: "Stable",
      tooltip: "Production-ready. Subject to semantic versioning.",
    },
    es: {
      level: "stable",
      label: "Estable",
      tooltip: "Listo para producción. Sujeto a versionamiento semántico.",
    },
  },
  beta: {
    en: {
      level: "beta",
      label: "Beta",
      tooltip: "Functional and tested. API may change.",
    },
    es: {
      level: "beta",
      label: "Beta",
      tooltip: "Funcional y probado. La API puede cambiar.",
    },
  },
  alpha: {
    en: {
      level: "alpha",
      label: "Alpha",
      tooltip: "Early access. For feedback only.",
    },
    es: {
      level: "alpha",
      label: "Alfa",
      tooltip: "Acceso anticipado. Solo para retroalimentación.",
    },
  },
  upcoming: {
    en: {
      level: "upcoming",
      label: "Upcoming",
      tooltip: "Planned but not yet available.",
    },
    es: {
      level: "upcoming",
      label: "Próximo",
      tooltip: "Planificado pero aún no disponible.",
    },
  },
}

/** Canonical platform areas and their maturity levels. */
export const PLATFORM_MATURITY: Record<string, MaturityLevel> = {
  cli: "stable",
  recipes: "stable",
  themes: "stable",
  primitives: "beta",
  builder: "beta",
  components: "upcoming",
  blocks: "upcoming",
  templates: "upcoming",
}

/**
 * Returns the maturity info for a platform area, localized.
 */
export function getMaturityInfo(area: string, locale: "en" | "es"): MaturityInfo {
  const level = PLATFORM_MATURITY[area] ?? "upcoming"
  return MATURITY_COPY[level][locale]
}

/**
 * Returns the maturity copy for a specific level, localized.
 */
export function getMaturityLevelCopy(level: MaturityLevel, locale: "en" | "es"): MaturityInfo {
  return MATURITY_COPY[level][locale]
}

/**
 * Checks if a platform area is available (not "upcoming").
 */
export function isAreaAvailable(area: string): boolean {
  return (PLATFORM_MATURITY[area] ?? "upcoming") !== "upcoming"
}

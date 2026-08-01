/**
 * MaturityBadge — renders a maturity-level badge with semantic coloring.
 *
 * BETA-001: Honesty label that prevents the site from implying GA completeness.
 * Consumes maturity metadata from `../lib/maturity` and renders via the
 * `@solidiom/badge` primitive with BEM styling.
 */
import { type Accessor, createMemo } from "solid-js"
import { Root as Badge } from "@solidiom/badge"
import {
  getMaturityLevelCopy,
  type MaturityInfo,
  type MaturityLevel,
} from "../lib/maturity"

export interface MaturityBadgeProps {
  /** Maturity level to display. */
  level: MaturityLevel | Accessor<MaturityLevel>
  /** Optional override for the tooltip description. */
  tooltip?: string
  /** Locale for label text. */
  locale?: "en" | "es"
}

export function MaturityBadge(props: MaturityBadgeProps) {
  const info: Accessor<MaturityInfo> = createMemo(() => {
    const level = typeof props.level === "function" ? props.level() : props.level
    const locale = props.locale ?? "en"
    return getMaturityLevelCopy(level, locale)
  })

  const tooltipText = () => props.tooltip ?? info().tooltip

  return (
    <Badge class="maturity-badge">
      <span
        class="maturity-badge__label"
        data-maturity={typeof props.level === "function" ? "dynamic" : props.level}
        title={tooltipText()}
      >
        {info().label}
      </span>
    </Badge>
  )
}
/**
 * Footer link config for SiteFooter.
 *
 * Community is GitHub-only by explicit product decision (see
 * docs/plans/website-plan.md: "Community | GitHub Issues and Discussions only. Do
 * not advertise Discord or other unmaintained channels."). Legal links have
 * no real destination yet: GOV-001 (licensing/brand boundaries), GOV-005
 * (privacy disclosures), and QA-010 (legal/policy review) have not landed,
 * so this list is intentionally empty today rather than pointing at
 * placeholder "#" hrefs. Add rows here once the corresponding page exists.
 */

import type { NavLink } from "../components/SiteHeader"

export const communityLinks: NavLink[] = [
  { label: "GitHub", href: "https://github.com/solidiom" },
  { label: "Issues", href: "https://github.com/solidiom/solidiom/issues" },
  { label: "Discussions", href: "https://github.com/solidiom/solidiom/discussions" },
]

/**
 * Legal/policy links. Empty until GOV-001/GOV-005/QA-010 publish real pages
 * (see docs/plans/website-tasks.md §4, §10). SiteFooter omits this section
 * entirely when the list is empty rather than rendering dead links.
 */
export const legalLinks: NavLink[] = []

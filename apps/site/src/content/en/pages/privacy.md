---
title: Privacy Disclosures
description: How Solidiom handles your data — what we collect, what we don't, and your rights.
locale: en
---

# Privacy Disclosures

**Effective date:** 2025-01-01
**Canonical domain:** solidiom.org
**License:** Apache 2.0 (code); content licensed under CC BY 4.0 unless noted otherwise.

Solidiom is an open-source project. We believe privacy is a right, not a feature. This page documents every external service and data practice used across the Solidiom website so you can make informed decisions about your browsing experience.

---

## Summary

| Service       | Purpose                   | Personal data sent            | Opt-out available   |
| ------------- | ------------------------- | ----------------------------- | ------------------- |
| Cloudflare    | CDN, DNS, basic analytics | IP address (ephemeral)        | No (infrastructure) |
| PostHog       | Product analytics         | Anonymized page views         | Yes                 |
| Buttondown    | Newsletter                | Email (only if you subscribe) | Yes                 |
| Pagefind      | Site search               | None                          | N/A                 |
| Playground    | Code sandbox              | None                          | N/A                 |
| Theme Builder | Visual theming tool       | None                          | N/A                 |

---

## Cloudflare (CDN / DNS / Web Analytics)

### What it does

Cloudflare provides our Content Delivery Network (CDN), DNS resolution, and basic web analytics. All traffic to solidiom.org passes through Cloudflare's edge network.

### What IS collected

- **IP address** — processed ephemerally by Cloudflare's edge nodes for routing and DDoS protection. Cloudflare does not log full IP addresses in their analytics product.
- **Country-level geolocation** — derived from IP for aggregate traffic analytics (e.g., "42% of visitors are from Germany"). No city-level or precise location data.
- **Page URL and referrer** — which pages were visited and where traffic originated.
- **Browser and device metadata** — user-agent string (browser name, OS, device type) for aggregate breakdowns.
- **Performance metrics** — page load times, request counts, bandwidth usage.

### What IS NOT collected

- No cookies are set by Cloudflare Web Analytics.
- No cross-site tracking or fingerprinting.
- No personal identifiers beyond ephemeral IP processing.
- No search terms, email addresses, code entered in the playground, or theme builder values are sent to Cloudflare analytics.

### Data retention

Cloudflare retains web analytics data for a maximum of 6 months in aggregate form. Individual request logs at the edge are purged within 24 hours.

### Your rights

Cloudflare acts as a data processor on our behalf. Since no persistent personal data is stored in analytics, there is no personal data to request deletion of. You may block Cloudflare's analytics beacon using a content blocker, though this does not affect CDN functionality.

### More information

- [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)

---

## PostHog (Product Analytics)

### What it does

PostHog helps us understand how visitors use the documentation site so we can improve navigation, content structure, and developer experience.

### Configuration

We run PostHog with the following privacy-respecting configuration:

- **Autocapture: DISABLED** — we do not automatically capture clicks, form submissions, or page changes. Only explicitly instrumented events are sent.
- **Session replay: DISABLED** — we do not record your screen, mouse movements, or interactions.
- **Cross-domain tracking: DISABLED** — your activity is not linked across different websites.

### What IS collected

- **Page view events** — which documentation pages are visited (URL path only).
- **Explicitly instrumented events** — such as "theme switcher toggled" or "locale changed." These events contain no personal content.
- **Anonymous distinct ID** — a randomly generated identifier stored in a first-party cookie. This cannot be tied back to your real identity.
- **Referrer URL** — where you came from (e.g., a search engine results page).
- **Viewport size and device type** — for responsive design decisions.

### What IS NOT collected

- No names, email addresses, or account information.
- No search terms entered in Pagefind.
- No code entered in the playground.
- No theme values from the theme builder.
- No session recordings or heatmaps.
- No form contents or keystrokes.

### Opt-out

You can opt out of PostHog analytics in any of these ways:

1. **Respect for Do Not Track** — if your browser sends the `DNT: 1` header or `GPC: 1` (Global Privacy Control) header, PostHog analytics will not load.
2. **Content blockers** — ad blockers and privacy extensions (uBlock Origin, Privacy Badger, etc.) will block the PostHog script.
3. **Browser settings** — disabling JavaScript prevents all client-side analytics from running.

### Data retention

Analytics events are retained for 12 months, then automatically deleted. The anonymous distinct ID cookie expires after 365 days of inactivity.

### More information

- [PostHog Privacy Policy](https://posthog.com/privacy)
- [PostHog GDPR guidance](https://posthog.com/docs/privacy)

---

## Buttondown (Newsletter)

### What it does

Buttondown powers our optional newsletter for project updates, release announcements, and community news.

### What IS collected

- **Email address** — only if you explicitly subscribe via the newsletter form.
- **Subscription date** — when you signed up.
- **Open/click tracking** — Buttondown may track whether you opened an email and which links you clicked. We review whether to disable this on an ongoing basis.

### What IS NOT collected

- No data is collected if you do not subscribe.
- No data is shared with third-party advertisers.
- No browsing activity on solidiom.org is linked to your newsletter subscription.

### Opt-out

- **Don't subscribe** — the newsletter is entirely optional. No site functionality depends on it.
- **Unsubscribe** — every email includes a one-click unsubscribe link.
- **Deletion** — email us or use the unsubscribe link to have your email permanently removed from our list.

### Data retention

Your email address is retained only while your subscription is active. Upon unsubscription, your email is deleted from Buttondown within 30 days.

### More information

- [Buttondown Privacy Policy](https://buttondown.com/legal/privacy)

---

## Pagefind (Client-Side Search)

### What it does

Pagefind provides the search functionality on solidiom.org. It is a fully client-side, static search engine.

### How it works

Pagefind pre-builds a search index at site build time. When you type a search query:

1. The search index files are loaded into your browser.
2. Your query is matched against the local index entirely within your browser.
3. Results are displayed without any network request to an external server.

### What IS collected

- **Nothing.** Search queries never leave your browser. No search terms are sent to our servers, Cloudflare, PostHog, or any third party.

### What IS NOT collected

- No search terms.
- No search result clicks (beyond standard page navigation analytics).
- No search history.

### Privacy guarantee

Pagefind is architecturally incapable of leaking search data because it operates entirely within the browser with no external API calls. The search index is a static asset served from the same CDN as the rest of the site.

---

## Playground (Code Sandbox)

### What it does

The Solidiom playground allows you to experiment with components in a live coding environment directly in your browser.

### How it works

The playground runs inside a **sandboxed iframe** with restricted permissions. Code is compiled and executed entirely within your browser using client-side tooling.

### What IS collected

- **Nothing.** Code you write in the playground is never sent to any server.

### What IS NOT collected

- No code content.
- No compilation output.
- No error messages.
- No usage patterns within the playground.

### Privacy guarantee

The playground iframe uses the `sandbox` attribute, which prevents:

- Communication with the parent page beyond structured message passing.
- Access to cookies or storage of the main site.
- Navigation of the top-level browsing context.
- Any outbound network requests to external servers.

Your code stays in your browser. Period.

---

## Theme Builder (Visual Theming Tool)

### What it does

The theme builder lets you customize Solidiom's design tokens (colors, spacing, radii, etc.) and export the resulting theme.

### How it works

All theme state is encoded directly in the **URL** using URL-encoded parameters. This means:

- Your theme configuration is stored in the browser's address bar.
- Sharing a theme is as simple as sharing a URL.
- No server-side persistence, accounts, or databases are involved.

### What IS collected

- **Nothing.** Theme values are never sent to any server or analytics service.

### What IS NOT collected

- No theme configurations.
- No color values, spacing choices, or other design decisions.
- No export actions or download events.

### Privacy guarantee

The theme builder has no backend. There is no API endpoint, no database, and no server-side state. The URL is the only storage mechanism, and it lives entirely in your browser's address bar and history.

---

## Cookies

Solidiom uses the following cookies:

| Cookie              | Purpose                          | Type        | Duration |
| ------------------- | -------------------------------- | ----------- | -------- |
| PostHog distinct_id | Anonymous analytics identifier   | First-party | 365 days |
| Theme preference    | Remembers your light/dark choice | First-party | 365 days |
| Locale preference   | Remembers your language choice   | First-party | 365 days |

No third-party cookies are set. No advertising cookies exist on this site.

---

## Your Rights

Regardless of your jurisdiction, we respect the following rights:

- **Right to know** — this page documents everything we collect. There are no hidden trackers or undisclosed services.
- **Right to opt out** — analytics can be blocked via DNT/GPC headers or content blockers.
- **Right to deletion** — for newsletter subscribers, unsubscribe to have your email removed. For analytics, no personally identifiable data is stored to delete.
- **Right to access** — contact us to request any data we may hold about you (which, for most visitors, is nothing).

### For EU/EEA residents (GDPR)

Our legal basis for processing analytics data is legitimate interest (understanding site usage to improve documentation). We minimize data collection, anonymize identifiers, and disable invasive features like session replay and autocapture.

### For California residents (CCPA)

We do not sell personal information. We do not share personal information for cross-context behavioral advertising. The anonymous analytics data we collect does not constitute "personal information" under CCPA as it cannot reasonably be linked to any individual.

---

## Changes to This Policy

We will update this page when our data practices change. Since Solidiom is open-source, you can review the [commit history](https://github.com/solidiom/solidiom) for this file to see exactly what changed and when.

---

## Contact

For privacy questions or data requests, open an issue on our [GitHub repository](https://github.com/solidiom/solidiom) or reach out through the channels listed on the website.

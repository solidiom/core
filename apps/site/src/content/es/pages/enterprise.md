---
contentSchemaVersion: 1
title: "Enterprise"
description: "Solidiom for enterprise teams: IAM, audit, compliance, governance, and operations templates."
keywords: [enterprise, iam, audit, compliance, governance, security]
locale: es
maturity: draft
product: "Solidiom"
productLayer: page
status: draft
translationSourceHash: "d964dd606db6eb829efc5ddd126161d57a2a0f318265a602ba2e2706213ed3f0"
translationStatus: draft
---

# Enterprise

Solidiom's Enterprise portfolio provides production-ready templates for platform teams building internal tools, compliance systems, and operational consoles.

## Enterprise Templates

| Template                                               | Purpose                                           |
| ------------------------------------------------------ | ------------------------------------------------- |
| [Identity & Access](/templates/identity-access/)       | User directory, RBAC roles, session management    |
| [Audit Log](/templates/audit-log/)                     | Event stream, filters, compliance export          |
| [Billing Operations](/templates/billing-operations/)   | Invoices, reconciliation, financial reports       |
| [Incident Response](/templates/incident-response/)     | Active incidents, runbooks, postmortems           |
| [AI Operations](/templates/ai-operations/)             | Model monitoring, deployments, cost tracking      |
| [API Management](/templates/api-management/)           | Endpoint catalog, key lifecycle, usage analytics  |
| [Developer Portal](/templates/developer-portal/)       | Documentation, SDK playground, app management     |
| [Security Center](/templates/security-center/)         | Threat dashboard, vulnerabilities, policies       |
| [Compliance Center](/templates/compliance-center/)     | Framework tracking, control assessments, evidence |
| [Data Governance](/templates/data-governance/)         | Data catalog, lineage, classification             |
| [Workflow Automation](/templates/workflow-automation/) | Visual designer, run history, integrations        |
| [Support Operations](/templates/support-operations/)   | Ticket queue, knowledge base, metrics             |
| [Enterprise Settings](/templates/enterprise-settings/) | Organization config, SSO/MFA, SCIM                |

## Technical Architecture

All enterprise templates share a common foundation:

- **Solid 2** — reactive UI framework with fine-grained reactivity
- **Vite + Solid Router** — fast builds with file-based routing
- **Source ownership** — you own the code; no vendor lock-in or runtime SDK
- **Theme system** — CSS custom properties for full visual customization
- **Accessibility** — WCAG 2.2 AA compliance with APG patterns throughout

## Security Properties

- **Registry signatures** — all installed code is integrity-verified
- **No runtime SDK** — no phone-home, no telemetry, no external dependencies at runtime
- **Source-mode install** — inspect, audit, and modify every line of code
- **CSP-compatible** — no inline scripts, no eval, no external resource loading
- **Offline capable** — CLI and templates work without network access

## Deployment

Enterprise templates deploy to any static hosting platform:

- Cloudflare Pages
- Vercel
- Netlify
- AWS S3 + CloudFront
- Self-hosted (any HTTP server)

No server-side runtime is required for the base templates. Add your own API layer as needed.

## What This Is Not

- This is **not a hosted SaaS** — you deploy and operate your own instances
- There are **no SLAs or support contracts** — this is open-source software
- There are **no license fees** — MIT licensed
- There is **no vendor lock-in** — source-owned, fork-friendly

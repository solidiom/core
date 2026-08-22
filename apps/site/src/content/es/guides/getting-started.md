---
contentSchemaVersion: 1
title: "Getting Started"
description: "Install Solidiom and create your first project in under 5 minutes."
keywords: [getting-started, install, quickstart, tutorial, guide]
locale: es
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
translationSourceHash: "a94327207e59b42d9deebce3cf37abc9641eaa28a9097ef985b9106a237200f8"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Primeros pasos

Pon en marcha Solidiom en menos de 5 minutos.

## Requisitos previos

- Node.js 24+ (el espacio de trabajo requiere Node 24)
- Un gestor de paquetes: npm, pnpm, Yarn o Bun

## Crear un proyecto

```sh
npx @solidiom/cli create my-app --template saas-dashboard
cd my-app
pnpm install
pnpm run dev
```

## Elegir una plantilla

Solidiom incluye 31 plantillas en dos portafolios:

- **Balanced Product** — Dashboards SaaS, flujos de autenticación, facturación, gestión de contenido
- **Enterprise** — IAM, registros de auditoría, cumplimiento, gestión de API, seguridad

Explora todas las plantillas en [/templates/](/templates/).

## Agregar componentes

Agrega componentes individuales a un proyecto existente:

```sh
npx @solidiom/cli add button
npx @solidiom/cli add dialog
npx @solidiom/cli add data-table
```

## Elegir un perfil de estilos

Solidiom soporta tres salidas de estilos:

- **CSS** — CSS plano con selectores semánticos de atributos data
- **Tailwind** — Clases de utilidad Tailwind CSS
- **UnoCSS** — Utilidades atómicas UnoCSS

Configura tu perfil durante la creación del proyecto o en `.solidiom/config.json`.

## Elegir un tema

Instala el paquete de temas e importa uno de sus puntos de entrada CSS o Tailwind:

```sh
pnpm add @solidiom/themes
```

```css
@import "@solidiom/themes/css/ocean.css";
```

Temas disponibles en el paquete: Solidiom Default, Ocean, Forest, Slate y Aurora.

## Siguientes pasos

- [Explorar primitivos](/primitives/) — 86 bloques de construcción headless
- [Explorar componentes](/components/) — 32 componentes del catálogo con estilos
- [Constructor de temas](/themes/builder/) — editor visual de temas
- [Referencia del CLI](/guides/cli-overview/) — documentación completa de comandos

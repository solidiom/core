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
translationSourceHash: "9342a7b41cbb9a66013b508ac4adc8e6a8fb2b39b7d5c94de2a00e5ec2d64daa"
translationStatus: draft
---

# Primeros pasos

Pon en marcha Solidiom en menos de 5 minutos.

## Requisitos previos

- Node.js 20+ (se recomienda LTS)
- Un gestor de paquetes: npm, pnpm, Yarn o Bun

## Crear un proyecto

```sh
npx solidiom create my-app --template saas-dashboard
cd my-app
npm install
npm run dev
```

## Elegir una plantilla

Solidiom incluye 31 plantillas en dos portafolios:

- **Balanced Product** — Dashboards SaaS, flujos de autenticación, facturación, gestión de contenido
- **Enterprise** — IAM, registros de auditoría, cumplimiento, gestión de API, seguridad

Explora todas las plantillas en [/templates/](/templates/).

## Agregar componentes

Agrega componentes individuales a un proyecto existente:

```sh
npx solidiom add button
npx solidiom add dialog
npx solidiom add data-table
```

## Elegir un perfil de estilos

Solidiom soporta tres salidas de estilos:

- **CSS** — CSS plano con selectores semánticos de atributos data
- **Tailwind** — Clases de utilidad Tailwind CSS
- **UnoCSS** — Utilidades atómicas UnoCSS

Configura tu perfil durante la creación del proyecto o en `.solidiom/config.json`.

## Elegir un tema

Aplica un tema predefinido o crea el tuyo propio:

```sh
npx solidiom add --theme ocean
```

Presets disponibles: Ocean, Forest, Slate, Aurora.

## Siguientes pasos

- [Explorar primitivos](/primitives/) — 52 bloques de construcción headless
- [Explorar componentes](/components/) — 52 wrappers de recetas con estilos
- [Constructor de temas](/themes/builder/) — editor visual de temas
- [Referencia del CLI](/guides/cli-overview/) — documentación completa de comandos

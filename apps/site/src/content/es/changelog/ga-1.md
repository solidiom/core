---
contentSchemaVersion: 1
title: "Solidiom GA — Disponibilidad General"
description: "Solidiom es ahora GA: 52 primitivas, 30 componentes, 36 bloques, 29 plantillas, registro firmado, CLI con verificación Sigstore, cumplimiento WCAG 2.2 AA, soporte bilingüe y certificación multi-navegador."
keywords: [ga, disponibilidad-general, lanzamiento, changelog, primitivas, componentes, bloques, plantillas, accesibilidad, CLI, registro, navegador]
locale: es
maturity: ga
product: "Solidiom"
productLayer: changelog
status: published
date: "2026-08-07"
kind: release
version: "0.0.1-ga"
translationStatus: draft
---

# Solidiom GA — Disponibilidad General

**Versión:** 0.0.1-ga
**Fecha:** 7 de agosto de 2026
**Estado:** Disponibilidad general

Solidiom GA marca la disponibilidad general de una plataforma completa, accesible y bilingüe de componentes construida sobre Solid 2. Este lanzamiento publica el catálogo completo, un registro firmado V3, una CLI de producción, certificación multi-navegador e infraestructura detrás del sitio activo en solidiom.org.

## Contenido de GA

### Catálogo Completo

- **52 primitivas** — Todas estables. Bloques de construcción headless y accesibles con evidencia completa de accesibilidad.
- **30 componentes** — Wrappers de recetas con estilo para CSS, Tailwind y UnoCSS.
- **36 bloques** — Composables a nivel de página en 12 categorías: autenticación, configuración, facturación, observabilidad, flujos empresariales, tablas de datos, formularios, navegación, superposiciones, contenido, retroalimentación y diseño.
- **29 plantillas** — Starters completos de aplicación con enrutamiento, estado y temas. Portafolios Balanced y Enterprise.
- **4 presets de tema** — Ocean, Forest, Slate y Aurora. Todos cumplen el contraste WCAG AA.
- **3 recetas de estilo** — CSS, Tailwind y UnoCSS. Una primitiva, tres salidas de estilo.

### Accesibilidad

Cumplimiento WCAG 2.2 AA verificado a través de tres capas automatizadas y evidencia manual en siete dimensiones:

1. **Escaneos axe-core** — Cero violaciones en todas las primitivas
2. **Auditoría de teclado** — Contratos completos de interacción por teclado para cada primitiva
3. **Verificación de VoiceOver** — Evidencia del lector de pantalla capturada y comprometida
4. **Evidencia manual en 7 dimensiones** — Navegación por teclado, gestión del foco, semántica ARIA, anuncios del lector de pantalla, contraste de color, carga cognitiva y manejo de errores

La semántica ARIA se aplica en tiempo de compilación mediante genéricos de TypeScript.

### Bilingüe

Toda la documentación y el contenido están disponibles en inglés y español. Las traducciones están revisadas por humanos y verificadas en tiempo de compilación.

### Registro con Integridad Criptográfica

El índice de registro V3 proporciona integridad criptográfica para todos los paquetes publicados:

- **Firmas Ed25519** — Cada paquete firmado con un par de claves Ed25519
- **Hashes de integridad** — Hashes SHA-256 para todos los activos del paquete
- **Puntero firmado** — Un índice firmado único apunta a todos los manifiestos del paquete

### CLI con Verificación Sigstore

La CLI `solidiom` gestiona tu espacio de trabajo con verificación basada en Sigstore:

```bash
solidiom create my-app
solidiom add accordion
solidiom verify
solidiom diff
solidiom plan my-project
```

### Certificación Multi-Navegador

- **Chromium** — Chrome, Edge y navegadores basados en Chromium totalmente compatibles
- **Firefox** — Motor Gecko totalmente compatible
- **Safari 17.2+** — WebKit tiene limitaciones conocidas en algunos sistemas

### Infraestructura

- **Cloudflare Pages** — CDN global con caché en el borde y HTTPS automático
- **Encabezados de seguridad** — CSP, HSTS, X-Frame-Options configurados
- **Estrategia de caché** — Encabezados optimizados para contenido estático y dinámico

## Primeros Pasos

### Instalar

```bash
npm create solidiom@latest my-app
cd my-app
npm install
npm run dev
```

### Agregar tu Primer Componente

```bash
solidiom add accordion
```

## Actualización desde Beta

```bash
npm update @solidiom/*
```

## Limitaciones Conocidas

Solid 2.0.0-beta.26 es la dependencia subyacente y no es GA. Sin garantías de semver hasta v1.0 estable (Fase 4). La cobertura completa de TA (NVDA, JAWS, TalkBack), el playground interactivo, la analítica y el boletín están diferidos a hitos posteriores. Consulta la página de [Limitaciones](/articles/limitations) para más detalles.

## Retroalimentación

- **Reportes de errores:** [GitHub Issues](https://github.com/solidiom/solidiom/issues)
- **Solicitudes de funcionalidad:** Abra un issue con la etiqueta `enhancement`
- **Seguridad:** [Divulgación responsable](https://github.com/solidiom/solidiom/security/advisories/new)

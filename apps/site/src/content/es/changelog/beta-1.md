---
contentSchemaVersion: 1
title: "Solidiom Beta 1"
description: "Lanzamiento de catálogo completo: 52 primitivas, 30 componentes, 36 bloques, 29 plantillas y 4 presets de tema — accesibles por diseño, bilingües e impulsados por CLI."
keywords:
  [
    beta,
    lanzamiento,
    changelog,
    primitivas,
    componentes,
    bloques,
    plantillas,
    accesibilidad,
    CLI,
    navegador,
  ]
locale: es
maturity: beta
product: "Solidiom"
productLayer: changelog
status: published
date: "2026-08-07"
kind: release
version: "0.0.1-beta.1"
translationStatus: draft
---

# Solidiom Beta 1

**Versión:** 0.0.1-beta.1
**Fecha:** 7 de agosto de 2026
**Estado:** Beta pública

Beta 1 marca la finalización del catálogo completo. Cada capa — primitivas, componentes, bloques, plantillas y temas — cumple la Definición de Completado M4 y está lista para evaluación pública.

## Novedades

### Catálogo Completo

- **52 primitivas** — Bloques de construcción headless y accesibles con evidencia completa de accesibilidad. Cada primitiva incluye contratos de interacción por teclado, semántica ARIA ejecutada en tiempo de compilación y resultados de escaneo axe-core comprometidos.
- **30 componentes** — Wrappers de recetas con estilo para CSS, Tailwind y UnoCSS. Componen primitivas con diseño, ranuras semánticas y soporte de variantes.
- **36 bloques** — Composables a nivel de página con estados de carga, vacío, error y restringido. Cubren autenticación, configuración, facturación, observabilidad y flujos empresariales.
- **29 plantillas** — Starters completos de aplicación con enrutamiento, estado y temas. Portafolios Balanced y Enterprise para SaaS, herramientas internas y comercio.
- **4 presets de tema** — Ocean, Forest, Slate y Aurora. Todos cumplen el contraste WCAG AA para modos claro y oscuro.

### Accesibilidad

Cada primitiva está verificada en tres capas:

1. Escaneo automatizado con **axe-core** en navegadores reales
2. **Contratos de teclado** probados con eventos de teclado simulados
3. **Evidencia de VoiceOver** capturada y comprometida como artefacto

La semántica ARIA se aplica en tiempo de compilación mediante genéricos de TypeScript — los atributos faltantes causan errores de compilación.

### Bilingüe

Toda la documentación y el contenido orientado al usuario están disponibles en inglés y español. La completitud de la traducción se verifica en tiempo de compilación: cero obsoletas, cero faltantes.

### CLI con Integridad del Registro

La CLI de Solidiom crea proyectos, agrega primitivas y gestiona tu espacio de trabajo. Los paquetes del registro están firmados con claves Ed25519 y verificados con trazabilidad basada en Sigstore.

```bash
solidiom create my-app
solidiom add accordion
solidiom registry verify
```

### Tres Recetas de Estilo

Una primitiva, tres salidas de estilo:

- **CSS** — Propiedades personalizadas nativas y nombres de clase estilo BEM
- **Tailwind** — Composición de utilidades de Tailwind CSS
- **UnoCSS** — Mapeo de clases atómicas de UnoCSS

## Navegadores Compatibles

Beta 1 está certificada en dos motores de renderizado:

- **Chromium** — Chrome, Edge y navegadores basados en Chromium totalmente compatibles
- **Firefox** — Motor Gecko totalmente compatible

Las pruebas de **WebKit** (Safari) están bloqueadas actualmente por restricciones en dependencias de sistema. El soporte para WebKit está previsto para el próximo lanzamiento beta una vez que se resuelvan dichas dependencias.

## Primeros Pasos

### Instalar

```bash
npm create solidiom@latest my-app
cd my-app
npm install
npm run dev
```

### Agregar tu Primera Primitiva

```bash
solidiom add accordion
```

La CLI agrega la primitiva, todas las salidas de recetas y la compatibilidad con temas a tu espacio de trabajo.

### Comandos Disponibles

| Comando                         | Descripción                                   |
| ------------------------------- | --------------------------------------------- |
| `solidiom create <name>`        | Crear un nuevo proyecto                       |
| `solidiom add <primitive>`      | Agregar una primitiva a tu espacio de trabajo |
| `solidiom registry verify`      | Verificar la integridad del paquete           |
| `solidiom theme list`           | Listar presets disponibles                    |
| `solidiom theme apply <preset>` | Aplicar un preset de tema                     |

## Limitaciones Conocidas

### Dependencia de Solid 2 Beta

Solidiom se construye sobre Solid 2, que también está en beta. Los cambios en la API de Solid 2 pueden propagarse a las primitivas de Solidiom.

### Diferidos a Post-Beta

- **Zoom** — Zoom de contenido más allá del 200% no probado para todas las primitivas
- **Contraste** — Contraste AAA; el objetivo actual es AA
- **Movimiento reducido** — Adaptaciones de `prefers-reduced-motion` no exhaustivas
- **Lectores de pantalla** — Solo VoiceOver probado; NVDA, JAWS, TalkBook diferidos
- **Táctil** — Patrones de interacción táctil no verificados aún

### Estabilidad de la API

La API pública puede cambiar entre lanzamientos beta. No se esperan cambios rupturistas dentro del track beta.

## Ruta de Actualización

Las actualizaciones entre lanzamientos beta siguen el flujo de changesets:

```bash
npm update @solidiom/*
```

Sin cambios rupturistas en este lanzamiento beta inicial.

## Retroalimentación

- **Reportes de errores:** [GitHub Issues](https://github.com/solidiom/core/issues)
- **Solicitudes de funcionalidad:** Abra un issue con la etiqueta `enhancement`
- **Seguridad:** [Divulgación responsable](https://github.com/solidiom/core/security/advisories/new)

---
contentSchemaVersion: 1
title: "Limitaciones Conocidas"
description: "Limitaciones actuales de Solidiom GA incluyendo dependencia de Solid 2 beta, estabilidad de API, soporte de navegador, cobertura de accesibilidad y funcionalidades diferidas."
keywords:
  [limitaciones, problemas-conocidos, soporte-navegador, accesibilidad, solid-2, estabilidad-api]
locale: es
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
authors:
  - solidiom-core
tags: [limitations, solid-2, operations]
translationSourceHash: "ee0a2e7114967c1e6be72c5f95b92d70b4ee879183f9b30ce83efb7059bc05c2"
translationStatus: draft
---

# Limitaciones Conocidas

Esta página documenta las limitaciones actuales de Solidiom GA. Cada limitación incluye su severidad, fase objetivo de resolución y mitigaciones disponibles.

## Dependencia de Solid 2 Beta

**Severidad:** Alta — **Objetivo:** Fase 4 (v1.0 estable)

Solidiom se construye sobre Solid 2.0.0-beta.26, que aún no es GA. Los cambios en la API de Solid 2 pueden propagarse a las primitivas de Solidiom. Este es el riesgo principal de dependencia para implementaciones de producción.

**Mitigación:** Fija Solid 2 a la versión beta exacta en tu proyecto. Monitorea el canal de lanzamientos de Solid 2 para anuncios de versión estable.

## Estabilidad de la API

**Severidad:** Media — **Objetivo:** Fase 4 (v1.0 estable)

Sin garantías de versionamiento semántico hasta v1.0 estable. La API pública puede cambiar entre lanzamientos en el track 0.x. Los cambios rupturistas se documentarán en el changelog.

**Mitigación:** Fija versiones exactas en producción. Revisa el changelog antes de cada actualización.

## Soporte de Navegadores

**Severidad:** Media

Se requiere Safari 17.2+. WebKit tiene limitaciones conocidas en algunos sistemas. Chromium (Chrome, Edge) y Firefox están totalmente certificados.

| Motor    | Navegadores         | Estado                                             |
| -------- | ------------------- | -------------------------------------------------- |
| Chromium | Chrome, Edge, Brave | Certificado                                        |
| Gecko    | Firefox             | Certificado                                        |
| WebKit   | Safari 17.2+        | Limitado — problemas conocidos en algunos sistemas |

## Cobertura de Accesibilidad

**Severidad:** Baja — **Objetivo:** Fase 4

WCAG 2.2 AA está cumplido. VoiceOver (macOS) es la línea base actual de tecnología de asistencia. La cobertura completa de TA — NVDA, JAWS y TalkBack — está diferida a la Fase 4. Elementos adicionales diferidos incluyen zoom más allá del 200%, contraste AAA, adaptaciones exhaustivas de `prefers-reduced-motion` y patrones de interacción táctil.

## Playground

**Severidad:** Informativa — **Objetivo:** M6

El playground interactivo para explorar primitivas en el navegador aún no está disponible.

## Analítica

**Severidad:** Informativa — **Objetivo:** M6

Las métricas de uso y adopción de componentes aún no están disponibles.

## Boletín

**Severidad:** Informativa — **Objetivo:** M6

El sistema de suscripción al boletín aún no está disponible.

## Optimizaciones en Tiempo de Compilación

**Severidad:** Informativa — **Estado:** Fase 3A, en incubación

Las optimizaciones en tiempo de compilación son experimentales y no están habilitadas por defecto. Sin garantías de rendimiento para las transformaciones. La API de plugin de optimización es inestable.

## Autoría Generativa

**Severidad:** Informativa — **Estado:** Fase 3B, no iniciada

Las características de generación asistida por IA y diseño-a-código están planificadas pero no iniciadas.

## Renderizado del Lado del Servidor

**Severidad:** Baja

El soporte SSR y de hidratación está presente pero no todos los casos límite están cubiertos. El SSR básico funciona para primitivas y componentes. Los desajustes de hidratación pueden ocurrir en escenarios de estado complejos. El SSR por streaming aún no está soportado. El renderizado del lado del cliente es el modo totalmente soportado.

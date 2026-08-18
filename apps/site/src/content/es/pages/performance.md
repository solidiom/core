---
contentSchemaVersion: 1
title: "Rendimiento"
description: "Resultados de benchmarks, presupuestos de bundle y métricas de interacción para las primitivas de Solidiom."
keywords: [performance, benchmark, bundle, metrics, throughput, rendimiento]
locale: es
maturity: beta
translationSourceHash: "119deab17d42413f3eb557be6ef7ed41212c42d31dbae180bd13c54de06209c1"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Rendimiento

Las primitivas de Solidiom están diseñadas para una sobrecarga mínima y una interactividad máxima. Esta página rastrea los resultados de benchmarks en tres dimensiones: rendimiento, tamaño de bundle y métricas de interacción en el mundo real.

## Metodología de Benchmarks

Los benchmarks de rendimiento miden las operaciones por segundo para las operaciones principales de las primitivas usando `mitata`. Los tamaños de bundle se miden como salida comprimida con gzip para cada paquete. Las métricas de interacción se recopilan mediante pruebas end-to-end con Playwright.

## Presupuestos de Bundle

Cada paquete tiene un presupuesto de tamaño de bundle gzip ejecutado en CI. Los paquetes que excedan su presupuesto fallarán la compilación.

## Métricas de Interacción

Las pruebas basadas en Playwright miden el Time to First Byte (TTFB), First Input Delay (FID) y Long Tasks para interacciones representativas de componentes.

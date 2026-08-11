---
contentSchemaVersion: 1
title: "Security Center"
description: "Centro de seguridad con dashboard de amenazas, vulnerabilidades y gestión de políticas."
keywords: [security-center, plantilla, inicio, solid, seguridad, amenazas, enterprise]
locale: es
maturity: beta
product: "Security Center"
productLayer: template
status: published
package: "@solidiom/template-security-center"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
translationSourceHash: "9a0909ff67deec0d1c3351b455ecc348052f4876fd678a666bea42daf689de3b"
translationStatus: draft
---

Security Center proporciona un punto de partida listo para producción para construir consolas de operaciones de seguridad con visibilidad de amenazas, gestión de vulnerabilidades y aplicación de políticas.

## Resumen

Esta plantilla crea un centro de seguridad completo con un dashboard de amenazas en tiempo real con distribución de severidad y alertas activas, una vista de escáner de vulnerabilidades con detalles de CVE, activos afectados y guía de remediación, y una interfaz de gestión de políticas para definir, aplicar y auditar políticas de seguridad.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-OBS-01 (Observability Overview)
- BLOCK-OBS-02 (Alert Management)
- BLOCK-OBS-03 (Event Explorer)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template security-center
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.

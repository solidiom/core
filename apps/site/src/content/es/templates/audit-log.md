---
contentSchemaVersion: 1
title: "Audit Log"
description: "Visor de log de auditoría con flujo de eventos, filtros y exportación."
keywords: [audit-log, plantilla, inicio, solid, auditoría, cumplimiento, enterprise]
locale: es
maturity: draft
product: "Audit Log"
productLayer: template
status: draft
package: "@solidiom/template-audit-log"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
translationSourceHash: "09efbc606398a27065f29cdf36fc624d25bbb447063a73e957e5bd5655058aad"
translationStatus: draft
---

Audit Log proporciona un punto de partida listo para producción para construir visores de trazabilidad de auditoría y eventos de cumplimiento para aplicaciones empresariales.

## Resumen

Esta plantilla crea una aplicación completa de log de auditoría con un flujo de eventos en tiempo real mostrando actor, acción y detalles del recurso, filtros avanzados para acotar eventos por actor, tipo, recurso, fecha y severidad, y una facilidad de exportación para generar informes CSV, JSON y de cumplimiento.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-ADMIN-01 (Team Management)
- BLOCK-ADMIN-02 (Role Management)
- BLOCK-ADMIN-03 (Audit Log)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template audit-log
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.

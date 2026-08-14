---
contentSchemaVersion: 1
title: "Multi-tenant Admin"
description: "Administración multi-inquilino con gestión de equipos, RBAC y auditoría."
keywords: [multi-tenant-admin, plantilla, inicio, solid, admin, enterprise]
locale: es
maturity: beta
product: "Multi-tenant Admin"
productLayer: template
status: published
package: "@solidiom/template-multi-tenant-admin"
stack: vite-solid-router
portfolios: ["balanced-product", "enterprise-platform-governance"]
translationSourceHash: "ad8a65637ca548edaeedc40c9123a758001f8170342459119f80c32bb28913af"
translationStatus: draft
---

Multi-tenant Admin proporciona un punto de partida listo para producción para interfaces de administración multi-inquilino.

## Resumen

Esta plantilla crea un panel de administración completo con gestión de equipos, control de acceso basado en roles y registro de auditoría.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-ADMIN-01 (Team Management)
- BLOCK-ADMIN-02 (Audit Log)
- BLOCK-ADMIN-03 (Role Permissions)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template multi-tenant-admin
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.

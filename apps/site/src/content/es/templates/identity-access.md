---
contentSchemaVersion: 1
title: "Identity & Access"
description: "Gestión de identidad y acceso con usuarios, roles y sesiones."
keywords: [identity-access, plantilla, inicio, solid, iam, usuarios, roles, enterprise]
locale: es
maturity: beta
product: "Identity & Access"
productLayer: template
status: published
package: "@solidiom/template-identity-access"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
translationSourceHash: "cb72790d174dff98720d552c1dd017c3684190b19bbbac71ebe63c592445222e"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Identity & Access proporciona un punto de partida listo para producción para construir consolas de gestión de identidad y acceso para organizaciones empresariales.

## Resumen

Esta plantilla crea una consola IAM completa con un directorio de usuarios para provisionar, desactivar y gestionar perfiles, un editor de roles y permisos para definir políticas RBAC, y un monitor de sesiones para revisar sesiones activas y revocar tokens.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-AUTH-02 (Sign Up)
- BLOCK-AUTH-03 (Reset Password)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-ADMIN-01 (Team Management)
- BLOCK-ADMIN-02 (Role Management)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template identity-access
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.

---
contentSchemaVersion: 1
title: "Authentication Starter"
description: "Plantilla de autenticación con inicio de sesión, registro y restablecimiento de contraseña."
keywords: [auth-starter, plantilla, inicio, solid, autenticacion]
locale: es
maturity: beta
product: "Authentication Starter"
productLayer: template
status: published
package: "@solidiom/template-auth-starter"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "6ccbe12fead1e26f5a3d0bc16327341fb26ab22740b04a89ae3d32e93eaa9995"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Authentication Starter proporciona un punto de partida listo para producción para proyectos Solid con flujos de autenticación completos.

## Resumen

Esta plantilla crea un proyecto completo con páginas de inicio de sesión, registro y restablecimiento de contraseña pre-configuradas con componentes y bloques de Solidiom.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-AUTH-02 (Sign Up)
- BLOCK-AUTH-03 (Reset Password)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template auth-starter
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.

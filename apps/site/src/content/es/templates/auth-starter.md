---
contentSchemaVersion: 1
title: "Authentication Starter"
description: "Plantilla de autenticación con inicio de sesión, registro y restablecimiento de contraseña."
keywords: [auth-starter, plantilla, inicio, solid, autenticacion]
locale: es
maturity: draft
product: "Authentication Starter"
productLayer: template
status: draft
package: "@solidiom/template-auth-starter"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "89c388ed7eb22286f7219f0190620d0f054c0cb0c6ed95083d9b1e0f53d96dac"
translationStatus: draft
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

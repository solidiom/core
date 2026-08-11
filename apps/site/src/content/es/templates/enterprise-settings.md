---
contentSchemaVersion: 1
title: "Enterprise Settings"
description: "Configuración empresarial con organización, seguridad e integraciones."
keywords: [enterprise-settings, plantilla, inicio, solid, configuración, enterprise, sso]
locale: es
maturity: beta
product: "Enterprise Settings"
productLayer: template
status: published
package: "@solidiom/template-enterprise-settings"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
translationSourceHash: "83fae59ab987cb0d73e3b42eecf82f7a34665050e898362509f41371af357d00"
translationStatus: draft
---

Enterprise Settings proporciona un punto de partida listo para producción para construir consolas de administración a nivel de organización con seguridad, identidad y gestión de integraciones.

## Resumen

Esta plantilla crea una aplicación completa de configuración empresarial con una página de configuración de organización para perfil, branding y verificación de dominio, una página de seguridad para SSO, aplicación de MFA, políticas de sesión y listas de IPs permitidas, y una página de integraciones para provisión SCIM, SAML, sincronización de directorio y webhooks.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-SETTINGS-01 (Account Settings)
- BLOCK-SETTINGS-02 (Notification Settings)
- BLOCK-SETTINGS-03 (Danger Zone)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template enterprise-settings
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.

---
contentSchemaVersion: 1
title: "Settings Portal"
description: "Portal de configuración con cuenta, notificaciones y zona de peligro."
keywords: [settings-portal, plantilla, inicio, solid, configuracion]
locale: es
maturity: beta
product: "Settings Portal"
productLayer: template
status: published
package: "@solidiom/template-settings-portal"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "e76a9d5819cfcb1efd17adb4e5c95eaf69ea3208d1bc8159e8f5ea7e448b6c99"
translationStatus: draft
---

Settings Portal proporciona un punto de partida listo para producción para la gestión de configuración de aplicaciones.

## Resumen

Esta plantilla crea una interfaz completa de configuración con gestión de cuenta, preferencias de notificación y flujos de confirmación de acciones destructivas.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SETTINGS-01 (Account Settings)
- BLOCK-SETTINGS-02 (Notification Preferences)
- BLOCK-SETTINGS-03 (Danger Zone)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template settings-portal
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.

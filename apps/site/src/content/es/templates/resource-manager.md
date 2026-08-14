---
contentSchemaVersion: 1
title: "Resource Manager"
description: "Gestor de recursos con vistas de lista, detalle y creación."
keywords: [resource-manager, plantilla, inicio, solid, recursos, enterprise]
locale: es
maturity: beta
product: "Resource Manager"
productLayer: template
status: published
package: "@solidiom/template-resource-manager"
stack: vite-solid-router
portfolios: ["balanced-product", "enterprise-platform-governance"]
translationSourceHash: "2daa6da28f8d16250cb945e0d77f2fa8f2d800406b4887659c328145060065d0"
translationStatus: draft
---

Resource Manager proporciona un punto de partida listo para producción para aplicaciones de gestión de recursos CRUD.

## Resumen

Esta plantilla crea una interfaz completa de gestión de recursos con lista filtrable, vista de detalle y formulario de creación guiado.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-RESOURCE-01 (Resource List)
- BLOCK-RESOURCE-02 (Resource Detail)
- BLOCK-RESOURCE-03 (Resource Creator)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template resource-manager
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.

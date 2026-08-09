---
contentSchemaVersion: 1
title: "Arquitectura Impulsada por Registro"
description: "Cómo el registro firmado de Solidiom sirve como la única fuente de verdad para primitivas, componentes, bloques y temas."
keywords: [registry, architecture, integrity, provenance, signing, article]
locale: es
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
translationSourceHash: "placeholder"
translationStatus: draft
---

# Arquitectura Impulsada por Registro

Solidiom se construye sobre una idea: un registro verificable es la base de un ecosistema de componentes. Todo lo que instales, previsualices o compongas en solidiom.org se rastrea hasta una entrada firmada en `registry/index.json`.

## El Registro como Fuente de Verdad

El registro no es un complemento de metadatos. Es el catálogo autoritativo:

- Cada primitiva, componente, bloque, plantilla y tema tiene exactamente una identidad canónica
- Cada identidad declara sus entregables, dependencias, madurez, versión y ruta de instalación
- Las rutas del sitio se generan desde entradas del registro — si no está en el registro, no tiene página
- Los comandos de instalación del CLI derivan de los metadatos del registro — `solidiom add accordion` lee el registro, no una lista codificada

## Contención de Cada Entrada

```json
{
  "name": "accordion",
  "version": "0.0.1-next.0",
  "package": "@solidiom/accordion",
  "status": "stable",
  "deliverables": ["primitive"],
  "documentationLocales": { "en": "stable", "es": "stable" },
  "stylingOutputs": ["css", "tailwind", "unocss"],
  "integrity": { "files": { "source/index.ts": "sha256-..." } },
  "provenance": { "repository": "...", "directory": "packages/accordion" }
}
```

Los campos no son decorativos. Impulsan:

- **Instalabilidad** — el CLI lee `package`, `version` y `deliverables` para saber qué obtener
- **Renderizado del catálogo** — el sitio lee `label`, `description` y `category` para las vistas de directorio
- **Controles de calidad** — `documentationLocales` y `status` determinan si se cumple un criterio de GA
- **Seguridad de la cadena de suministro** — `integrity` y `provenance` permiten la verificación

## Integridad y Firma

El índice del registro contiene un hash de integridad de todas las entradas, y cada entrada contiene dígitos SHA-256 por archivo. El índice está firmado con firmas asimétricas Ed25519.

El flujo de verificación es:

1. El CLI descarga `registry/index.json`
2. Verifica la firma Ed25519 contra la clave pública publicada
3. Verifica que el hash a nivel de entradas coincida con el campo `integrity.entriesHash`
4. Para cada paquete instalado, verifica los dígitos por archivo

Si alguna verificación falla, el CLI se detiene. Esto es fail-closed: es mejor no instalar nada que instalar código manipulado.

## Por Qué Importa

La mayoría de las bibliotecas de componentes tienen una desconexión entre su documentación, su registro de paquetes y su sitio web. Solidiom elimina esa brecha:

- **Una identidad** — no hay que adivinar si `@solidiom/accordion` y la página "Accordion" son lo mismo
- **Verificación mecánica** — la calidad de GA es comprobable por script, no por opinión
- **Capaz de funcionar sin conexión** — una instantánea local del registro funciona para instalación y verificación
- **Auditable** — el registro es un archivo JSON. Puedes leerlo, compararlo y auditar sus cambios

## Relación con npm

El registro no es un reemplazo de npm. Es la capa sobre npm que:

- Declara qué paquetes de npm pertenecen al ecosistema de Solidiom
- Especifica su madurez, dependencias y compatibilidad
- Firma los metadatos para que los consumidores puedan verificar el origen
- Impulsa el catálogo del sitio y los comandos del CLI

npm maneja la distribución. El registro maneja la identidad.

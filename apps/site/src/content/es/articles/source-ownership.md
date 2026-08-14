---
contentSchemaVersion: 1
title: "Source Ownership"
description: "Why Solidiom gives you the source code and what that means for your project."
keywords: [source-ownership, no-lock-in, open-source, customization, article]
locale: es
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
authors:
  - solidiom-core
tags: [open-source, architecture]
translationSourceHash: "5c0881d1b98fc79ea433ed71d764ce95ff577136fc5baeead127e45a1d4360f8"
translationStatus: draft
---

# Propiedad del Codigo Fuente

Cuando instalas un primitivo o plantilla de Solidiom, obtienes el código fuente. No un bundle compilado. No un enlace CDN. Los archivos TypeScript reales se instalan en tu proyecto.

## Qué Significa la Propiedad del Codigo Fuente

1. **Puedes leerlo** — sin código minificado misterioso en node_modules
2. **Puedes modificarlo** — cambiar comportamiento, agregar funciones, corregir errores
3. **Puedes auditarlo** — revisar cada línea por seguridad antes de desplegar
4. **Puedes bifurcarlo** — tomar el código y nunca mirar atrás
5. **Puedes venderizarlo** — commitear en tu repositorio y desconectarte del upstream

## Cómo Funciona

### Modo Paquete (por defecto)

```sh
solidiom add button
```

Instala `@solidiom/button` como dependencia del workspace. El código fuente está en `node_modules/@solidiom/button/source/` — legible, pero gestionado por tu gestor de paquetes.

### Modo Fuente

```sh
solidiom add button --source
```

Copia el código fuente del primitivo directamente en tu proyecto en `src/solidiom/button/`. Eres completamente dueño de estos archivos. Se commitean en tu repositorio.

### Verificación de Integridad

Ambos modos verifican la integridad:

```sh
solidiom verify
```

Compara los digests de los archivos instalados contra el manifiesto firmado del registro. Si los archivos han sido manipulados (o modificados intencionalmente en modo fuente), el CLI reporta las diferencias.

## ¿Por Qué No Solo npm?

Las bibliotecas de componentes tradicionales te dan un bundle compilado:

- No puedes ver la implementación
- No puedes corregir errores sin esperar un release
- No puedes eliminar funciones que no necesitas
- No puedes auditar por seguridad sin decompilar

La emisión `source/` de Solidiom te da la misma experiencia de desarrollo que código que escribiste tú mismo, con la opción de mantenerte conectado a las mejoras del upstream.

## Compensaciones

| Beneficio       | Compensación                                                    |
| --------------- | --------------------------------------------------------------- |
| Control total   | Eres responsable de tus modificaciones                          |
| Sin lock-in     | Las actualizaciones upstream requieren merge manual (modo fuente) |
| Auditable       | Más archivos en tu proyecto                                     |
| Bifurcable      | La divergencia del upstream es permanente (modo fuente)          |

## El Contrato del Registro

El registro asegura que lo que instalas es lo que fue publicado:

- Cada archivo tiene un digest SHA-256 en el manifiesto
- Los manifiestos están firmados con Ed25519 (verificación asimétrica)
- El CLI falla cerrado ante discrepancia de digest
- El modo offline funciona desde una instantánea local del registro

No tienes que confiar en nosotros. Puedes verificar.

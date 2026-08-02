---
contentSchemaVersion: 1
title: "Vista general de la CLI de Solidiom"
description: "Introducción a la interfaz de línea de comandos de Solidiom: instalación, configuración, y los comandos principales disponibles para gestionar primitivos en tu proyecto."
keywords: [cli, solidiom, comandos, instalación, primitivos, línea de comandos, gestor de paquetes]
locale: es
maturity: beta
order: 1
audience: beginner
translationSourceHash: "3345ef0517faed5364c7bf01b2e15687c9cd54c97dfa118ac130f5cd0334a5b6"
translationStatus: draft
---

# Vista general de la CLI de Solidiom

La CLI de Solidiom es una herramienta de línea de comandos que automatiza la gestión de primitivos UI en proyectos Solid. Resuelve dependencias, instala código fuente o paquetes npm, verifica integridad, y mantiene la consistencia entre la versión instalada y el catálogo del registro.

## Instalación

```bash
npm install -D @solidiom/cli
```

O con otros gestores de paquetes:

```bash
pnpm add -D @solidiom/cli
yarn add -D @solidiom/cli
bun add -D @solidiom/cli
```

## Inicialización

Antes de usar cualquier comando, inicializa la configuración del proyecto:

```bash
solidiom init
```

Esto crea el directorio `.solidiom/` y el archivo `.solidiom/config.json` con los valores predeterminados.

### Configuración predeterminada

`config.json` incluye las siguientes claves con sus valores por defecto:

| Clave                | Valor predeterminado                        | Descripción                                               |
| -------------------- | ------------------------------------------- | --------------------------------------------------------- |
| `positioningAdapter` | `@solidiom/adapter-positioning-floating-ui` | Adaptador de posicionamiento                              |
| `sourceDir`          | `src/ui/primitives`                         | Directorio destino para instalaciones de código fuente    |
| `runtimeDir`         | `src/ui/_runtime`                           | Directorio de runtime para instalaciones de código fuente |
| `componentDir`       | `src/ui/components`                         | Directorio destino para entregables "component"           |
| `blockDir`           | `src/ui/blocks`                             | Directorio destino para entregables "block"               |
| `themeDir`           | `src/ui/themes`                             | Directorio destino para entregables "theme"               |
| `defaultMode`        | `package`                                   | Modo de instalación: "package" o "source"                 |

## Comandos principales

| Comando                       | Descripción                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| `solidiom init`               | Inicializa `.solidiom/config.json` en el proyecto actual                   |
| `solidiom add <primitivo>`    | Agrega un primitivo en modo paquete o código fuente                        |
| `solidiom create <nombre>`    | Genera un nuevo proyecto desde una plantilla                               |
| `solidiom plan <primitivo>`   | Resuelve el grafo de capacidades y emite un plan JSON                      |
| `solidiom verify <artefacto>` | Verifica firmas de artefactos según la política                            |
| `solidiom diff`               | Muestra cambios entre el código fuente instalado y el registro             |
| `solidiom update <primitivo>` | Actualiza primitivos instalados como código fuente                         |
| `solidiom detach <primitivo>` | Desvincula un primitivo de actualizaciones upstream                        |
| `solidiom doctor`             | Verifica la salud de la configuración del proyecto                         |
| `solidiom inspect`            | Inspecciona primitivos instalados (código fuente, manifiesto, procedencia) |
| `solidiom audit`              | Genera SBOM CycloneDX 1.5 e inventario de licencias                        |

## Modos de instalación

### Modo paquete

En el modo `package`, la CLI resuelve las dependencias del primitivo y genera el comando de instalación npm correspondiente. Los archivos del primitivo permanecen en `node_modules`.

```bash
solidiom add dialog
```

### Modo código fuente

En el modo `source`, la CLI materializa los archivos fuente del primitivo directamente en tu proyecto, reescribe las importaciones, y actualiza el lockfile `.solidiom/lock.json`.

```bash
solidiom add dialog --mode source
```

## Política de seguridad

El archivo opcional `.solidiom/policy.json` controla la verificación de firmas y las restricciones de versiones:

| Clave                       | Valor predeterminado | Descripción                                                  |
| --------------------------- | -------------------- | ------------------------------------------------------------ |
| `signatureMode`             | `none`               | Modo de verificación: "sigstore", "trusted-keys", "none"     |
| `allowedPrimitiveVersions`  | `{}`                 | Restricciones de versiones permitidas por paquete            |
| `trustedIdentities`         | `[]`                 | Identidades confiables para verificación sigstore            |
| `registrySignatureRequired` | `false`              | Si el registro requiere firma                                |
| `requireVerifiedSource`     | `true`               | Si las instalaciones de código fuente requieren verificación |

## Salida JSON

La mayoría de los comandos soportan la bandera `--json` para una salida estructurada:

```bash
solidiom plan dialog --json
solidiom add select --json
solidiom doctor --json
```

## Variables de entorno

| Variable                 | Descripción                                 |
| ------------------------ | ------------------------------------------- |
| `SOLIDIOM_REGISTRY_PATH` | Ruta personalizada al catálogo del registro |
| `REGISTRY_VERIFY_KEY`    | Clave HMAC para verificación del registro   |

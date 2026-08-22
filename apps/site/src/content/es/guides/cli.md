---
contentSchemaVersion: 1
title: "Referencia del CLI"
description: "Referencia de la interfaz de línea de comandos de solidiom."
keywords: [cli, commands, create, add, plan, inspect, guide]
locale: es
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
translationSourceHash: "c70c45f4ca568d4689bcc0c001988ad85f31fea1774e073ec98f73405828dcc2"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Referencia del CLI

El CLI `solidiom` inicializa proyectos, resuelve e instala entregables, genera plantillas, inspecciona instalaciones de código fuente y verifica artefactos o el catálogo del registro.

## Instalación

El paquete publicado es `@solidiom/cli`:

```sh
npm install -g @solidiom/cli
```

También puedes ejecutarlo sin una instalación global:

```sh
npx @solidiom/cli --help
```

El ejecutable instalado por el paquete se llama `solidiom`.

## Comandos

### `solidiom init`

Crea o inicializa `.solidiom/config.json` en el proyecto actual.

### `solidiom plan <primitive>`

Resuelve un entregable y muestra los paquetes o archivos planeados sin instalarlos ni escribirlos.

```sh
solidiom plan button
solidiom plan dialog --styling css --no-network
```

### `solidiom add <primitive>`

Agrega una primitiva u otro entregable compatible. El modo paquete es el predeterminado y muestra el comando del gestor de paquetes; usa `--install` para ejecutarlo. Usa `--mode source` para materializar archivos de código fuente.

```sh
solidiom add button
solidiom add dialog --styling tailwind --install
solidiom add dialog --mode source
```

Las opciones relevantes incluyen `--mode`, `--registry`, `--no-network`, `--deliverable`, `--styling`, `--package-manager`, `--install`, `--allow-unverified`, `--force`, `--diff`, `--dry-run` y `--json`.

### `solidiom create <name>`

Genera una de las plantillas disponibles. El nombre del proyecto es un argumento posicional obligatorio. En ejecuciones no interactivas también se requiere `--template`.

```sh
solidiom create my-app --template vite-solid-router --yes
solidiom create my-app --template tanstack-start-solid --styling tailwind --yes
```

### `solidiom inspect <subcommand> [primitive]`

Inspecciona código fuente instalado, manifiestos, archivos, explicaciones o procedencia. Ejecuta `solidiom inspect --help` para consultar los subcomandos disponibles.

### `solidiom diff [--primitive <name>]`

Muestra cambios entre archivos instalados en modo fuente y sus resúmenes del lockfile.

```sh
solidiom diff
solidiom diff --primitive dialog
```

### `solidiom detach <primitive>`

Desconecta una primitiva instalada en modo fuente de las actualizaciones ascendentes.

### `solidiom update <primitive>`

Actualiza una primitiva instalada en modo fuente desde el origen.

### `solidiom doctor`

Comprueba la salud de la configuración del proyecto y de las instalaciones de código fuente.

### `solidiom verify`

Verifica un artefacto según la política configurada. Se requiere una ruta de artefacto salvo que se use `--registry`.

```sh
solidiom verify ./dist/dialog.tgz --no-network
solidiom verify --registry
```

Usa `--json` para obtener una salida legible por máquinas. No existe una opción `--fix`.

### `solidiom audit`

Genera el SBOM CycloneDX y el inventario de licencias del CLI.

## Configuración

La configuración del proyecto vive en `.solidiom/config.json`. Los campos compatibles son:

- `positioningAdapter`
- `sourceDir`
- `runtimeDir`
- `componentDir`
- `blockDir`
- `themeDir`
- `defaultMode` (`package` o `source`)
- `stylingProfile` (`css`, `tailwind` o `unocss`)

La configuración de firmas y verificación del registro vive por separado en `.solidiom/policy.json`.

## Operación sin conexión

Usa `--no-network` con los comandos que resuelven datos del registro cuando debas desactivar el acceso a la red. `--registry` selecciona el origen del registro; no define un campo de configuración del proyecto.

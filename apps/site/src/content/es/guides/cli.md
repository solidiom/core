---
contentSchemaVersion: 1
title: "CLI Reference"
description: "Complete reference for the solidiom command-line interface."
keywords: [cli, commands, create, add, plan, inspect, guide]
locale: es
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
translationSourceHash: "c70c45f4ca568d4689bcc0c001988ad85f31fea1774e073ec98f73405828dcc2"
translationStatus: draft
---

# Referencia del CLI

El CLI `solidiom` gestiona proyectos, instala componentes y verifica tu espacio de trabajo.

## Instalación

```sh
npm install -g solidiom
```

O usa npx para comandos puntuales:

```sh
npx solidiom <command>
```

## Comandos

### `solidiom create`

Crea un nuevo proyecto a partir de una plantilla.

```sh
solidiom create my-app --template saas-dashboard
solidiom create my-app --template ai-chat --styling tailwind
solidiom create my-app --yes  # skip prompts
```

**Opciones:**

- `--template <name>` — plantilla a usar (29 disponibles)
- `--styling <profile>` — css, tailwind o unocss
- `--package-manager <pm>` — npm, pnpm, yarn o bun
- `--yes` — omitir todas las preguntas, usar valores por defecto

### `solidiom add`

Agrega un primitivo o componente a tu proyecto.

```sh
solidiom add button
solidiom add dialog --styling tailwind
solidiom add --theme ocean
```

**Opciones:**

- `--styling <profile>` — sobrescribir el perfil de estilizado del proyecto
- `--theme <name>` — instalar un preset de tema
- `--source` — instalar archivos fuente en lugar de dependencia de paquete

### `solidiom plan`

Previsualiza lo que `add` instalaría sin hacer cambios.

```sh
solidiom plan button
solidiom plan dialog --styling css
```

### `solidiom inspect`

Muestra información detallada sobre un primitivo o componente.

```sh
solidiom inspect button
solidiom inspect dialog --json
```

### `solidiom verify`

Verifica la integridad del espacio de trabajo contra el registro.

```sh
solidiom verify
solidiom verify --fix  # auto-fix recoverable issues
```

### `solidiom diff`

Muestra las diferencias entre las versiones instaladas y las del registro.

```sh
solidiom diff
solidiom diff button
```

## Configuración

La configuración del proyecto vive en `.solidiom/config.json`:

```json
{
  "stylingProfile": "tailwind",
  "theme": "ocean",
  "registry": "https://registry.solidiom.org"
}
```

## Soporte de Gestores de Paquetes

Todos los comandos funcionan con npm, pnpm, Yarn y Bun. El CLI detecta tu gestor de paquetes a partir de los archivos de lock automáticamente.

## Modo Offline

El CLI soporta operación offline a través de la instantánea local del registro. Usa `--offline` para forzar resolución local sin solicitudes de red.

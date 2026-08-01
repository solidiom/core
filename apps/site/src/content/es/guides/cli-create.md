---
contentSchemaVersion: 1
title: "Crear un proyecto desde una plantilla"
description: "Cómo generar un nuevo proyecto Solidiom desde una plantilla con solidiom create, incluyendo opciones de estilo, gestor de paquetes, y validaciones de seguridad."
keywords: [create, crear, plantilla, proyecto, scaffolding, template, solidiom]
locale: es
maturity: beta
order: 4
audience: beginner
translationSourceHash: "8c72f83c6f76013984ff35139bac3982062ff93aec41b0c150a141d5333aca29"
translationStatus: draft
---

# Crear un proyecto desde una plantilla

El comando `solidiom create` genera un nuevo proyecto desde una plantilla, con configuraciones de Solidiom ya integradas. Es la forma más rápida de comenzar con Solidiom.

## Uso interactivo

```bash
solidiom create
```

La CLI solicitará de forma interactiva:

1. Plantilla a utilizar
2. Nombre del proyecto
3. Perfil de estilo

## Uso no interactivo

Para saltar los prompts, pasa todos los valores necesarios como banderas y usa `--yes`:

```bash
solidiom create my-app --template vite-solid-router --yes
```

La bandera `--yes` exige que todos los valores requeridos estén presentes. Si falta alguno, el comando falla explícitamente.

## Plantillas disponibles

Las plantillas incluyen configuraciones predefinidas con frameworks específicos:

- `vite-solid-router` — proyecto con Vite y solid-router

Para usar una plantilla específica:

```bash
solidiom create my-app --template vite-solid-router --yes
```

## Perfil de estilo

Selecciona el perfil de estilo del proyecto:

```bash
solidiom create my-app --template vite-solid-router --styling tailwind --yes
solidiom create my-app --template vite-solid-router --styling css --yes
solidiom create my-app --template vite-solid-router --styling unocss --yes
```

Los valores válidos son `css`, `tailwind`, y `unocss`.

## Gestor de paquetes

Puedes especificar el gestor de paquetes para la instalación de dependencias:

```bash
solidiom create my-app --template vite-solid-router --package-manager pnpm --yes
```

Si no se especifica, la CLI detecta automáticamente el gestor del entorno actual.

## Saltar la instalación de dependencias

Por defecto, `solidiom create` ejecuta la instalación de dependencias después de generar los archivos. Para omitir este paso:

```bash
solidiom create my-app --template vite-solid-router --yes --no-install
```

## Directorios no vacíos

Si el directorio de destino ya existe y no está vacío, la CLI se bloquea. Usa `--force` para sobrescribir:

```bash
solidiom create my-app --template vite-solid-router --yes --force
```

## Validaciones de seguridad

`solidiom create` aplica varias verificaciones de seguridad en el directorio de destino:

- El destino no puede escapar del directorio de trabajo actual
- El destino no puede ser el directorio home del usuario
- El destino no puede ser la raíz del sistema de archivos
- El destino no puede ser la raíz de un monorepo existente

Estas protecciones son intencionales y no se pueden desactivar con `--force`.

## Nombre del proyecto

El nombre del proyecto debe cumplir con las reglas de nomenclatura de paquetes npm:

- Minúsculas
- Solo caracteres `[a-z0-9-._~]`
- No puede comenzar con "." o "_"
- Máximo 214 caracteres
- Soporta nombres con ámbito: `@mi-org/mi-app`

## Limpieza tras cancelación

Si cancelas el proceso interactivo con Ctrl+C, la CLI limpia cualquier archivo generado, sin dejar rastros en el disco.

## Configuración generada

Después de crear el proyecto, se genera automáticamente `.solidiom/config.json` con:

- `stylingProfile` configurado según tu selección
- Rutas de instalación según los valores predeterminados
- El modo de instalación predeterminado

## Salida JSON

```bash
solidiom create my-app --template vite-solid-router --yes --json
```

## Opciones

| Bandera | Descripción |
|---------|-------------|
| `--template <nombre>` | Plantilla para generar |
| `--styling <css\|tailwind\|unocss>` | Perfil de estilo |
| `--package-manager <npm\|pnpm\|yarn\|bun>` | Gestor de paquetes |
| `--no-install` | Saltar la instalación de dependencias |
| `--yes` | Saltar todos los prompts; fallar si falta un valor requerido |
| `--force` | Permitir generar en un directorio de destino no vacío |
| `--json` | Salida en formato JSON |
---
contentSchemaVersion: 1
title: "Inicializar un proyecto"
description: "Cómo inicializar la configuración de Solidiom en un proyecto existente con solidiom init, incluyendo valores predeterminados y opciones."
keywords: [init, inicializar, configuración, config.json, proyecto, solidiom]
locale: es
maturity: beta
order: 2
audience: beginner
translationSourceHash: "5648be89ffad3aac51fc8440a8aa97376a18bca9a623b008c4f639f6068f6921"
translationStatus: draft
---

# Inicializar un proyecto

El comando `solidiom init` crea la configuración base que la CLI necesita para operar en tu proyecto. Ejecútalo una vez al comenzar a trabajar con primitivos de Solidiom.

## Uso básico

```bash
solidiom init
```

Esto crea:

- El directorio `.solidiom/`
- El archivo `.solidiom/config.json` con valores predeterminados

## Archivo de configuración

El contenido de `.solidiom/config.json` después de una inicialización:

```json
{
  "positioningAdapter": "@solidiom/adapter-positioning-floating-ui",
  "sourceDir": "src/ui/primitives",
  "runtimeDir": "src/ui/_runtime",
  "componentDir": "src/ui/components",
  "blockDir": "src/ui/blocks",
  "themeDir": "src/ui/themes",
  "defaultMode": "package"
}
```

Las claves principales incluyen:

- `positioningAdapter`: adaptador de posicionamiento para primitivos como popover y tooltip
- `componentDir`: directorio de destino para componente entregables
- `defaultMode`: modo de instalación predeterminado (package o source)

El registro se configura como fuente de verdad para la resolución de primitivos.

## Reescribir configuración existente

Si ya existe un `.solidiom/config.json`, el comando informa que la configuración está presente y no realiza cambios:

```bash
solidiom init
# Config already exists at .solidiom/config.json
```

Para reescribir el archivo con los valores predeterminados:

```bash
solidiom init --force
```

## Salida JSON

```bash
solidiom init --json
```

Devuelve un objeto con la ruta del archivo de configuración, si fue creado, y el contenido actual:

```json
{
  "configPath": ".solidiom/config.json",
  "created": true,
  "config": {
    "positioningAdapter": "@solidiom/adapter-positioning-floating-ui",
    "sourceDir": "src/ui/primitives",
    "runtimeDir": "src/ui/_runtime",
    "componentDir": "src/ui/components",
    "blockDir": "src/ui/blocks",
    "themeDir": "src/ui/themes",
    "defaultMode": "package"
  }
}
```

## Opciones

| Bandera   | Descripción                          |
| --------- | ------------------------------------ |
| `--force` | Reescribe la configuración existente |
| `--json`  | Salida en formato JSON               |

## Archivo de política

`.solidiom/policy.json` es opcional. Si existe, controla las restricciones de verificación y versiones del registro:

```json
{
  "allowedVersions": {},
  "registrySignatureRequired": false,
  "registryTrustedKeys": []
}
```

## Personalizar la configuración

Después de ejecutar `solidiom init`, puedes editar manualmente `.solidiom/config.json` para ajustar los valores:

```json
{
  "sourceDir": "src/components/ui",
  "runtimeDir": "src/lib/ui-runtime",
  "defaultMode": "source"
}
```

### Clave `stylingProfile`

La clave `stylingProfile` permite definir el perfil de estilo del proyecto. Los valores válidos son `css`, `tailwind`, y `unocss`. Esta clave es opcional y se configura durante la creación del proyecto:

```json
{
  "stylingProfile": "tailwind"
}
```

## Verificar la configuración

Usa `solidiom doctor` para verificar que la configuración sea válida:

```bash
solidiom doctor
```

Esto valida que `.solidiom/config.json` se ajuste al esquema esperado y reporta cualquier problema.

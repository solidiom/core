---
contentSchemaVersion: 1
title: "Planificar la instalación de un primitivo"
description: "Cómo usar solidiom plan para resolver el grafo de capacidades de un primitivo, validar contra políticas, y obtener un plan estructurado antes de instalar."
keywords: [plan, planificar, grafo de capacidades, dependencias, política, primitivo, resolución]
locale: es
maturity: beta
order: 5
audience: intermediate
translationSourceHash: "e33ba424429e4d2a27865cb25b01fd43977fe306da8ed2ecf4f81ab28b6eb567"
translationStatus: draft
---

# Planificar la instalación de un primitivo

El comando `solidiom plan` resuelve el grafo de capacidades de un primitivo y emite un plan detallado con todas las dependencias necesarias, sus versiones, y cualquier violación de política. Es útil para inspeccionar qué se instalará antes de ejecutar `solidiom add`.

## Uso básico

```bash
solidiom plan dialog
```

Salida:

```
Plan for dialog (package mode):

  @solidiom/dialog@0.0.1-next.0 [requested]
  @solidiom/runtime@0.0.1-next.0 [dependency]

2 packages resolved.
```

## Salida JSON

Para integrar la planificación en scripts o pipelines:

```bash
solidiom plan dialog --json
```

```json
{
  "primitive": "dialog",
  "mode": "package",
  "entries": [
    {
      "package": "@solidiom/dialog",
      "version": "0.0.1-next.0",
      "isAdapter": false,
      "reason": "requested"
    },
    {
      "package": "@solidiom/runtime",
      "version": "0.0.1-next.0",
      "isAdapter": false,
      "reason": "dependency"
    }
  ],
  "stylingOutputs": [],
  "violations": []
}
```

## Modo de instalación

El modo se determina por la bandera `--mode` o por el valor de `defaultMode` en `.solidiom/config.json`:

```bash
solidiom plan dialog --mode source
solidiom plan select --mode package
```

## Primitivos con adaptadores

Algunos primitivos requieren adaptadores adicionales para capacidades específicas:

```bash
solidiom plan select
```

```
Plan for select (package mode):

  @solidiom/select@0.0.1-next.0 [requested]
  @solidiom/runtime@0.0.1-next.0 [dependency]
  @solidiom/adapter-positioning-floating-ui@0.0.1-next.0 [adapter]

3 packages resolved.
```

Los adaptadores aparecen marcados como `[adapter]` con la razón `capability`.

## Entregables del nivel de producto

Verifica si un primitivo soporta un entregable específico:

```bash
solidiom plan button --deliverable component
```

Si el primitivo no declara el entregable solicitado, se reporta como violación:

```
Policy violations:
  "button" does not declare the "component" deliverable (available: primitive)
```

Los entregables válidos son: `primitive`, `component`, `block`, `template`, `theme`.

## Perfiles de estilo

Verifica los perfiles de estilo disponibles para un primitivo:

```bash
solidiom plan button --styling tailwind
```

Si el primitivo no soporta el perfil solicitado:

```
Policy violations:
  "button" has no "tailwind" styling output (available: none)
```

Los perfiles válidos son: `css`, `tailwind`, `unocss`.

## Resolución de versiones

La CLI resuelve las versiones reales siguiendo esta prioridad:

1. Catálogo del registro (`registry/index.json`)
2. Paquetes en `node_modules`
3. Paquetes del monorepo (en desarrollo)
4. Conocimiento incorporado de primitivos principales para escenarios sin conexión

## Verificación contra política

Si `.solidiom/policy.json` define restricciones de versiones, `solidiom plan` valida cada entrada:

```json
{
  "allowedPrimitiveVersions": {
    "@solidiom/dialog": "^0.0.1"
  }
}
```

```bash
solidiom plan dialog
# Policy violations:
#   @solidiom/dialog@0.0.2-next.0 not allowed by policy (requires ^0.0.1)
```

Cuando hay violaciones, el comando sale con código 1.

## Registro personalizado

Para usar un registro personalizado o un catálogo local:

```bash
solidiom plan dialog --registry /path/to/local/registry
```

También puedes usar la variable de entorno `SOLIDIOM_REGISTRY_PATH`:

```bash
export SOLIDIOM_REGISTRY_PATH=/path/to/local/registry
solidiom plan dialog
```

## Modo sin conexión

```bash
solidiom plan dialog --no-network
```

La bandera `--no-network` asegura que la resolución ocurra solo con datos locales: el catálogo del registro en disco, los paquetes en `node_modules`, o el conocimiento incorporado de primitivos principales.

## Primitivos incorporados

La CLI conoce los siguientes primitivos principales para resolución sin conexión:

- `dialog`, `select`, `calendar`, `carousel`
- `popover`, `tooltip`, `menu`, `combobox`
- `date-picker`, `button`, `checkbox`, `switch`
- `slider`, `accordion`, `tabs`, `collapsible`
- `toast`, `listbox`

## Opciones

| Bandera                             | Descripción                          |
| ----------------------------------- | ------------------------------------ |
| `--mode <package\|source>`          | Modo de instalación                  |
| `--deliverable <tipo>`              | Entregable del nivel de producto     |
| `--styling <css\|tailwind\|unocss>` | Perfil de estilo                     |
| `--registry <url>`                  | URL del registro personalizado       |
| `--no-network`                      | Usar solo datos locales del registro |
| `--json`                            | Salida en formato JSON               |

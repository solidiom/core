---
contentSchemaVersion: 1
title: "Comparar y actualizar instalaciones de código fuente"
description: "Cómo usar solidiom diff y solidiom update para comparar cambios locales y actualizar primitivos instalados como código fuente, con fusión de tres vías y manejo de conflictos."
keywords: [diff, update, actualizar, comparar, fusión, conflictos, código fuente, lockfile]
locale: es
maturity: beta
order: 7
audience: intermediate
translationSourceHash: "c29920805312b9afe82cbf4b97e741d4af65dcf7ef2c0db8299088db5aae2f75"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Comparar y actualizar instalaciones de código fuente

Cuando instalas primitivos en modo `source`, los archivos viven en tu proyecto y pueden modificarse localmente. Los comandos `solidiom diff` y `solidiom update` te ayudan a rastrear cambios y actualizar desde upstream de forma segura.

## Comparar cambios con diff

`solidiom diff` compara los archivos instalados contra los dígitos almacenados en `.solidiom/lock.json`:

```bash
solidiom diff
```

Salida:

```
  M src/ui/primitives/dialog/Dialog.tsx
  D src/ui/primitives/dialog/utils.ts
```

- `M` — archivo modificado localmente
- `D` — archivo eliminado
- `A` — archivo nuevo

Para filtrar por primitivo:

```bash
solidiom diff --primitive dialog
```

Sin cambios:

```bash
solidiom diff
# No local modifications.
```

## Actualizar primitivos

`solidiom update` actualiza un primitivo a la versión upstream más reciente usando un algoritmo de fusión de tres vías:

```bash
solidiom update dialog
```

### Algoritmo de fusión

La fusión compara tres estados:

1. **Base** — el dígito original registrado en `.solidiom/lock.json`
2. **Local** — el contenido actual del archivo (posiblemente modificado por el usuario)
3. **Upstream** — la nueva versión del registro o monorepo

La matriz de decisiones:

| Local       | Upstream    | Acción                                                           |
| ----------- | ----------- | ---------------------------------------------------------------- |
| Sin cambios | Cambiado    | Sobrescribir con upstream (actualización segura)                 |
| Cambiado    | Sin cambios | Mantener local (la versión del usuario es más reciente)          |
| Cambiado    | Cambiado    | Intentar fusión línea por línea, o escribir archivo de conflicto |
| Sin cambios | Sin cambios | Omitir                                                           |

### Estados de actualización

| Estado              | Descripción                                                |
| ------------------- | ---------------------------------------------------------- |
| `updated`           | Archivo sobrescrito con versión upstream                   |
| `merged`            | Fusión limpia sin conflictos                               |
| `conflict`          | Ambos lados cambiaron lo mismo; requiere resolución manual |
| `skipped-detached`  | Archivo desvinculado; se omite                             |
| `skipped-unchanged` | Sin cambios en upstream                                    |
| `skipped-deleted`   | Archivo eliminado localmente                               |

Salida:

```
  ↑ src/ui/primitives/dialog/Dialog.tsx
  ⇄ src/ui/primitives/dialog/Context.tsx (auto-merged)
  ⚡ src/ui/primitives/dialog/Overlay.tsx (CONFLICT)
  ○ src/ui/primitives/dialog/Custom.tsx (detached)

3 files updated.
1 conflicts - resolve manually:
  • src/ui/primitives/dialog/Overlay.tsx
    Compare: Overlay.tsx.local vs Overlay.tsx.upstream
```

### Ejecución simulada

```bash
solidiom update dialog --dry-run
```

Muestra los cambios que se aplicarían sin escribir archivos.

## Manejo de conflictos

Cuando ambos lados modifican las mismas líneas, `solidiom update` genera marcadores de conflicto estilo diff3:

```
<<<<<<< local
  contenido local
=======
  contenido upstream
>>>>>>> upstream
```

Además, crea archivos de referencia:

- `<archivo>.local` — versión local
- `<archivo>.upstream` — versión upstream

Resuelve el conflicto manualmente y elimina los archivos `.local` y `.upstream` cuando termines.

## Archivos desvinculados

Los archivos marcados como "detached" se omiten durante `solidiom update`. Para desvincular un primitivo:

```bash
solidiom detach dialog
```

Esta operación solo actualiza los metadatos de `.solidiom/lock.json`; no modifica ni elimina archivos.

## Reescritura de importaciones

Durante la actualización, las importaciones se reescriben automáticamente para reflejar la configuración actual del proyecto:

- Los archivos `.tsx` y `.jsx` usan transformación AST con ts-morph para preservar la estructura
- Los demás archivos usan reescritura basada en expresiones regulares
- Si la transformación AST falla, se usa el método de respaldo basado en expresiones regulares

## Lockfile

Después de una actualización exitosa, `.solidiom/lock.json` se actualiza con los nuevos dígitos y versiones. El archivo lockfile mantiene el registro de:

- `digest` — SHA-256 del contenido original
- `version` — versión en el momento de instalación
- `detached` — si el archivo está desvinculado
- `manifestFilesHash` — hash de integridad del manifiesto del registro
- `verifiedAt` — marca de tiempo de verificación
- `provenance` — "verified" o "unverified"

## Salida JSON

```bash
solidiom diff --json
solidiom update dialog --json
```

## Opciones de diff

| Bandera                | Descripción                     |
| ---------------------- | ------------------------------- |
| `--primitive <nombre>` | Filtrar por nombre de primitivo |
| `--json`               | Salida en formato JSON          |

## Opciones de update

| Bandera     | Descripción                  |
| ----------- | ---------------------------- |
| `--dry-run` | Mostrar cambios sin escribir |
| `--json`    | Salida en formato JSON       |

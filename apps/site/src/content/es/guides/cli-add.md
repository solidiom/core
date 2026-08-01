---
contentSchemaVersion: 1
title: "Agregar un primitivo"
description: "Cómo agregar primitivos a tu proyecto con solidiom add en modo paquete o código fuente, incluyendo opciones de entregables, perfiles de estilo, y verificación."
keywords: [add, agregar, primitivo, instalación, paquete, código fuente, entregable, styling]
locale: es
maturity: beta
order: 3
audience: intermediate
translationSourceHash: "5573c4e633971e8ef485b9d59b447d7ffa3f5ba5b0746c385251c5803a323715"
translationStatus: draft
---

# Agregar un primitivo

El comando `solidiom add` es la principal forma de incorporar primitivos de Solidiom en tu proyecto. Resuelve el grafo de dependencias, aplica restricciones de política, y ejecuta la instalación en el modo seleccionado.

## Modo paquete

Por defecto, `solidiom add` opera en modo `package`. Resuelve las dependencias del primitivo y genera el comando de instalación del gestor de paquetes:

```bash
solidiom add dialog
# pnpm add @solidiom/dialog@0.0.1-next.0 @solidiom/runtime@0.0.1-next.0
```

Para ejecutar automáticamente la instalación:

```bash
solidiom add dialog --install
```

Puedes forzar un gestor de paquetes específico:

```bash
solidiom add dialog --install --package-manager yarn
```

## Modo código fuente

En modo `source`, la CLI materializa los archivos fuente del primitivo directamente en el proyecto, en lugar de instalarlos como paquetes npm:

```bash
solidiom add dialog --mode source
# Installed 3 source files
#   src/ui/primitives/dialog/Dialog.tsx
#   src/ui/primitives/dialog/index.tsx
#   src/ui/_runtime/hooks.ts
```

Los archivos se colocan según la configuración en `.solidiom/config.json`:

- `sourceDir`: directorio para los archivos del primitivo
- `runtimeDir`: directorio para el código compartido de runtime
- `componentDir`: directorio para entregables "component"
- `blockDir`: directory para entregables "block"
- `themeDir`: directorio para entregables "theme"

El modo de instalación también se puede definir globalmente en `config.json` mediante `defaultMode`.

## Entregables del nivel de producto

Algunos primitivos ofrecen múltiples niveles de entregable: `primitive`, `component`, `block`, `template`, `theme`. Usa `--deliverable` para seleccionar uno específico:

```bash
solidiom add button --deliverable component
solidiom add dialog --deliverable block
```

## Perfiles de estilo

Si el primitivo soporta múltiples perfiles de estilo, puedes seleccionar uno con `--styling`:

```bash
solidiom add button --styling tailwind
solidiom add button --styling css
solidiom add button --styling unocss
```

## Ejecución simulada

La bandera `--dry-run` muestra lo que se haría sin escribir archivos:

```bash
solidiom add dialog --mode source --dry-run
```

## Verificación de código fuente

Por defecto, las instalaciones de código fuente requieren verificación a nivel de byte contra el manifiesto del registro. Si la verificación falla, puedes proceder de forma explícita:

```bash
solidiom add dialog --mode source --allow-unverified
```

Cuando se usa `--allow-unverified`, la procedencia se registra como `unverified` en `.solidiom/lock.json`.

## Conflictos de archivos locales

Si un archivo instalado previamente fue modificado localmente, una nueva instalación se bloquea para evitar sobrescribir cambios:

```bash
solidiom add button --deliverable component
# Blocked - locally modified files would be overwritten:
#   src/ui/components/Button.tsx
```

Opciones para manejar el conflicto:

- `--force`: sobrescribe los archivos modificados localmente
- `--diff`: muestra un diff unificado de los cambios pendientes sin escribir

```bash
solidiom add button --deliverable component --force
solidiom add button --deliverable component --diff
```

## Registro personalizado y modo sin conexión

Para entornos sin acceso a Internet o con un registro privado:

```bash
solidiom add dialog --registry http://localhost:4873 --no-network
```

La bandera `--no-network` asegura que la CLI no intente solicitudes de red externas. Toda la resolución ocurre contra el catálogo local del registro.

## Bloqueo por política

Si la política `.solidiom/policy.json` restringe las versiones de los primitivos, y el plan resuelve una versión no permitida, la instalación se bloquea:

```bash
solidiom add dialog
# Blocked by policy violations:
#   @solidiom/dialog@0.0.2-next.0 not allowed by policy (requires ^0.0.1)
```

## Salida JSON

```bash
solidiom add dialog --json
```

## Opciones

| Bandera | Descripción |
|---------|-------------|
| `--mode <package\|source>` | Modo de instalación |
| `--deliverable <tipo>` | Entregable del nivel de producto (primitive, component, block, template, theme) |
| `--styling <css\|tailwind\|unocss>` | Perfil de estilo |
| `--package-manager <npm\|pnpm\|yarn\|bun>` | Gestor de paquetes (detectado automáticamente si se omite) |
| `--install` | Ejecutar la instalación automáticamente en lugar de solo imprimir el comando |
| `--allow-unverified` | Proceder con instalación de código fuente sin verificación |
| `--force` | Sobrescribir archivos modificados localmente |
| `--diff` | Mostrar diff unificado de cambios pendientes sin escribir |
| `--dry-run` | Mostrar acciones sin escribir archivos |
| `--registry <url>` | URL del registro personalizado |
| `--no-network` | Usar solo datos locales del registro |
| `--json` | Salida en formato JSON |
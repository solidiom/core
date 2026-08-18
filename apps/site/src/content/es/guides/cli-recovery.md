---
contentSchemaVersion: 1
title: "Recuperación de fallos y operaciones sin conexión"
description: "Cómo gestionar fallos de instalación, recuperación con rollback, operación sin conexión, y configuración de registro privado para entornos air-gapped."
keywords:
  [recuperación, rollback, sin conexión, offline, air-gapped, registro privado, fallos, integridad]
locale: es
maturity: beta
order: 8
audience: intermediate
translationSourceHash: "afd97254da709b98cd792db911527d59e5c57daa8609c48e203661b625942c0c"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Recuperación de fallos y operaciones sin conexión

La CLI de Solidiom incluye mecanismos de recuperación para fallos durante la instalación y soporte completo para entornos sin acceso a Internet.

## Rollback de instalaciones de código fuente

Durante una instalación de código fuente, la CLI registra el contenido de cada archivo antes de escribirlo. Si la instalación falla, puedes restaurar el estado anterior.

El journal de rollback funciona así:

1. Antes de escribir un archivo, se registra su contenido actual (o la ausencia del archivo)
2. Si la instalación falla, se restaura cada archivo en orden inverso
3. Los archivos que no existían antes de la instalación se eliminan
4. Los archivos existentes recuperan su contenido original

Esto asegura que un fallo parcial nunca deje el proyecto en un estado inconsistente.

### Resolución de conflictos

Si un archivo fue modificado localmente, puedes usar estas opciones:

```bash
solidiom add dialog --mode source --diff    # ver los cambios pendientes
solidiom add dialog --mode source --force   # sobrescribir archivos locales
```

El rollback actúa como un signal de seguridad: si algo falla, el estado anterior se restaura completamente sin intervención manual.

## Creación de proyectos y limpieza

`solidiom create` usa un journal de limpieza similar:

- Si el usuario cancela con Ctrl+C durante la generación, solo se eliminan los directorios creados por esa ejecución
- Los directorios que ya existían antes de la invocación nunca se eliminan
- Si la instalación de dependencias falla, se limpian todos los archivos generados

```bash
solidiom create my-app --template vite-solid-router
# Ctrl+C durante la ejecución
# Create cancelled - no files left behind.
```

## Operación sin conexión

La CLI funciona completamente sin conexión cuando se configura correctamente:

### Resolución sin conexión

La resolución de primitivos sigue esta cadena de prioridad:

1. Catálogo del registro local (`registry/index.json`)
2. Paquetes en `node_modules`
3. Conocimiento incorporado de primitivos principales

Con la bandera `--no-network`, la CLI no realiza solicitudes de red:

```bash
solidiom plan dialog --no-network
solidiom add dialog --mode source --no-network
solidiom verify ./dist/dialog.tgz --no-network
```

### Primitivos incorporados

La CLI incluye conocimiento de los primitivos principales para escenarios de arranque sin conexión:

- `dialog`, `select`, `calendar`, `carousel`
- `popover`, `tooltip`, `menu`, `combobox`
- `date-picker`, `button`, `checkbox`, `switch`
- `slider`, `accordion`, `tabs`, `collapsible`
- `toast`, `listbox`

Estos primitivos incorporados solo confirman el entregable `primitive` y no declaran soporte de estilo ni de nivel de producto no verificado.

## Instalación en entorno air-gapped

Para desplegar Solidiom en un entorno sin acceso a Internet, sigue estos pasos.

### Paso 1: Espejar paquetes en un registro privado

En una máquina con acceso a Internet, usa Verdaccio como proxy:

```bash
npx verdaccio --config ./verdaccio-config.yaml &

until curl -s http://localhost:4873 > /dev/null; do sleep 1; done

pnpm add @solidiom/runtime @solidiom/dialog @solidiom/select \
  --registry http://localhost:4873 \
  --ignore-workspace
```

O publica los artefactos del monorepo directamente:

```bash
pnpm --filter "@solidiom/*" -r exec pnpm pack
for tarball in packages/*/solidiom-*.tgz; do
  npm publish "$tarball" --registry http://localhost:4873
done
```

Copia el directorio `./storage` de Verdaccio al entorno sin conexión.

### Paso 2: Espejar el catálogo del registro

El catálogo del registro (`index.json`) es necesario para la resolución de dependencias:

```bash
cp registry/index.json /path/to/internal-cdn/solidiom/registry/index.json
```

O servido desde el directorio de almacenamiento de Verdaccio:

```bash
cp registry/index.json ./verdaccio-storage/@solidiom/registry/index.json
```

### Paso 3: Configurar el registro interno

En el proyecto del entorno sin conexión, configura `.solidiom/config.json` o usa la variable de entorno:

```bash
export SOLIDIOM_REGISTRY_PATH=/path/to/local/registry
```

### Paso 4: Instalar primitivos

Con Verdaccio ejecutándose localmente y el catálogo en su lugar:

```bash
npx verdaccio --config ./verdaccio-config.yaml &

solidiom add dialog --registry http://localhost:4873 --no-network
solidiom add select --registry http://localhost:4873 --no-network
solidiom add calendar --registry http://localhost:4873 --no-network
```

### Verificación

```bash
solidiom plan dialog --registry http://localhost:4873 --no-network --json
ls node_modules/@solidiom/dialog
ls node_modules/@solidiom/runtime
pnpm build
```

## Procedencia de instalaciones

El lockfile `.solidiom/lock.json` registra la procedencia de cada instalación:

- `verified` — la instalación pasó la verificación contra el manifiesto del registro
- `provenance: "unverified"` — la instalación se realizó con `--allow-unverified`

Puedes verificar la procedencia con:

```bash
solidiom inspect provenance
solidiom verify --registry
solidiom doctor
```

Para inspeccionar el plan de resolución de dependencias:

```bash
solidiom plan --json
```

`solidiom doctor` reporta entradas no verificadas como advertencias:

```
solidiom doctor
  source-install provenance (3 unverified entries in lock.json)
```

## Registro dañado o no confiable

Si un archivo de registro existe pero no pasa la validación del esquema, la CLI no lo ignora silenciosamente. En lugar de caer al siguiente candidato, reporta un error. Un registro no confiable o corrupto no se trata como "ausente".

La configuración de `.solidiom/policy.json` determina qué nivel de verificación es requerido para cada entorno.

## Referencia

Consulta `tools/offline-fixture/` en el repositorio para un ejemplo completo:

- `verdaccio-config.yaml` — configuración de Verdaccio para espejo local
- `run-offline-test.sh` — script automatizado que valida el flujo de trabajo sin conexión

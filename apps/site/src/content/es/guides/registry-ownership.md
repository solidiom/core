---
contentSchemaVersion: 1
title: "Registro y Propiedad del Código Fuente Firmado"
description: Cómo funciona el registro de Solidiom — integridad, firmas, verificación de código fuente y rastro de auditoría del lockfile.
keywords:
  - registry
  - registro
  - integridad
  - firma
  - codigo fuente
  - source
  - propiedad
  - verificación
  - lockfile
  - provenance
locale: es
maturity: beta
order: 11
audience: intermediate
translationSourceHash: "abafa5b1117a1ba0c65917717e2ffb86869cc807e1c6a89b28dd3336d2da8ad7"
translationStatus: draft
---

# Registro y Propiedad del Código Fuente Firmado

El registro de Solidiom es la fuente de verdad para cada primitivo, componente, bloque y plantilla. Impulsa el catálogo de este sitio y alimenta las instalaciones verificadas de código fuente del CLI.

El concepto de propiedad del codigo fuente es central: cuando instalas código fuente, tú eres el dueño; el registro solo provee el origen verificado.

## Qué es el Registro

El registro es un conjunto de archivos JSON versionados:

- **`index.json`** — Catálogo principal con versión del esquema, bloque de integridad y listas de primitivos, adaptadores, componentes, bloques y plantillas.
- **`&lt;nombre&gt;.json`** — Manifiesto por entregable con metadatos, entregables, dependencias y dígitos de integridad por archivo.

El índice lleva una firma HMAC-SHA256 (`integrity.manifestSignature`) computada sobre el hash concatenado de todos los `filesHash` de los manifiestos. Esto crea una cadena de confianza desde el índice hasta cada archivo de cada entregable.

## Modelo de Integridad

Cada manifiesto registra tres niveles de datos de integridad:

1. **Dígitos por archivo** — Hash SHA-256 de cada archivo fuente en el directorio `source/` del entregable.
2. **Hash del manifiesto** — SHA-256 de los dígitos por archivo ordenados y concatenados (`integrity.filesHash`). Un valor único que representa el árbol fuente completo.
3. **Firma del índice** — HMAC-SHA256 sobre el `entriesHash` del índice, verificado contra una clave de confianza o identidad sigstore.

Cuando ejecutas `solidiom verify --registry`, el CLI realiza una verificación cerrada de tres pasos:

1. Valida la versión del esquema de `index.json`.
2. Recomputa el `filesHash` de cada manifiesto desde sus `fileDigests`.
3. Verifica la firma HMAC contra las claves de confianza de tu política.

## Modo Paquete vs. Modo Fuente

El CLI soporta dos modos de instalación:

### Modo Paquete

`solidiom add dialog --mode package` instala el primitivo desde npm como dependencia. Importas desde `@solidiom/dialog`. Las actualizaciones vienen a través de tu gestor de paquetes.

### Modo Fuente

`solidiom add dialog --mode source` copia los archivos fuente del primitivo directamente en tu proyecto. Tú posees los bytes. Esto te da:

- Visibilidad completa de cada línea de código
- Capacidad de bifurcar, modificar o auditar sin descargar un artefacto pre-construido
- Verificación a nivel de byte contra los dígitos publicados en el registro

## La Cadena de Verificación

Las instalaciones de fuente siguen una cadena estricta:

1. **Verificación del registro** — El CLI verifica el índice del registro y la firma del manifiesto del entregable. Si cualquiera falla, la instalación se detiene.
2. **Verificación a nivel de byte** — Cada archivo fuente se hashea con SHA-256 y se compara contra los `fileDigests` del manifiesto. Una discrepancia bloquea la instalación.
3. **Detección de conflictos** — Si un archivo ya existe en tu proyecto y difiere de la versión del registro, la instalación se bloquea por defecto. Usa `solidiom diff` para ver qué cambió, o `--force` para sobreescribir.
4. **Diario de rollback** — Todas las escrituras están envueltas en un diario. Si la instalación falla a mitad de camino, cada archivo se restaura a su estado previo.

## El Lockfile

Después de una instalación exitosa, `.solidiom/lock.json` registra:

| Campo               | Propósito                                                 |
| ------------------- | --------------------------------------------------------- |
| `path`              | Ruta relativa del archivo instalado                       |
| `digest`            | SHA-256 del contenido fuente al momento de la instalación |
| `primitive`         | Nombre del primitivo fuente                               |
| `version`           | Versión del registro al momento de la instalación         |
| `manifestFilesHash` | Integridad del registro al momento de la instalación      |
| `signatureKeyId`    | Qué clave verificó el registro                            |
| `verifiedAt`        | Marca de tiempo ISO-8601 de verificación                  |
| `provenance`        | `"verified"` o `"unverified"`                             |

El campo `provenance` es el rastro de auditoría. Un valor de `"unverified"` significa que se usó `--allow-unverified`. En CI, `assert-no-unverified` falla la construcción si alguna entrada del lockfile tiene procedencia no verificada.

## Comportamiento Fail-Closed

La política por defecto es segura por defecto:

- `requireVerifiedSource: true` — Las instalaciones de fuente requieren verificación a nivel de byte
- `signatureMode: "none"` — La verificación de firma del registro es opcional por defecto (establece a `"sigstore"` o `"trusted-keys"` para cadena de confianza completa)
- `registrySignatureRequired: false` — La firma del índice no se aplica a menos que lo actives

Cuando la verificación falla, el CLI explica qué verificación falló, qué se esperaba y qué se encontró. No degrada silenciosamente.

## Modos de Verificación

### Sigstore (Sin Clave)

Usa `@sigstore/verify` con confianza raíz TUF. Verifica cadena de certificados, inclusión en registro de transparencia e identidad contra `trustedIdentities` en tu política.

### Claves de Confianza

Usa claves de firma explícitas desde `.solidiom/trusted-keys.json`. Soporta ed25519 y RSA, con gestión de claves activas y retiradas.

### Ninguno

La verificación está deshabilitada. Los archivos fuente aún se hashean y se comparan contra el manifiesto, pero la firma del índice del registro no se verifica.

## Guías Relacionadas

- [Vista general del CLI](/es/guides/cli-overview) — Comandos, flags y configuración
- [Verificar Artefactos y Registro](/es/guides/cli-verify) — `solidiom verify` en detalle
- [Añadir un Primitivo](/es/guides/cli-add) — Modo paquete y fuente

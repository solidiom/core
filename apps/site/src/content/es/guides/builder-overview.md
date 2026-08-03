---
contentSchemaVersion: 1
title: "Vista general del Theme Builder"
description: Personaliza los temas de Solidiom de forma visual — editor de tokens, vista previa, exportación y compartir.
keywords:
  - theme
  - tema
  - builder
  - constructor
  - personalizar
  - tokens
  - vista previa
  - exportar
  - compartir
locale: es
maturity: beta
order: 9
audience: beginner
translationSourceHash: "579afd4c7fdc16b798ee480658a282932d54c2b77144559d29a9453624f12624"
translationStatus: draft
---

# Vista general del Theme Builder

El Solidiom Theme Builder te permite personalizar tokens de color, espaciado y forma de manera visual, previsualizar cambios en modos claro y oscuro, exportar a tu perfil de estilo y compartir temas mediante URL.

Acceso en **/themes/builder**.

## Cómo Funciona

El builder funciona completamente en el cliente. Todo el estado del tema vive en tu navegador; nada se envía a un servidor ni se almacena en una base de datos. Cuando compartes un tema, toda la definición se codifica en el fragmento de la URL (`#t=...`). Abrir esa URL reconstruye el tema en el builder.

## Editor de Tokens

El editor agrupa los tokens en categorías:

- **Surface** (Superficie) — fondos, superficies elevadas y superposiciones
- **Foreground** (Primer plano) — texto principal, secundario y atenuado
- **Border** (Borde) — bordes de división e interactivos
- **Intent** (Intención) — colores de éxito, advertencia, peligro e información
- **Focus** (Foco) — color y desplazamiento del anillo de foco
- **Radius** (Radio) — valores de radio de esquina
- **Shadow** (Sombra) — sombras de elevación

Los tokens de color usan selectores nativos. Todos los tokens soportan entrada de texto para valores precisos. Muchos tokens usan la notación `ref()`, haciendo referencia a otro token (por ejemplo, `ref("surface")` para un valor derivado). El editor muestra un badge de referencia cuando un token es una referencia.

### Edición en Modo Claro/Oscuro

Cambia el editor entre modo claro y oscuro para editar cada modo de forma independiente. El panel de vista previa muestra ambos modos lado a lado.

### Deshacer y Restablecer

El editor mantiene una pila de 10 pasos de deshacer. Puedes restablecer un token individual a su valor predeterminado o restablecer todo el tema.

## Vista Previa en Vivo

El panel de vista previa renderiza componentes reales de Solidiom para que puedas ver cómo tu tema afecta:

- Botones (todas las variantes)
- Controles de formulario (Input, Checkbox, Switch)
- Tarjetas y Badges
- Navegación con Tabs
- Barras de progreso
- Alertas (éxito, advertencia, error)
- Separadores

## Exportación

Exporta tu tema en cuatro formatos:

- **JSON** — Definición de tema versionada, compatible con el esquema de `@solidiom/themes`. Úsalo para consumo programático o como semilla de tema para tu proyecto.
- **CSS** — Propiedades personalizadas `:root` con namespace `--sol-*` para ambos modos. Importa directamente en tu hoja de estilos.
- **Tailwind v4** — Bloque `@theme` con variables `--color-*`, `--radius-*` y `--shadow-*`. Añade a tu configuración de Tailwind.
- **UnoCSS** — Propiedades personalizadas CSS, idéntico a la exportación CSS.

Cada exportación resuelve los tokens `ref()` a sus valores finales. Puedes copiar al portapapeles o descargar como archivo.

## Compartir

Genera una URL compartible que codifica tu tema. La URL usa codificación base64url con un límite de tamaño de 50KB. Cualquiera que abra la URL ve tu tema cargado en el builder.

## Privacidad

El builder no envía valores de tema, colores ni contenido generado por el usuario a ningún servidor. Los analíticas rastrean solo eventos categóricos (abierto, formato exportado, compartido) sin datos de formulario libre. Consulta la [página de privacidad](/es/privacy) para más detalles.

## Limitaciones

- **Estado beta** — El builder es una función beta. Las APIs y formatos de exportación pueden cambiar.
- **Límite de tamaño URL** — Los enlaces compartibles están limitados a 50KB. La mayoría de los temas están muy por debajo de este límite.
- **Sin importación de archivo** — El builder carga temas solo desde URLs compartidas. No hay función de carga de archivo ni pegado.
- **Sin persistencia** — Los temas no se guardan. Usa exportación o compartir para preservar un tema.
- **Sin cuentas** — No existe biblioteca de temas ni edición colaborativa.
- **Vista previa parcial** — La vista previa cubre 10 componentes. La vista previa completa de 21 componentes está planeada.

## Política de Versiones

Los temas usan un esquema versionado (`contentSchemaVersion`). La versión actual del esquema es 1. Cuando se lance una nueva versión del esquema:

- Los enlaces compartidos antiguos con una versión de esquema más nueva se rechazarán con un error claro.
- El JSON exportado incluye la versión del esquema para compatibilidad futura.
- El builder soporta migrar entre versiones de esquema cuando se define una cadena de migración.

Para la especificación técnica completa, consulta el [Theme Contract](/es/docs/contracts/theme-contract).
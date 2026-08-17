---
contentSchemaVersion: 1
title: "Cuando los Previews se Apagaron: Depurando Cloudflare Pages"
description: "Cómo una sola palabra clave de CSP y un encabezado HTTP combinado rompieron silenciosamente cada primitiva interactiva y vista previa de plantilla en solidiom.org — y las tres correcciones que los restauraron."
keywords: [csp, strict-dynamic, cloudflare-pages, x-frame-options, astro, iframe, debugging, article]
locale: es
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-17"
authors:
  - solidiom-core
tags: [operations, security, astro, debugging, solidiom]
translationSourceHash: "d807aba5b985e54f5de5a4b8c6016431e5c21bb7331dd4c2b73c68ca730c417f"
translationStatus: draft
---

# Cuando los Previews se Apagaron: Depurando Cloudflare Pages

Desplegamos una actualización del sitio y todo se veía bien — hasta que no. La documentación se renderizaba, la navegación funcionaba, la búsqueda funcionaba. Pero dos cosas estaban silenciosa y completamente rotas: las **vistas previas interactivas de primitivas** (las islas Solid en vivo) y las **vistas previas de plantillas** (los iframes que muestran una aplicación starter completa ejecutándose). Ambas habían funcionado en desarrollo local. Ambas estaban muertas en producción.

Esta es la historia de ese bug, porque es buena: nada arrojó un error de build, nada devolvió un 500, y las causas raíz fueron tres problemas no relacionados que casualmente afectaron las mismas dos funcionalidades.

## Síntoma 1: primitivas que se negaban a despertar

Las vistas previas de primitivas son islas Astro hidratadas con `client:visible`. En el sitio desplegado renderizaban su markup estático y luego simplemente... se quedaban ahí. Sin hidratación, sin interactividad.

La consola del navegador contó toda la historia:

```
Executing inline script violates the following Content Security Policy
directive 'script-src 'self' 'unsafe-inline' 'strict-dynamic''. Either the
'unsafe-inline' keyword, a hash ('sha256-…'), or a nonce ('nonce-…') is
required to enable inline execution. The action has been blocked.
```

Ocho de ellos, uno tras otro.

El culpable era una palabra clave en nuestra Content Security Policy:

```
script-src 'self' 'unsafe-inline' 'strict-dynamic'
```

Aquí está la trampa. En CSP Level 3, **`'strict-dynamic'` deshabilita deliberadamente `'self'`, `'unsafe-inline'` y toda lista de hosts permitidos.** Su propósito completo es decir: "ignora las listas de origen — confía solo en scripts que llevan un nonce o hash válido, más lo que esos scripts de confianza elijan cargar."

Es un modelo de seguridad genuinamente bueno. Pero solo funciona si tus scripts iniciales están etiquetados con nonce o hash. El bootstrap de hidratación de Astro se emite como scripts inline sin nonce. Así que el navegador hizo exactamente lo que le dijimos: vio `'strict-dynamic'`, ignoró `'unsafe-inline'`, no encontró nonce, y bloqueó el bootstrap de cada isla.

El `'unsafe-inline'` justo al lado era pura decoración — silenciosamente anulado. La política *parecía* permisiva y *se comportaba* como un bloqueo.

## Síntoma 2: plantillas que nunca estuvieron ahí

Las vistas previas de plantillas fallaron diferente. En lugar de un iframe roto, la página mostraba un mensaje de fallback cortés: "Preview not available for this template."

Ese mensaje se elige en **tiempo de build**. `TemplatePreview.astro` verifica si el archivo de preview pre-construido existe y renderiza un `<iframe>` o el fallback:

```ts
const previewExists =
  isSafeName &&
  existsSync(resolve(__dirname, "../../public/templates/__preview__", name, "index.html"))
```

Los archivos definitivamente estaban en disco — nuestro paso de sincronización había copiado los 31 a `public/`, e incluso llegaron al `dist/` final. Sin embargo `previewExists` era `false` para cada plantilla.

El problema es `__dirname`. Se deriva de `import.meta.url`, y eso funciona bien en dev donde el componente se ejecuta desde `src/components/`. Pero cuando Astro **empaqueta** el componente para un build de producción, `import.meta.url` ya no apunta a ningún lugar cerca de `src/components/`. La navegación relativa `../../public/...` aterrizó en el lugar equivocado, `existsSync` devolvió `false`, y cada plantilla silenciosamente cayó al fallback.

Sin error. Sin advertencia. Solo un build que renderizó con confianza "not available" para contenido que estaba justo al lado.

## Síntoma 3: el encabezado que luchó contra sí mismo

Incluso una vez que corregimos el fallback y conseguimos que el iframe se renderizara, había una tercera mina esperando. Nuestro archivo `_headers` hacía esto:

```
/*
  X-Frame-Options: DENY

/templates/__preview__/*
  X-Frame-Options: SAMEORIGIN
```

La intención es razonable: negar el framing en todas partes, excepto permitir que el sitio enmarque sus propias vistas previas de plantillas. En muchas plataformas una regla más específica *anula* una más amplia.

Cloudflare Pages no anula — **combina**. La respuesta real que llegaba era:

```
X-Frame-Options: DENY, SAMEORIGIN
```

Los navegadores tratan un `X-Frame-Options` multi-valor contradictorio como deny. Así que el iframe same-origin era bloqueado de todas formas. Y críticamente, el `_headers` de Cloudflare Pages no tiene forma de *eliminar* un encabezado heredado de una coincidencia más amplia — así que no puedes ganar esta batalla siendo más específico.

## Las correcciones

Tres problemas, tres correcciones.

### 1. Eliminar `'strict-dynamic'`

Dependemos de scripts inline sin nonce (así es como Astro hidrata islas), así que la política honesta y funcional es:

```
script-src 'self' 'unsafe-inline'
```

Esta es la política que habíamos *documentado* todo el tiempo — el encabezado desplegado se había desviado silenciosamente. `'strict-dynamic'` vale la pena adoptarlo después, pero solo emparejado con nonces o hashes en tiempo de build para cada script inline. La mitad de ese patrón es peor que ninguna mitad.

### 2. Anclar la verificación de build a la raíz del sitio

En lugar de confiar en `import.meta.url` dentro de un componente empaquetado, resolvemos la ruta del preview contra raíces conocidas y probamos cada una:

```ts
const previewCandidates = isSafeName
  ? [
      resolve(process.cwd(), "public/templates/__preview__", name, "index.html"),
      resolve(process.cwd(), "apps/site/public/templates/__preview__", name, "index.html"),
      resolve(__dirname, "../../public/templates/__preview__", name, "index.html"),
    ]
  : []
const previewExists = previewCandidates.some((candidate) => existsSync(candidate))
```

La ruta original relativa al módulo permanece como fallback de dev, así que la verificación es estrictamente más robusta que antes, no solo diferente.

### 3. Hacer la política de framing consistente

Dado que Cloudflare combina encabezados y no puede aplicar un override por ruta, `DENY` global y previews same-origin son mutuamente excluyentes. Así que establecemos una política única y consistente:

```
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: …; frame-ancestors 'self'; …
```

`SAMEORIGIN` más `frame-ancestors 'self'` todavía bloquea el clickjacking cross-origin — la amenaza real — mientras permite que el sitio enmarque su propio contenido de preview. El override por ruta fue eliminado completamente, porque nunca habría podido funcionar aquí.

## Lecciones

Algunas cosas que este bug nos reafirmó:

- **`'strict-dynamic'` no es aditivo.** Agregarlo no ajusta una lista de permisos existente — reemplaza el modelo. Si tus scripts no tienen nonce, es un interruptor de apagado.
- **`import.meta.url` no es estable a través de un bundler.** Cualquier verificación de filesystem en tiempo de build anclada a él es un bug latente. Ancla a la raíz del proyecto en su lugar.
- **La semántica de encabezados de la plataforma importa.** "Lo más específico anula lo más amplio" es una suposición común y es incorrecta en Cloudflare Pages, que combina. Lee los encabezados de respuesta, no asumas la configuración.
- **Un build verde no prueba nada sobre el comportamiento.** Cada uno de estos falló ruidosamente en el navegador y silenciosamente en CI. La única verificación confiable fue cargar las páginas desplegadas y leer la consola y los encabezados de respuesta reales.

Los previews están de vuelta. Y el CSP finalmente hace lo que su comentario siempre afirmó.

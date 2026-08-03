---
contentSchemaVersion: 1
title: Avatar
description: Avatar de usuario con imagen y soporte de reemplazo.
keywords: [avatar, imagen, reemplazo, iniciales, usuario]
locale: es
maturity: draft
product: Avatar
productLayer: primitive
status: draft
package: "@solidiom/avatar"
primitive: avatar
section: overview
translationSourceHash: "c85f1c17a4acb7831d343278e5cc1e2357e43310c87b7a0c067066f1e2549f61"
translationStatus: draft
---

Avatar renderiza una imagen de perfil de usuario con reemplazo automático a contenido de texto (como iniciales o un nombre) cuando la imagen no se carga correctamente. Gestiona el estado de carga de la imagen internamente y coordina la visibilidad entre las partes de imagen y reemplazo.

## Uso

Avatar tiene tres partes componibles: `Root`, `Image`, y `Fallback`. Siempre proporciona tanto un `Image` como un `Fallback` dentro de `Root`.

```tsx
import * as Avatar from "@solidiom/avatar"

;<Avatar.Root>
  <Avatar.Image src="/foto-usuario.jpg" alt="Foto de Ana García" />
  <Avatar.Fallback>AG</Avatar.Fallback>
</Avatar.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/avatar`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

### Root

Contenedor que gestiona el estado de carga de la imagen para sus partes hijas `Image` y `Fallback`.

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `class` | `string` | — | Clase CSS para el elemento raíz. |

### Image

Renderiza un elemento `<img>` que permanece oculto hasta que la imagen se carga correctamente. Informa el estado de carga al `Root`.

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `src` | `string` | — | URL de la imagen del avatar. |
| `alt` | `string` | — | Texto alternativo para la imagen. |
| `class` | `string` | — | Clase CSS para el elemento de imagen. |

### Fallback

Renderiza contenido de reemplazo (por ejemplo, iniciales, icono) cuando la imagen no se ha cargado o ha fallado. Se oculta cuando la imagen se carga correctamente.

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `JSX.Element` | — | Contenido para mostrar cuando la imagen no está disponible. |
| `class` | `string` | — | Clase CSS para el elemento de reemplazo. |

## Estilos

Avatar lleva los atributos `data-scope="avatar"` y `data-part` para seleccionar cada parte:

- `Root`: `data-scope="avatar"`, `data-part="root"` — se renderiza como un `<span>`
- `Image`: `data-scope="avatar"`, `data-part="image"` — se renderiza como un `<img>`
- `Fallback`: `data-scope="avatar"`, `data-part="fallback"` — se renderiza como un `<span>`

Estila el contenedor raíz como un contenedor flex para superponer la imagen y el reemplazo. Usa los atributos `data-part` para seleccionar partes individuales.

## Renderizado SSR e hidratación

Avatar gestiona el estado de carga de la imagen en el cliente. En el servidor, la `Image` está oculta y el `Fallback` es visible. Después de la hidratación, la imagen se carga y reemplaza al reemplazo. No se requiere gestión manual del estado.
---
title: Divulgaciones de Privacidad
description: Cómo Solidiom maneja tus datos — qué recopilamos, qué no, y tus derechos.
locale: es
translationSourceHash: d420b432cd4fe23856b4c3268a5270ea5e02e5513d8efeea9a07dce551e65cbc
translationStatus: draft
---

# Divulgaciones de Privacidad

**Fecha de vigencia:** 2025-01-01
**Dominio canónico:** solidiom.org
**Licencia:** Apache 2.0 (código); contenido licenciado bajo CC BY 4.0 salvo indicación contraria.

Solidiom es un proyecto de código abierto. Creemos que la privacidad es un derecho, no una funcionalidad. Esta página documenta cada servicio externo y práctica de datos utilizada en el sitio web de Solidiom para que puedas tomar decisiones informadas sobre tu experiencia de navegación.

---

## Resumen

| Servicio      | Propósito                     | Datos personales enviados     | Opción de exclusión  |
| ------------- | ----------------------------- | ----------------------------- | -------------------- |
| Cloudflare    | CDN, DNS, analítica básica    | Dirección IP (efímera)        | No (infraestructura) |
| PostHog       | Analítica de producto         | Vistas de página anonimizadas | Sí                   |
| Buttondown    | Newsletter                    | Email (solo si te suscribes)  | Sí                   |
| Pagefind      | Búsqueda del sitio            | Ninguno                       | N/A                  |
| Playground    | Sandbox de código             | Ninguno                       | N/A                  |
| Theme Builder | Herramienta de temas visuales | Ninguno                       | N/A                  |

---

## Cloudflare (CDN / DNS / Analítica Web)

### Qué hace

Cloudflare proporciona nuestra Red de Distribución de Contenidos (CDN), resolución DNS y analítica web básica. Todo el tráfico hacia solidiom.org pasa por la red perimetral de Cloudflare.

### Qué SE recopila

- **Dirección IP** — procesada de forma efímera por los nodos perimetrales de Cloudflare para enrutamiento y protección DDoS. Cloudflare no registra direcciones IP completas en su producto de analítica.
- **Geolocalización a nivel de país** — derivada de la IP para analítica de tráfico agregada (ej., "42% de los visitantes son de Alemania"). Sin datos de ciudad ni ubicación precisa.
- **URL de página y referente** — qué páginas se visitaron y de dónde vino el tráfico.
- **Metadatos de navegador y dispositivo** — cadena user-agent (nombre del navegador, SO, tipo de dispositivo) para desgloses agregados.
- **Métricas de rendimiento** — tiempos de carga, conteos de solicitudes, uso de ancho de banda.

### Qué NO se recopila

- Cloudflare Web Analytics no establece cookies.
- Sin rastreo entre sitios ni fingerprinting.
- Sin identificadores personales más allá del procesamiento efímero de IP.
- Los términos de búsqueda, direcciones de email, código ingresado en el playground ni valores del theme builder se envían a la analítica de Cloudflare.

### Retención de datos

Cloudflare retiene datos de analítica web por un máximo de 6 meses en forma agregada. Los registros de solicitudes individuales en el perímetro se eliminan en 24 horas.

### Tus derechos

Cloudflare actúa como procesador de datos en nuestro nombre. Dado que no se almacenan datos personales persistentes en la analítica, no hay datos personales cuya eliminación se pueda solicitar. Puedes bloquear el beacon de analítica de Cloudflare usando un bloqueador de contenido, aunque esto no afecta la funcionalidad del CDN.

### Más información

- [Política de Privacidad de Cloudflare](https://www.cloudflare.com/privacypolicy/)
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)

---

## PostHog (Analítica de Producto)

### Qué hace

PostHog nos ayuda a entender cómo los visitantes usan el sitio de documentación para poder mejorar la navegación, estructura del contenido y experiencia del desarrollador.

### Configuración

Ejecutamos PostHog con la siguiente configuración respetuosa con la privacidad:

- **Autocaptura: DESHABILITADA** — no capturamos automáticamente clics, envíos de formularios ni cambios de página. Solo se envían eventos explícitamente instrumentados.
- **Grabación de sesión: DESHABILITADA** — no grabamos tu pantalla, movimientos del ratón ni interacciones.
- **Rastreo entre dominios: DESHABILITADO** — tu actividad no se vincula entre diferentes sitios web.

### Qué SE recopila

- **Eventos de vista de página** — qué páginas de documentación se visitan (solo la ruta URL).
- **Eventos explícitamente instrumentados** — como "selector de tema activado" o "idioma cambiado." Estos eventos no contienen contenido personal.
- **ID anónimo distintivo** — un identificador generado aleatoriamente almacenado en una cookie de primera parte. No puede vincularse a tu identidad real.
- **URL de referente** — de dónde viniste (ej., una página de resultados de buscador).
- **Tamaño de viewport y tipo de dispositivo** — para decisiones de diseño responsivo.

### Qué NO se recopila

- Sin nombres, direcciones de email ni información de cuenta.
- Sin términos de búsqueda ingresados en Pagefind.
- Sin código ingresado en el playground.
- Sin valores de tema del theme builder.
- Sin grabaciones de sesión ni mapas de calor.
- Sin contenidos de formularios ni pulsaciones de teclas.

### Exclusión

Puedes excluirte de la analítica de PostHog de cualquiera de estas formas:

1. **Respeto por Do Not Track** — si tu navegador envía el encabezado `DNT: 1` o `GPC: 1` (Global Privacy Control), la analítica de PostHog no se cargará.
2. **Bloqueadores de contenido** — bloqueadores de anuncios y extensiones de privacidad (uBlock Origin, Privacy Badger, etc.) bloquearán el script de PostHog.
3. **Configuración del navegador** — deshabilitar JavaScript impide que toda la analítica del lado del cliente se ejecute.

### Retención de datos

Los eventos de analítica se retienen por 12 meses y luego se eliminan automáticamente. La cookie de ID anónimo distintivo expira después de 365 días de inactividad.

### Más información

- [Política de Privacidad de PostHog](https://posthog.com/privacy)
- [Guía GDPR de PostHog](https://posthog.com/docs/privacy)

---

## Buttondown (Newsletter)

### Qué hace

Buttondown gestiona nuestro newsletter opcional para actualizaciones del proyecto, anuncios de versiones y noticias de la comunidad.

### Qué SE recopila

- **Dirección de email** — solo si te suscribes explícitamente a través del formulario del newsletter.
- **Fecha de suscripción** — cuándo te registraste.
- **Seguimiento de apertura/clic** — Buttondown puede rastrear si abriste un email y qué enlaces clicaste. Revisamos continuamente si deshabilitar esto.

### Qué NO se recopila

- No se recopilan datos si no te suscribes.
- No se comparten datos con anunciantes de terceros.
- Ninguna actividad de navegación en solidiom.org se vincula a tu suscripción al newsletter.

### Exclusión

- **No te suscribas** — el newsletter es completamente opcional. Ninguna funcionalidad del sitio depende de él.
- **Cancelar suscripción** — cada email incluye un enlace de cancelación con un solo clic.
- **Eliminación** — escríbenos o usa el enlace de cancelación para que tu email se elimine permanentemente de nuestra lista.

### Retención de datos

Tu dirección de email se retiene solo mientras tu suscripción esté activa. Al cancelar la suscripción, tu email se elimina de Buttondown en 30 días.

### Más información

- [Política de Privacidad de Buttondown](https://buttondown.com/legal/privacy)

---

## Pagefind (Búsqueda del Lado del Cliente)

### Qué hace

Pagefind proporciona la funcionalidad de búsqueda en solidiom.org. Es un motor de búsqueda completamente del lado del cliente y estático.

### Cómo funciona

Pagefind pre-construye un índice de búsqueda en el momento de compilación del sitio. Cuando escribes una consulta de búsqueda:

1. Los archivos del índice de búsqueda se cargan en tu navegador.
2. Tu consulta se compara con el índice local completamente dentro de tu navegador.
3. Los resultados se muestran sin ninguna solicitud de red a un servidor externo.

### Qué SE recopila

- **Nada.** Las consultas de búsqueda nunca salen de tu navegador. Ningún término de búsqueda se envía a nuestros servidores, Cloudflare, PostHog ni ningún tercero.

### Qué NO se recopila

- Sin términos de búsqueda.
- Sin clics en resultados de búsqueda (más allá de la analítica estándar de navegación de página).
- Sin historial de búsqueda.

### Garantía de privacidad

Pagefind es arquitectónicamente incapaz de filtrar datos de búsqueda porque opera completamente dentro del navegador sin llamadas a API externas. El índice de búsqueda es un recurso estático servido desde el mismo CDN que el resto del sitio.

---

## Playground (Sandbox de Código)

### Qué hace

El playground de Solidiom te permite experimentar con componentes en un entorno de codificación en vivo directamente en tu navegador.

### Cómo funciona

El playground se ejecuta dentro de un **iframe con sandbox** con permisos restringidos. El código se compila y ejecuta completamente dentro de tu navegador usando herramientas del lado del cliente.

### Qué SE recopila

- **Nada.** El código que escribes en el playground nunca se envía a ningún servidor.

### Qué NO se recopila

- Sin contenido de código.
- Sin salida de compilación.
- Sin mensajes de error.
- Sin patrones de uso dentro del playground.

### Garantía de privacidad

El iframe del playground usa el atributo `sandbox`, que previene:

- Comunicación con la página padre más allá del paso de mensajes estructurado.
- Acceso a cookies o almacenamiento del sitio principal.
- Navegación del contexto de navegación de nivel superior.
- Cualquier solicitud de red saliente a servidores externos.

Tu código permanece en tu navegador. Punto.

---

## Theme Builder (Herramienta de Temas Visuales)

### Qué hace

El theme builder te permite personalizar los tokens de diseño de Solidiom (colores, espaciado, radios, etc.) y exportar el tema resultante.

### Cómo funciona

Todo el estado del tema se codifica directamente en la **URL** usando parámetros codificados en URL. Esto significa:

- Tu configuración de tema se almacena en la barra de direcciones del navegador.
- Compartir un tema es tan simple como compartir una URL.
- No hay persistencia del lado del servidor, cuentas ni bases de datos involucradas.

### Qué SE recopila

- **Nada.** Los valores de tema nunca se envían a ningún servidor ni servicio de analítica.

### Qué NO se recopila

- Sin configuraciones de tema.
- Sin valores de color, opciones de espaciado ni otras decisiones de diseño.
- Sin acciones de exportación ni eventos de descarga.

### Garantía de privacidad

El theme builder no tiene backend. No hay endpoint de API, no hay base de datos ni estado del lado del servidor. La URL es el único mecanismo de almacenamiento, y existe completamente en la barra de direcciones e historial de tu navegador.

---

## Cookies

Solidiom utiliza las siguientes cookies:

| Cookie                | Propósito                          | Tipo          | Duración |
| --------------------- | ---------------------------------- | ------------- | -------- |
| PostHog distinct_id   | Identificador anónimo de analítica | Primera parte | 365 días |
| Preferencia de tema   | Recuerda tu elección claro/oscuro  | Primera parte | 365 días |
| Preferencia de idioma | Recuerda tu elección de idioma     | Primera parte | 365 días |

No se establecen cookies de terceros. No existen cookies de publicidad en este sitio.

---

## Tus Derechos

Independientemente de tu jurisdicción, respetamos los siguientes derechos:

- **Derecho a saber** — esta página documenta todo lo que recopilamos. No hay rastreadores ocultos ni servicios no divulgados.
- **Derecho de exclusión** — la analítica puede bloquearse mediante encabezados DNT/GPC o bloqueadores de contenido.
- **Derecho de eliminación** — para suscriptores del newsletter, cancelar la suscripción para que se elimine tu email. Para analítica, no se almacenan datos personalmente identificables para eliminar.
- **Derecho de acceso** — contáctanos para solicitar cualquier dato que podamos tener sobre ti (que, para la mayoría de visitantes, es nada).

### Para residentes de la UE/EEE (RGPD)

Nuestra base legal para procesar datos de analítica es el interés legítimo (comprender el uso del sitio para mejorar la documentación). Minimizamos la recopilación de datos, anonimizamos identificadores y deshabilitamos funciones invasivas como la grabación de sesión y la autocaptura.

### Para residentes de California (CCPA)

No vendemos información personal. No compartimos información personal para publicidad conductual entre contextos. Los datos de analítica anónimos que recopilamos no constituyen "información personal" bajo CCPA ya que no pueden razonablemente vincularse a ningún individuo.

---

## Cambios a Esta Política

Actualizaremos esta página cuando cambien nuestras prácticas de datos. Dado que Solidiom es de código abierto, puedes revisar el [historial de commits](https://github.com/solidiom/solidiom) de este archivo para ver exactamente qué cambió y cuándo.

---

## Contacto

Para preguntas de privacidad o solicitudes de datos, abre un issue en nuestro [repositorio de GitHub](https://github.com/solidiom/solidiom) o comunícate a través de los canales listados en el sitio web.

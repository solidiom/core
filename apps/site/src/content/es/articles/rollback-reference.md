---
contentSchemaVersion: 1
title: "Referencia de Rollback"
description: "Cómo hacer rollback de un despliegue de Cloudflare Pages y revertir DNS para solidiom.org."
keywords: [rollback, cloudflare, pages, despliegue, dns, operaciones, referencia]
locale: es
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
translationStatus: draft
---

# Referencia de Rollback

Esta página cubre cómo hacer rollback de un despliegue de Cloudflare Pages y revertir DNS si es necesario.

## Hacer Rollback de un Despliegue de Cloudflare Pages

Cloudflare Pages conserva todos los despliegues anteriores. Un rollback es instantáneo — el DNS ya apunta a Pages y cambiar el despliegue de producción es atómico.

### Pasos

1. Navega al [Panel de Cloudflare](https://dash.cloudflare.com) → Pages → solidiom → Deployments.
2. Encuentra el despliegue funcional anterior. Puedes identificarlo por:
   - SHA del commit de git
   - Marca de tiempo del despliegue
   - Nombre de la rama
3. Haz clic en el despliegue y selecciona **"Retry deployment"** o **"Rollback to this deploy"**.
4. Verifica que el sitio en `https://solidiom.org` esté sirviendo la versión correcta.

### Rollback vía API

Para rollback automatizado, usa la API de Cloudflare:

```bash
# Listar despliegues recientes
curl -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/solidiom/deployments" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# Promover un despliegue específico a producción
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/solidiom/versions/$DEPLOYMENT_ID/restore" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### Identificar un Despliegue Roto

- Revisa la lista de despliegues para el SHA de git que se推送 cuando comenzó el problema.
- Cloudflare Pages marca las compilaciones fallidas con un indicador rojo.
- Si la compilación tuvo éxito pero el sitio está roto, compara la marca de tiempo del despliegue con cuando se reportó el problema.

## Revertir DNS

En el caso poco probable de que los cambios de DNS necesiten ser revertidos:

1. Navega al Panel de Cloudflare → solidiom.org → DNS.
2. Revierte cualquier cambio de registro CNAME o A.
3. El DNS global de Cloudflare generalmente se propaga en menos de 60 segundos.

### Registros DNS Actuales

| Registro | Tipo | Valor | Proxy |
|----------|------|-------|-------|
| `solidiom.org` | CNAME | `solidiom.pages.dev` | Sí |
| `www.solidiom.org` | CNAME | `solidiom.pages.dev` | Sí |

## Procedimientos de Contacto

Si se necesita un rollback:

1. Realiza el rollback inmediatamente (no esperes al análisis de causa raíz).
2. Abre un Issue en GitHub documentando:
   - Qué se rompió
   - Qué despliegue fue revertido de/a (incluye SHA)
   - Qué desencadenó el rollback
3. Si el problema es de seguridad, sigue el proceso en `SECURITY.md`.

## Lista de Prevención

Antes de cualquier despliegue a producción:

- [ ] `pnpm exec nx run @solidiom/site:build` exitosamente en local
- [ ] `pnpm exec nx run @solidiom/site:search-index` produce salida
- [ ] Sin nuevos errores de tipo o advertencias de compilación
- [ ] Despliegue de preview revisado y funcional
- [ ] Encabezados de seguridad verificados en preview

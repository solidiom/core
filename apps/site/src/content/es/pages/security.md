---
title: Política de Seguridad
description: Divulgación coordinada, reporte de vulnerabilidades y versiones soportadas para Solidiom.
locale: es
translationSourceHash: "1778e6c6de574f25e1ab744c9b1ba7aba2c3a2394e98975f7742a81f836cf79e"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Política de Seguridad

**Fecha de efecto:** 2025-01-01
**Dominio canónico:** solidiom.org

## Versiones Soportadas

| Versión                                       | Soportada          |
| --------------------------------------------- | ------------------ |
| Último prerelease `next`                      | Sí                 |
| Prerelease `next` anterior                    | Esfuerzo razonable |
| Versiones estables (cuando estén disponibles) | Sí                 |

## Reportar una Vulnerabilidad

Usamos [Reporte Privado de Vulnerabilidades de GitHub](https://github.com/solidiom/core/security/advisories/new) para divulgación coordinada.

Al enviar un reporte:

1. Recibirás un acknowledgment dentro de 48 horas
2. Confirmaremos la validez de la vulnerabilidad dentro de una semana
3. Comunicaremos el cronograma de mitigación
4. Serás acreditado en el aviso a menos que solicites anonimato

## Qué Incluir

- Una descripción de la vulnerabilidad
- Pasos para reproducirla
- Paquete y versión afectados
- Evaluación del impacto

## Qué No Aceptamos

- Vulnerabilidades en dependencias de terceros (repórtalas en su origen)
- Ingeniería social, DDoS o ataques de denegación de servicio
- Problemas en versiones ya suplantadas fuera de su ventana de soporte

## Alcance

Esta política cubre:

- Todos los paquetes `@solidiom/*`
- El CLI de Solidiom (`solidiom`)
- El sitio web solidiom.org
- La infraestructura del registro y de firmas

## Divulgación Coordinada

Seguimos un proceso de divulgación coordinada:

1. **Reporte** — envía mediante Reporte Privado de Vulnerabilidades de GitHub
2. **Clasificación** — evaluamos severidad y alcance dentro de 7 días
3. **Corrección** — desarrollamos y probamos un parche
4. **Lanzamiento** — publicamos la corrección y un aviso de seguridad
5. **Crédito** — reconocemos al reportero (a menos que se solicite anonimato)

Cronogramas objetivo:

- Crítica: parche dentro de 7 días
- Alta: parche dentro de 14 días
- Media: parche dentro de 30 días
- Baja: incluida en el próximo lanzamiento programado

## Integridad del Registro

El registro utiliza firmas asimétricas Ed25519 para la integridad del manifiesto. Si descubre una falla de verificación de firma o una posible comprometimiento de clave, repórtela como una vulnerabilidad de severidad Crítica.

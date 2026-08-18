---
contentSchemaVersion: 1
title: "Enterprise"
description: "Solidiom for enterprise teams: IAM, audit, compliance, governance, and operations templates."
keywords: [enterprise, iam, audit, compliance, governance, security]
locale: es
maturity: draft
product: "Solidiom"
productLayer: page
status: draft
translationSourceHash: "ed8c9a34a75742cbea5b5faecb15e1794e4be18c6862881eaece005fae3b2804"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Empresa

El portafolio Enterprise de Solidiom proporciona plantillas listas para producción para equipos de plataforma que construyen herramientas internas, sistemas de cumplimiento y consolas operacionales.

## Plantillas Enterprise

| Plantilla                                                    | Propósito                                                         |
| ------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Identidad y Acceso](/templates/identity-access/)            | Directorio de usuarios, roles RBAC, gestión de sesiones           |
| [Registro de Auditoría](/templates/audit-log/)               | Flujo de eventos, filtros, exportación de cumplimiento            |
| [Operaciones de Facturación](/templates/billing-operations/) | Facturas, reconciliación, reportes financieros                    |
| [Respuesta a Incidentes](/templates/incident-response/)      | Incidentes activos, runbooks, postmortems                         |
| [Operaciones de IA](/templates/ai-operations/)               | Monitoreo de modelos, despliegues, seguimiento de costos          |
| [Gestión de API](/templates/api-management/)                 | Catálogo de endpoints, ciclo de vida de claves, analíticas de uso |
| [Portal de Desarrolladores](/templates/developer-portal/)    | Documentación, playground de SDK, gestión de aplicaciones         |
| [Centro de Seguridad](/templates/security-center/)           | Dashboard de amenazas, vulnerabilidades, políticas                |
| [Centro de Cumplimiento](/templates/compliance-center/)      | Seguimiento de frameworks, evaluaciones de controles, evidencia   |
| [Gobernanza de Datos](/templates/data-governance/)           | Catálogo de datos, linaje, clasificación                          |
| [Automatización de Flujos](/templates/workflow-automation/)  | Diseñador visual, historial de ejecución, integraciones           |
| [Operaciones de Soporte](/templates/support-operations/)     | Cola de tickets, base de conocimiento, métricas                   |
| [Configuración Enterprise](/templates/enterprise-settings/)  | Configuración de organización, SSO/MFA, SCIM                      |

## Arquitectura Técnica

Todas las plantillas enterprise comparten una base común:

- **Solid 2** — framework de UI reactivo con reactividad de grano fino
- **Vite + Solid Router** — builds rápidos con enrutamiento basado en archivos
- **Propiedad del codigo fuente** — tú eres dueño del código; sin vendor lock-in ni SDK en runtime
- **Sistema de temas** — propiedades personalizadas CSS para personalización visual completa
- **Accesibilidad** — cumplimiento WCAG 2.2 AA con patrones APG en todo

## Propiedades de Seguridad

- **Firmas del registro** — todo el código instalado tiene integridad verificada
- **Sin SDK en runtime** — sin phone-home, sin telemetría, sin dependencias externas en runtime
- **Instalación en modo fuente** — inspecciona, audita y modifica cada línea de código
- **Compatible con CSP** — sin scripts inline, sin eval, sin carga de recursos externos
- **Capaz de operar offline** — el CLI y las plantillas funcionan sin acceso a la red

## Despliegue

Las plantillas enterprise se despliegan en cualquier plataforma de hosting estático:

- Cloudflare Pages
- Vercel
- Netlify
- AWS S3 + CloudFront
- Auto-hospedado (cualquier servidor HTTP)

No se requiere runtime del lado del servidor para las plantillas base. Agrega tu propia capa de API según sea necesario.

## Lo Que Esto No Es

- Esto **no es un SaaS hospedado** — tú despliegas y operas tus propias instancias
- **No hay SLAs ni contratos de soporte** — esto es software de código abierto
- **No hay tarifas de licencia** — licenciado bajo Apache 2.0
- **No hay vendor lock-in** — propiedad del codigo fuente, amigable para bifurcación

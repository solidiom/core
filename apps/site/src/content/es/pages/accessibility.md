---
contentSchemaVersion: 1
title: "Accessibility"
description: "Solidiom's accessibility commitment, evidence, and compliance status."
keywords: [accessibility, wcag, a11y, aria, apg, screen-reader]
locale: es
maturity: draft
product: "Solidiom"
productLayer: page
status: draft
translationSourceHash: "4e59697d19c0e2803d286976b8ca32fecfe4ca55652a814da1f75b21a949a156"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Accesibilidad

Solidiom está construido sobre el principio de que el software accesible no es opcional. Cada primitivo, componente y plantilla está diseñado y probado contra WCAG 2.2 Nivel AA y los patrones de la Guía de Prácticas de Autoría WAI-ARIA (APG).

## Nuestro Compromiso

- Cada primitivo interactivo implementa el patrón APG correspondiente de teclado y ARIA
- Cada primitivo incluye evidencia de accesibilidad comprometida (`evidence.json`)
- Cada preset de tema cumple los mínimos de contraste AA tanto en modo claro como oscuro
- Los escaneos automatizados de axe-core se ejecutan en cada build para los 52 primitivos
- La navegación por teclado está documentada y probada para cada elemento interactivo

## Evidencia

Nuestra evidencia de accesibilidad es verificada por máquina y comprometida en el repositorio:

### Pruebas Automatizadas

| Capa                   | Cobertura          | Herramienta       | Evidencia                        |
| ---------------------- | ------------------ | ----------------- | -------------------------------- |
| Primitivos (52)        | 100%               | axe-core 4.10.2   | `docs/axe-scan-results.md`       |
| Navegación por teclado | 100%               | Auditoría manual  | `docs/keyboard-audit-results.md` |
| Contraste de color     | Todos los presets  | Auditoría de tema | `pnpm run audit:preset-themes`   |
| Gestión del foco       | Todos los overlays | Vitest browser    | Evidencia por primitivo          |

### Evidencia por Primitivo

Cada uno de los 52 primitivos tiene un archivo `packages/<name>/docs/accessibility/evidence.json` comprometido que contiene:

- Resultados del escaneo axe-core (violaciones, passes, incompletos)
- Contrato de navegación por teclado
- Atributos y roles ARIA utilizados
- Expectativas de comportamiento del lector de pantalla

### Pruebas con Lector de Pantalla

| Tecnología de Asistencia | Estado               | Plataforma |
| ------------------------ | -------------------- | ---------- |
| VoiceOver                | Documentado          | macOS/iOS  |
| NVDA                     | Planificado (Fase 4) | Windows    |
| JAWS                     | Planificado (Fase 4) | Windows    |
| TalkBack                 | Planificado (Fase 4) | Android    |

## Cumplimiento WCAG 2.2 AA

Todos los primitivos y componentes cumplen con WCAG 2.2 Nivel AA. Nuestra auditoría completa está documentada en `docs/qa/wcag-2.2-aa-audit.md` y cubre:

- **Perceptible** — HTML semántico, roles ARIA, contraste de texto 4.5:1+, tipografía en `rem`
- **Operable** — navegación completa por teclado, sin trampas, foco visible, objetivos táctiles de 24px+
- **Comprensible** — atributos `lang`, sin cambios inesperados, inputs etiquetados
- **Robusto** — ARIA válido, regiones en vivo para contenido dinámico

## Cumplimiento de Patrones APG

Los primitivos interactivos implementan patrones de WAI-ARIA Authoring Practices:

| Patrón         | Primitivos                        |
| -------------- | --------------------------------- |
| Accordion      | accordion                         |
| Dialog (Modal) | dialog, alert-dialog              |
| Menu/Menubar   | menu, context-menu, dropdown-menu |
| Tabs           | tabs                              |
| Combobox       | combobox, select                  |
| Listbox        | listbox, select                   |
| Tooltip        | tooltip                           |
| Switch         | switch                            |
| Slider         | slider                            |
| Tree View      | tree                              |
| Alert          | alert, toast                      |

## Reportar Problemas

Si encuentras una barrera de accesibilidad en Solidiom:

1. Abre un issue en GitHub con la etiqueta `accessibility`
2. Incluye el primitivo/componente afectado
3. Describe la barrera y la tecnología de asistencia utilizada
4. Priorizamos los problemas de accesibilidad como bugs críticos

## Recursos

- [Referencia Rápida WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [Guía de Prácticas de Autoría WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/)
- [Nuestra auditoría WCAG completa](/docs/qa/wcag-2.2-aa-audit.md)

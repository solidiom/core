---
contentSchemaVersion: 1
title: "Contributing"
description: "How to contribute to Solidiom: code, docs, accessibility, and community guidelines."
keywords: [contributing, open-source, github, community, guide]
locale: es
maturity: draft
product: "Solidiom"
productLayer: community
status: draft
translationSourceHash: "4e08bedd15e3700474c399f1b4518059b3634987b539b9787d8035168b387969"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-21"
---

# Contribuir a Solidiom

Solidiom se desarrolla en GitHub. Las contribuciones son bienvenidas en código, documentación, evidencia de accesibilidad y traducciones.

## Primeros pasos

1. Haz un fork del repositorio en GitHub
2. Clona tu fork e instala las dependencias:

```sh
git clone https://github.com/<your-username>/solidiom.git
cd solidiom
pnpm install
```

3. Crea una rama de trabajo:

```sh
git checkout -b feat/my-feature
```

## Flujo de desarrollo

```sh
pnpm run build          # Build all packages
pnpm run typecheck      # Type-check the workspace
pnpm run test           # Run unit tests
pnpm run test:browser   # Run browser tests
pnpm run lint           # Lint the workspace
```

## Qué puedes contribuir

- **Primitivos:** Nuevos componentes headless que siguen el DoD del primitivo (§8.1)
- **Recetas:** Recetas de estilos para los perfiles CSS, Tailwind o UnoCSS
- **Documentación:** Mejoras a las guías, la documentación de la API o las traducciones
- **Accesibilidad:** Registros de auditoría de teclado, pruebas con lector de pantalla, evidencia
- **Correcciones de errores:** Los issues etiquetados como `good first issue` son un excelente punto de partida
- **Plantillas:** Nuevas plantillas de aplicación que siguen la §8.4

## Directrices

- Todo el código debe pasar `pnpm run typecheck` y `pnpm run test`
- Usa los primitivos de Solidiom para el comportamiento interactivo (sin duplicar máquinas de estado)
- Sigue el requisito de documentación bilingüe (inglés + español)
- Incluye evidencia de accesibilidad para cualquier primitivo interactivo nuevo
- Usa `pnpm changeset` para documentar los cambios visibles para las personas usuarias

## Código de conducta

Seguimos el [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Sé respetuoso, inclusivo y constructivo.

## Contribuciones asistidas por IA

Las contribuciones asistidas por IA y generadas por IA son bienvenidas en este proyecto.

Consideramos que las herramientas de IA —incluidos los asistentes de programación, los grandes modelos de lenguaje y los agentes de desarrollo autónomos o semiautónomos— son herramientas de desarrollo. El código, la documentación, las pruebas, los diseños, los issues, los pull requests y cualquier otro contenido producido total o parcialmente con asistencia de IA se evaluarán con los **mismos méritos técnicos y estándares comunitarios que cualquier otra contribución**.

El uso de IA ni descalifica una contribución ni rebaja los estándares exigidos para su aceptación.

Las personas contribuyentes siguen siendo responsables de todo lo que envían. En particular, se espera que:

- **Comprendan y respalden su contribución.** Las personas contribuyentes deben poder explicar, revisar, modificar y mantener el trabajo que envían.
- **Verifiquen la corrección y la calidad.** La salida generada por IA debe recibir la revisión humana, las pruebas y la validación adecuadas antes de enviarse.
- **Cumplan los requisitos de licencia del proyecto.** Los términos de cualquier herramienta de IA utilizada no deben imponer restricciones que entren en conflicto con la licencia o las políticas de contribución de este proyecto.
- **Respeten los derechos de autor y la propiedad intelectual.** Las personas contribuyentes deben asegurarse de que el contenido generado no incorpore indebidamente material de terceros protegido por derechos de autor.
- **Proporcionen la atribución y la procedencia requeridas.** El código, el contenido u otro material de terceros debe conservar cualquier atribución, aviso o información de licencia que exija su licencia.
- **Cumplan los estándares de seguridad y mantenibilidad.** La asistencia de IA no exime a una contribución de la revisión de seguridad, las pruebas, la documentación, los requisitos arquitectónicos, las comprobaciones de CI o la revisión de código habitual.
- **Eviten trasladar la carga de la revisión a las personas mantenedoras.** Los grandes volúmenes de contribuciones sin revisar, de baja calidad, sin explicación o generadas de forma mecánica pueden rechazarse independientemente de si se usó IA.

El principio central es:

> **La asistencia de IA es bienvenida; la responsabilidad de la contribución sigue recayendo en la persona que la envía.**

La IA debe usarse para aumentar el criterio de ingeniería, no para reemplazarlo. Las personas mantenedoras pueden solicitar explicaciones adicionales, pruebas, información de procedencia o la divulgación de una asistencia de IA significativa cuando sea razonablemente necesario para evaluar una contribución.

Esta política está alineada de forma intencional con el enfoque de código abierto más amplio que promueve la Linux Foundation y que se refleja en las directrices comunitarias de la CNCF: las contribuciones generadas por IA pueden participar en el desarrollo normal de código abierto, siempre que cumplan las mismas expectativas de calidad, seguridad, licencias, procedencia, responsabilidad y revisión humana.

### Directrices relacionadas

- **Linux Foundation — Guidance Regarding Use of Generative AI Tools for Open Source Software Development:** [Linux Foundation Generative AI Policy](https://www.linuxfoundation.org/legal/generative-ai)
- **CNCF — Sustaining Open Source in the Age of Generative AI:** [CNCF: Sustaining Open Source in the Age of Generative AI](https://www.cncf.io/blog/2026/03/10/sustaining-open-source-in-the-age-of-generative-ai/)
- **CNCF — The State of AI in CNCF Projects:** [CNCF: The State of AI in CNCF Projects](https://www.cncf.io/blog/2026/04/29/the-state-of-ai-in-cncf-projects-a-first-look-at-the-data/)

Los proyectos y las organizaciones individuales pueden establecer requisitos adicionales para las contribuciones asistidas por IA cuando corresponda.

## Comunicación

- **Issues:** Informes de errores y solicitudes de funciones en GitHub Issues
- **Discusiones:** Debates de arquitectura y diseño en GitHub Discussions
- **Pull Requests:** Todas las contribuciones pasan por revisión de PR

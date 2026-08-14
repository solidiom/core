---
title: Certificado de Origen del Desarrollador
description: El requisito de firma DCO para contribuciones a Solidiom.
locale: es
translationSourceHash: "8fa25102c29787ebf6b6b86b36efec5aeef63c50c18150b90bf23bb1d571fa19"
translationStatus: draft
---

# Certificado de Origen del Desarrollador

**Fecha de efecto:** 2025-01-01

## ¿Qué es el DCO?

El [Developer Certificate of Origin](https://developercertificate.org/) (DCO) es una forma ligera para que los contribuyentes certifiquen que escribieron o tienen el derecho de enviar el código que están contribuyendo al proyecto.

Al firmar un commit, el certificador declara:

> Al hacer una contribución a este proyecto, certifico que:
>
> 1. La contribución fue creada total o parcialmente por mí y tengo el derecho de enviarla bajo la licencia de código abierto indicada en el archivo; o
> 2. La contribución se basa en trabajo anterior que, según mi conocimiento, está cubierto bajo una licencia de código abierto apropiada y tengo el derecho bajo esa licencia para enviar ese trabajo con modificaciones, ya sea creado total o parcialmente por mí, bajo la misma licencia de código abierto (a menos que esté permitido enviar bajo una licencia diferente), como se indica en el archivo; o
> 3. La contribución me fue proporcionada directamente por otra persona que certificó (1), (2) o (3) y no la he modificado.
>
> Entiendo y acepto que este proyecto y la contribución son públicos y que se mantiene un registro de la contribución (incluyendo toda la información personal que envío con ella, incluyendo mi firma) indefinidamente y puede ser redistribuido de acuerdo con este proyecto o las licencias de código abierto involucradas.

## Cómo Firmar

Incluye una línea `Signed-off-by` en cada mensaje de commit:

```
Signed-off-by: Tu Nombre <tu.email@ejemplo.com>
```

Usa la bandera `-s` con `git commit`:

```sh
git commit -s -m "Tu mensaje de commit"
```

El nombre y el correo electrónico deben coincidir con tu configuración de usuario de Git. Las contribuciones sin firma DCO no serán fusionadas.

## Por Qué Lo Requerimos

El DCO proporciona un registro que:

- Confirma que el contribuyente tiene el derecho de enviar el código
- Protege al proyecto de reclamaciones de derechos de autor
- Es más ligero que un CLA completo (Contributor License Agreement)
- Funciona para contribuyentes individuales y corporativos

## Alcance

El DCO se aplica a todas las contribuciones al proyecto Solidiom, incluyendo:

- Código, recetas y bloques
- Documentación y prosa
- Traducciones
- Archivos de configuración y scripts
- Issues y descripciones de pull request

## ¿Preguntas?

Si no estás seguro de si tu contribución puede llevar una firma DCO, abre un issue o contacta a los mantenedores antes de enviar.

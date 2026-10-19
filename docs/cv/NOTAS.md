# CV ATS — blanco y negro

`Doug-Vargas-CV.pdf` (con foto, para Colombia y LATAM) y `Doug-Vargas-CV-sin-foto.pdf` (para portales y
empresas de EE. UU.). Fuente: `cv-ats.template.html`. Regenerar: `python3 docs/cv/build.py`.

Este CV es independiente de `/cv` del sitio y de `public/cv/*.pdf` (que siguen siendo la versión oscura
con sello de huella). No reemplaza esos archivos.

## Qué cambió frente al PDF anterior

Revisión de tres agentes: especialista en ATS, reclutadora de RR. HH. y headhunter de liderazgo de producto.

- **Una sola columna, sin tablas ni columnas CSS.** Antes, Educación, Certificaciones, Idiomas y Habilidades
  iban en 3 columnas, y el texto extraído mezclaba columnas ("2006 — 2009 / 2018 / Español · Nativo").
- **Cada puesto en un orden fijo:** cargo → empresa – ciudad (modalidad) | MM/AAAA – MM/AAAA → viñetas.
  Antes el cargo y la ciudad salían pegados ("Head of Product Barranquilla") y las fechas en una columna
  aparte. Las fechas alineadas a la derecha también se leían como otra columna, por eso van en línea.
- **Fuentes TrueType estáticas.** Las variables de Google Fonts salen como Type 3 en el PDF; algunos ATS
  no extraen texto de Type 3.
- **Fondo blanco, texto negro**, como el modo claro de douguizard.com (`--ink #0a0a0a`, `--ink-muted #4f4e4b`).
- **Títulos de sección estándar:** Resumen profesional, Experiencia laboral, Experiencia anterior
  (antes "ANTES"), Habilidades, Educación, Certificaciones, Idiomas.
- **Viñetas con verbo + alcance + cifra**, sin el patrón "**Título**: explicación". Solo cifras que ya
  estaban en `src/data/cv.ts`; no se inventó ningún dato.
- **Solapamiento Qrvey/Ideaware resuelto:** Qrvey fue un proyecto de Ideaware, así que va como
  "Lead UI Designer — Ideaware (cliente: Qrvey)". Antes parecían dos empleos simultáneos.
- **Palabras clave añadidas** que ya eran verdad: design tokens, librería de componentes, user research,
  cross-functional, stakeholders, mentoría, fintech, Storybook.
- Herramientas antiguas fuera (InVision, Marvel, Balsamiq, Adobe XD, Sketch, Spline).
- Cargos en inglés, como en los contratos y en LinkedIn; el resto en español.

## Datos para confirmar

1. **Fin de Senior UX/UI Designer en Ideaware = 10/2016.** Supuse que el cambio a Qrvey fue la promoción.
2. **Aval: "más de 5 años".** 11/2018 – 01/2024 son 5 años y 2 meses; el sitio dice "seis años" en
   `site.ts` (`summaryLong`). Uno de los dos está mal.
3. **12 años de experiencia**, contados desde Smartbiz (10/2014), como `CAREER_ANCHOR`.
4. **Correo:** `hello@douguizard.com`. El PDF de 2026 traía el Gmail.
5. **Cifras que harían más fuerte el CV** (el headhunter las marcó; solo si existen): tamaño del equipo que
   lideras en Naowee y si SUID está en producción; % de adopción de Andes o tiempo ahorrado con las
   auditorías con IA; usuarios, conversión o NPS de la banca digital del Banco de Occidente.
6. **Inglés B1.** Para empresas de EE. UU. es el primer filtro. Si ya subió, actualízalo (y una
   certificación como EF SET o similar ayuda).

## Foto

Se queda el retrato de `public/portrait/doug-portrait-900.webp`, recortado y en escala de grises
(`portrait-cv.jpg`). Se probaron tres retratos con Higgsfield (Nano Banana Pro, dos estilos editoriales) y
Doug no eligió ninguno. Para cambiarla: reemplaza `portrait-cv.jpg` (cuadrada, ~420 px, centrada en la
cara) y corre `build.py`.

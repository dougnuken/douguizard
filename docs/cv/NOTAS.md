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

## Datos confirmados por Doug (19 oct 2026)

- **Aval: 5 años y 2 meses** (11/2018 – 01/2024). `site.ts` (`summaryLong`, en inglés y español) todavía dice
  "seis años"; corregirlo cambia la huella de `/cv` y obliga a regenerar `public/cv/*.pdf` con `npm run cv:pdf`.
- **Naowee: equipo de 2 personas** a cargo.
- **Inglés B1.**
- No hay cifras de adopción de Andes ni de NPS del Banco de Occidente: el CV no las menciona.

Sin confirmar: fin de Senior UX/UI Designer en Ideaware = 10/2016 (supuse que ahí fue la promoción a Qrvey).

## Foto

Se queda el retrato de `public/portrait/doug-portrait-900.webp`, recortado y en escala de grises
(`portrait-cv.jpg`). Se probaron tres retratos con Higgsfield (Nano Banana Pro, dos estilos editoriales) y
Doug no eligió ninguno. Para cambiarla: reemplaza `portrait-cv.jpg` (cuadrada, ~420 px, centrada en la
cara) y corre `build.py`.

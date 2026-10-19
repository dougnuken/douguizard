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

## Foto con Higgsfield (pendiente)

La generación no corrió: la cuenta de Higgsfield tiene 0,3 créditos (plan gratis) y Nano Banana Pro con
2 variantes a 2K cuesta 2. Mientras tanto, el CV usa `public/portrait/doug-portrait-900.webp` recortado y
en escala de grises.

El retrato ya está subido a Higgsfield (importado desde
`https://douguizard.com/portrait/doug-portrait-900.webp`). Con créditos: modelo **Nano Banana Pro**,
4:5, 2K, esa imagen como referencia y este prompt (adaptado del tuyo: cabeza rapada y barba en vez de
pelo suelto, ojo derecho nítido):

> Create an artistic editorial portrait of the exact man in the reference image, preserving his identity
> faithfully: bald shaved head, short dark beard and mustache, same face shape, eyes, nose and skin tone.
> Close-up bust framing, the face occupying a large portion of the frame, slightly off-center to the right,
> intense calm expression, direct gaze into the camera. He wears a dark black high-neck top (mock neck).
> Sophisticated contemporary aesthetic. The background is light and minimal, warm beige / off-white / very
> soft gray, with a subtle warm orange circular shape behind his head on the right side. Apply a strong
> horizontal motion blur effect passing mainly through the left side of the portrait, as if part of the face
> and body were dissolving into fast lateral streaks, with dark blurred bands mixed with warm orange and
> coral glowing accents, while the right side of the face remains sharp, detailed and recognizable,
> especially the right eye. Soft diffused studio light from the right. The final result should feel like a
> fine art fashion photograph, with subtle film grain texture, elegant contrast, a mysterious atmosphere and
> a clean finish, with no typography, no graphic elements and no interface.

Para usarla: guárdala como `docs/cv/portrait-cv.jpg` (cuadrada, ~420 px; recorta centrado en la cara) y
corre `build.py`. El CSS la pasa a escala de grises (`filter: grayscale(1)` en `.photo`); quita esa línea
si quieres conservar el naranja.

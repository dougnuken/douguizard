# CV ATS — blanco y negro

El CV que se descarga en la web es una hoja de una columna, en blanco y negro, pensada para pasar los
filtros ATS. Sale de los mismos datos que la página `/cv`:

- **Datos (fuente única):** `src/data/cv.ts` (inglés y hechos) y `src/data/es/cv.ts` (español). El
  resumen y las cifras de la cabecera del CV están en `profile` / `profileEs`.
- **Hoja:** `src/lib/cvSheet.ts` arma el HTML de cada idioma.
- **PDF:** `npm run cv:pdf` (`scripts/build-cv-pdf.ts`) imprime cuatro archivos con sus sellos, sin
  servidor: con foto `public/cv/doug-vargas-cv-es.pdf` y `public/cv/doug-vargas-cv.pdf`; sin foto
  `public/cv/doug-vargas-cv-es-sin-foto.pdf` y `public/cv/doug-vargas-cv-no-photo.pdf`. En `/cv` y `/en/cv`,
  "Descargar PDF" baja el de foto y "PDF sin foto" el otro, en el idioma de la página.
- **Foto:** `public/portrait/doug-cv-photo.jpg` (cuadrada, 480 px). La hoja la pasa a grises con
  `filter: grayscale(1)` en `.photo`.
- **Fuentes:** Archivo y Geist Mono como TTF estáticos en `scripts/cv-fonts/` (licencia OFL).

Si cambias algo que el CV imprime, corre `npm run cv:pdf`; si no, `npm test` falla.

## Qué cambió frente al PDF anterior (oct 2026)

Revisión de tres agentes: especialista en ATS, reclutadora de RR. HH. y headhunter de liderazgo de producto.

- **Una sola columna, sin tablas ni columnas CSS.** Antes, Educación, Certificaciones, Idiomas y Habilidades
  iban en 3 columnas, y el texto extraído mezclaba columnas.
- **Cada puesto en un orden fijo:** cargo → empresa (cliente) – ciudad (modalidad) | MM/AAAA – MM/AAAA →
  viñetas. Las fechas van en línea: alineadas a la derecha, se leían como otra columna.
- **Fuentes TrueType estáticas.** Las variables de Google Fonts salen como Type 3 en el PDF; algunos ATS
  no extraen texto de Type 3.
- **Títulos de sección estándar** y **viñetas con verbo + alcance + cifra**, solo con cifras reales.
- **Ideaware/Qrvey:** el rol Senior terminó en 10/2016 con el ascenso a Lead en Qrvey. Qrvey lleva
  `employer: "Ideaware"`, y el CV lo imprime como "Ideaware (Qrvey)".
- **Habilidades:** la web y el CV comparten grupos (Producto, Sistemas de diseño, Ingeniería, IA aplicada,
  Liderazgo). Fuera las herramientas antiguas (InVision, Marvel, Balsamiq, Adobe XD, Sketch, Spline).

## Datos confirmados por Doug (19 oct 2026)

- **Aval: 5 años y 2 meses** (11/2018 – 01/2024), igual en el CV y en la web.
- **Naowee: equipo de 2 personas** a cargo.
- **Ideaware:** de Senior UX/UI Designer a Lead UI Designer (Qrvey) en 10/2016.
- **Inglés B1.**
- No hay cifras de adopción de Andes ni de NPS del Banco de Occidente: el CV no las menciona.

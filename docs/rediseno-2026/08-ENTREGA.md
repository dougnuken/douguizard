# 08 · Entrega del rediseño a Doug

> Rama: `claude/douguizard-portfolio-redesign-9ivnau`. **Nada está desplegado ni fusionado en `main`**: eso lo haces
> tú, con los pasos de §4. Este documento es para leerlo de corrido; los detalles técnicos están en `F8-INFORME.md`.

## 1. Qué cambió (en simple)

- **El sitio entero pasó a la propuesta B «Cine → OS».** El inicio arranca como una escena de cine (tu foto detrás de
  un vidrio estriado, el láser a la altura de los ojos y el nombre con el «corte láser») y, al bajar, se arma un
  tablero tipo sistema operativo con tus casos, cifras, trayectoria y contacto.
- **Páginas nuevas o rehechas:** Trabajo (`/work`), Perfil (`/about`), Experiencia (`/experience`, la línea de tiempo
  animada) y los casos. Todo en español e inglés (`/en/...`).
- **Los casos se abren como una hoja** encima de la página, con su propia dirección (se puede copiar y compartir).
  Si alguien abre esa dirección directo, ve la página completa del caso.
- **Imagen del héroe:** la foto `960e1d8c` (ciudad nocturna, láser rojo). El vidrio estriado se «hornea» en la foto
  para que cargue rápido; el vidrio vivo (que reacciona al cursor) llega después.
- **Al compartir el enlace** (WhatsApp, LinkedIn, Slack) sale una tarjeta nueva con tu foto, tu nombre, el láser y el
  titular, una en español y otra en inglés.
- **Rápido y estable:** en un celular con red lenta, el inicio pinta su contenido principal en ~1,0 s y Perfil en
  ~1,9 s (la meta era 2,0 s). Nada salta mientras carga.
- **Si algo falla,** hay páginas de error y de «no existe» con el mismo estilo, en los dos idiomas.
- Se quitó lo que ya no se usaba: el laboratorio interno `/lab`, código y estilos del diseño anterior.

## 2. Verlo en tu computador (Windows, PowerShell)

Necesitas Node.js 20 o superior (`node --version`). En PowerShell, `npm` puede estar bloqueado por la política de
scripts; por eso los comandos usan `npm.cmd`, que siempre funciona.

```powershell
cd C:\ruta\a\douguizard
git fetch origin
git switch claude/douguizard-portfolio-redesign-9ivnau
git pull
npm.cmd ci                 # instala dependencias (la primera vez, ~1–2 min)
npm.cmd run build          # construye la versión de producción
npm.cmd run start          # la sirve en http://localhost:3000
```

Abre `http://localhost:3000` (español) y `http://localhost:3000/en` (inglés). Para cortar el servidor: `Ctrl + C`.

Para trabajar con recarga en vivo mientras cambias textos: `npm.cmd run dev` (más lento en la primera carga; para
juzgar velocidad usa siempre `build` + `start`).

Pruebas, si quieres correrlas:

```powershell
npm.cmd test                                  # pruebas de datos (vitest)
npx.cmd playwright install chromium           # una vez
npm.cmd run build
npx.cmd playwright test --trace off           # suite completa (~17 min)
```

## 3. Cómo cambiar las cosas tú mismo

### La foto del héroe

1. Pon la foto nueva (vertical 3:4, idealmente ≥ 1920 px de ancho) en `docs/rediseno-2026/retratos-hf/`.
2. En `src/data/hero.ts`, copia el bloque `foto("960e1d8c", 3, { ... })`, cambia el id, el tamaño (`tamano`), y
   ajusta `ojo` (altura de los ojos, de 0 a 1), `cara` y `laser` si la foto trae su propio láser. Cambia
   `fotoActiva` al id nuevo. Si solo retocas la misma foto, sube `version` en 1.
3. Corre `npm.cmd run hero:poster` (hornea el póster con el vidrio).
4. Con el sitio corriendo en el puerto 3131 (`npm.cmd run build` y luego `npx.cmd next start -p 3131`), corre
   `npm.cmd run og` para rehacer las tarjetas de compartir.
5. Borra la carpeta vieja de `public/hero/` si ya no la usas.

### El lockup del nombre

`src/app/fonts/lockup.ts`. Hoy es Geologica con SHRP 100 (el «corte láser»), servida como un archivo local de 14 KB.
El comentario del archivo explica cómo volver a Big Shoulders Stencil (la otra opción) cambiando una línea aquí y
`nombreLockup` en `src/data/decisiones.ts`.

### Las decisiones pendientes

Todas viven en `src/data/decisiones.ts`, con un comentario por línea. Cambias el valor, guardas y vuelves a construir.
La tabla de §5 dice qué controla cada una.

### Textos y datos

- Datos tuyos y SEO: `src/data/site.ts`. CV: `src/data/cv.ts` + `src/data/es/cv.ts`, luego `npm.cmd run cv:pdf`.
- Casos: `src/data/work.ts` (inglés y hechos) + `src/data/es/work.ts` (español).
- Textos de la interfaz: `src/i18n/*.ts`.

## 4. Desplegar (lo haces tú; aquí no se hizo nada)

El proyecto está en Vercel conectado a GitHub (`vercel.json`), y `main` es producción.

1. **Vista previa:** Vercel ya crea una URL de vista previa para cada push a la rama
   `claude/douguizard-portfolio-redesign-9ivnau` (en Vercel → proyecto → Deployments). Ábrela en tu MacBook y en tu
   celular y recorre la lista de §6.
2. **Decide las pendientes** (§5 y titulares de §6) y, si cambias algo, haz commit en la misma rama.
3. **Pull request** de la rama hacia `main` en GitHub; revisa el diff de `next.config.ts` (cabeceras y caché, sin
   cambios de seguridad) y fusiona. Vercel despliega `main` a `douguizard.com`.
4. **Después del despliegue (5 min):**
   - <https://pagespeed.web.dev/> con `https://douguizard.com/`, `/en`, `/about` y `/work/naowee-suid` en móvil.
     Meta: Rendimiento ≥ 90, Accesibilidad 100, Buenas prácticas ≥ 95, SEO 100; LCP ≤ 2,0 s; CLS ≤ 0,02.
   - Pega `https://douguizard.com` y `https://douguizard.com/en` en <https://www.opengraph.xyz/> (o en un chat de
     WhatsApp contigo mismo) para ver la tarjeta nueva. Si LinkedIn muestra la vieja, pásala por
     <https://www.linkedin.com/post-inspector/>.
   - En Google Search Console, vuelve a enviar `https://douguizard.com/sitemap.xml`.
5. **Si algo sale mal:** en Vercel → Deployments, el despliegue anterior → «Promote to Production» lo devuelve en
   segundos.

Nota: `DEPLOY-GUIDE.md` y `deploy-step-1.sh` son de la primera puesta en línea (hablan de Framer y R3F, que ya no se
usan). No hacen falta para este despliegue.

## 5. Lo que queda de tu parte

1. **Aprobar o corregir los titulares de los casos** marcados «borrador para Doug» (tabla en `F7-INFORME.md`,
   «Borradores para Doug»; viven en `src/data/work.ts` y `src/data/es/work.ts`). Si no dices nada, salen como están.
2. **Decisiones de `07` §4** (todas tienen un valor por defecto y ya funcionan; cambia solo lo que no te guste):

   | # | Qué | Hoy | Dónde |
   |---|---|---|---|
   | D1 | Disponibilidad | «Disponible para consultoría» | `decisiones.disponibilidad` + `site.ts` |
   | D2 | Orden de casos | Naowee → Andes → olbo → BdO → DC Medical → MakeaPet | `home.ordenCasos` |
   | D4 | Tema claro | solo en `/cv` | `decisiones.temaClaroEn` |
   | D5 | Titular EN | «I direct the product. Then I build it.» | `src/i18n/tablero.ts` |
   | D7 | Foto del héroe | `960e1d8c` | `src/data/hero.ts` |
   | D8 | Datos faltantes (04 §7) | se omiten; sin cifras nuevas | `src/data/*` |
   | D9 | PDF del botón del héroe | ES con foto, EN sin foto | `decisiones.pdfPorIdioma` |
   | D10 | Cita de Francesca en el inicio | no aparece | `decisiones.citaFrancescaEnHome` |
   | D11 | Colofón | «Diseñado por mí; construido con Next.js y agentes de IA que dirijo.» | `decisiones.colofon` |
   | D12 | Teléfono | solo en el CV | `decisiones.telefonoEnHome` |
   | D13 | Nombre en K1 | «Doug Vargas» | `decisiones.nombreK1` |
   | D14 | Título del inicio en ES | en inglés (`site.titleHeadline`) | `site.ts` |
   | D15 | «Tinder para mascotas» | se queda | `work.ts` |
   | D17 | Microcopy nuevo («Cerrar», «Secciones», «Aquí no hay nada.»…) | como está | diccionarios |
   | D18 | KPI de olbo | el actual | `work.ts` |
   | D20 | Doto mínimo | 20 px | tokens |
   | D21 | Hoja desde `/work`, `/about`, `/experience` | sí | `decisiones.hojaDesdeIndices` |

   Además: plataformas de Banco de Occidente, Qrvey e Ideaware (`platforms` en `work.ts`); marcas de `/about`
   (8 vs 7), título «DC Medical Aesthetics», Chub.
3. **fps en tu MacBook** (y si puedes en un Android de gama media): en Chrome, `F12` → «Rendering» → «Frame Rendering
   Stats»; baja despacio por el inicio y mueve el cursor sobre la foto. Meta: ≥ 55 fps la mayor parte del tiempo.
4. **Safari y Firefox:** el proxy de este entorno no dejó bajar WebKit ni Firefox para probarlos aquí. En tu Mac:
   abre el inicio, `/en`, un caso desde el tablero (debe abrir la hoja; `Esc` la cierra) y `/work/olbo` directo, en
   Safari y en Firefox. O con las pruebas: `npx.cmd playwright install webkit firefox` y luego
   `$env:PW_NAVEGADORES="1"; npx.cmd playwright test navegadores --trace off`.
5. **VoiceOver** en Safari: un recorrido corto del inicio y de la hoja de un caso.
6. **PageSpeed / Lighthouse tras el deploy.** Aquí Accesibilidad, Buenas prácticas y SEO dieron 100, pero
   Rendimiento móvil quedó en 65–86 porque este entorno no tiene tarjeta gráfica y el vidrio animado se dibuja muy
   lento. En producción y en un teléfono real debería subir. Si sigue por debajo de 90, avísame: el arreglo es
   encender el vidrio animado en el celular solo cuando alguien lo toque (la foto ya trae el vidrio dibujado).

## 6. Recorrido de revisión (en la vista previa)

Inicio ES y EN · bajar del cine al tablero · abrir un caso (hoja), cerrar con `Esc`, con la X y con «Atrás» · copiar
la dirección de un caso y abrirla en otra pestaña (página completa) · Trabajo, Perfil, Experiencia · `/cv` y sus PDF ·
una dirección que no existe (`/hola`) · el celular en vertical · con «Reducir movimiento» activado en el sistema.

## 7. Checklist final (`07` §5) con lo verificado

Leyenda: [x] verificado aquí · [~] parcial o con nota · [ ] pendiente (de Doug o de la QA final).

**Pruebas y build**
- [x] `npm run lint`, `npm test` (vitest 252/252), `npm run build`: sin errores ni avisos nuevos.
- [~] `npx playwright test`: **518/518 en Chromium, dos corridas seguidas**. WebKit y Firefox: no se pudieron bajar
      aquí (proxy); el smoke está listo (`navegadores.spec.ts`, ver §5.4). Pruebas cambiadas o retiradas:
      - retiradas: las del lab en `lockup.spec` (solo corrían con `DG_LAB=1`, no estaban en los 513) y la de
        `lib/spring.ts` en vitest (−6; el archivo no lo usaba nadie);
      - nuevas: `navegadores.spec` (3), `seo E1b` (OG por idioma), `lockup` «toda var() resuelve en `/`» (pasa del
        lab a `/`); `seo E1` ahora exige la OG del idioma; `decisiones.test` acepta Geologica local.
- [x] axe sin violaciones en la matriz de `a11y.spec` (ES y EN, con la hoja); Lighthouse Accesibilidad 100 en las 4
      rutas medidas.

**Visual**
- [ ] Matriz final de capturas (5 anchos × ES/EN × RM, ancla, hoja): para la QA final. Cambios visibles de F8: en
      móvil, el nombre y el estado de K2 van uno debajo del otro; la «d» de la marca va en 600.
- [ ] Puntuación del crítico ≥ 8,6: QA final.

**Comportamiento**
- [x] Sin JS, sin WebGL, sin GSAP y con reduced-motion: cubierto por la suite (escena, vidrio, motion, hoja).
- [x] Teclado (skip link, foco en la hoja atrapado y devuelto) y táctil (≥ 44 px, arrastre): suite (`keyboard`,
      `hoja`, `layout`).
- [x] URL de cada caso compartible; Atrás cierra la hoja; recarga → página completa; ES ↔ EN: `hoja.spec`,
      `i18n.spec`, smoke.

**Rendimiento** (`perf-F8.json`)
- [x] LCP móvil ≤ 2,0 s: `/` 1.040 ms, `/about` 1.920 ms (Slow 4G, CPU × 4); escritorio ≤ 1,2 s: 348 / 516 ms.
- [x] CLS ≤ 0,02: `/` 0 (antes 0,066), `/about` 0,0002.
- [~] TBT ≤ 200 ms: **no** en Lighthouse local (650–1.550 ms; WebGL sin GPU en el contenedor). Verificar en PageSpeed.
- [x] GSAP no se pide antes del LCP ni en móvil ni con RM; WebGL diferido (pruebas de F4/F5 en verde).
- [~] Lighthouse móvil: 100 / 100 / 100 en Accesibilidad, Buenas prácticas y SEO; Rendimiento 65–86 aquí → **Doug
      corre PageSpeed tras el deploy**.
- [ ] fps en hardware real (MacBook, Android medio): **Doug**.

**Contenido, SEO y seguridad**
- [x] Ningún `[DATO A CONFIRMAR]` ni marcador de copy (`copy.sinMarcadores`, `grep`); datos solo desde `src/data`.
- [x] Sitemap con `/work`, `/about`, `/experience` y casos (ES/EN); `hreflang`, canonical, JSON-LD (Person,
      ProfilePage, ItemList, BreadcrumbList); **OG nuevo por idioma** con la foto `960e1d8c`.
- [x] CSP y cabeceras sin cambios (S1–S6 en verde); nada desde otro origen.
- [x] `/cv`, sus PDFs y los dos 404 funcionan (suite); además, páginas de error nuevas.

**Configuración y entrega**
- [x] Cambiar la foto = `hero.ts` + `npm run hero:poster` (probado en F8: `960e1d8c` v3); lockup =
      `src/app/fonts/lockup.ts` (probado: pasó a la instancia local); decisión = `src/data/decisiones.ts`
      (`decisiones.test`).
- [x] Sin `/lab`, sin `DG_LAB`, sin código muerto conocido; README con el stack real.
- [x] Todo en la rama `claude/douguizard-portfolio-redesign-9ivnau`. **Sin push a `main` ni deploy.**

# Pulido I · H-B · láser «Cíclope» (10 nov 2026)

## Qué cambió

- **Destello en cada retina**: disco con núcleo casi blanco, corona roja y halo amplio, más una chispa horizontal
  y otra vertical mínima, anclado a la pupila de la foto activa.
- **Raya anamórfica**: núcleo largo y fino de punta a punta, brillo central más grueso y dos halos; **bloom del
  haz** de lado a lado con más cuerpo cerca de la cara; **dos reflejos fantasma** discretos sobre el eje.
- **Línea fina** (`.k1-laser`): en el héroe pasa de casi blanca a roja (el núcleo caliente lo pone la raya); en
  móvil, más tenue en las puntas. En el tablero OS de escritorio queda como en F3, sin tocar.
- **Scroll**: en el acto 1 (≥ 1024) `useScrollScene` baja la opacidad con `atenuacionDestello(p)` (1 en p = 0,
  ≈ 0,55 en p = 0,3, 0 desde p = 0,62; en el OS el destello no se pinta) y vuelve al regresar. Por debajo de 1024
  se apaga mientras K1 sale por arriba, con `view-timeline` (CSS, sin JS).
- **Pulso** lento y desfasado por capa (5,6 s retinas, 8,2 s raya, 6,8 s haz); entrada única de 700 ms tras el
  trazo del láser. Con `prefers-reduced-motion`: fijo, sin pulso, sin entrada y sin la animación de scroll.

## Cómo está hecho

- Geometría: todo cuelga de la caja pintada de la foto dentro de `.k1-foto` (`--f-ox/oy/dx/dy`): `cover` anclado
  arriba en reposo, la cuenta de `escena.css` en p = 0 sin JS, y px escritos por `useScrollScene` durante el
  viaje. `--u` = 1 % del ancho de la foto, así el destello escala con ella.
- Datos: `hero.ts` gana `ojos?: [[x, y], [x, y]]` (medido en el máster de las dos fotos), `ojosDe()` con
  estimación si falta, y cuatro variables nuevas en `varsFoto()`. No cambia ningún campo existente.
- Rendimiento: degradados pintados una vez; solo se animan `opacity` y `scale`. Nada anima `filter`, sombras ni
  degradados. Un `IntersectionObserver` pausa el pulso fuera de pantalla. El grupo usa `mix-blend-mode: screen`.

**Archivos:** `escena/destello.css`, `destello.ts`, `__tests__/destello.test.ts` (nuevos) · `escena.css` (color
de la línea) · `useScrollScene.ts` · `Escena.tsx` · `tablero/K1Retrato.tsx` · `data/hero.ts` · `escena.spec.ts`.

## Pruebas

- vitest: 28 archivos, 271 pruebas en verde (4 nuevas).
- Playwright en el puerto 3102, `--workers=2 --trace off`: `escena.spec` 20/20 (2 nuevas) y `tablero`, `lockup`,
  `hero320`, `motion`, `vidrio`, `f3-arreglos` 87/87.
- Anclaje medido: error ≤ 0,05 px entre el centro de cada destello y la pupila calculada desde el póster, en
  p = 0, 0,3 y 0,5 a 1440; en p = 0 solo con CSS a 1280×720, 1440×900 y 1920×1080; y a 320, 390 y 768.
- Capturas y vídeo en `capturas/`: `hb-1440-{p0,p0-ojos,p03,os}.png`, `hb-390-{p0,p0-ojos,p03,os}.png`,
  `hb-scroll-1440.webm`, `hb-scroll-390.webm`.

**Prueba reescrita:** `escena.spec` «0 fps en reposo» exigía 0 animaciones vivas. Ahora admite solo el pulso del destello (`dst-late`,
`dst-raya`, `dst-haz`; como mucho 4) y comprueba que solo tocan `opacity`/`scale`/`transform`. Los topes de CLS,
rAF y «el vidrio no pinta en reposo» siguen igual.

## Desvíos

- `playwright.config.ts` fija el puerto 3131 y no es de mi frontera: usé una configuración temporal fuera del
  repo que lo hereda y cambia el puerto a 3102. No queda nada de eso en el repo.
- En escritorio con reduced-motion (o sin JS) no hay acto 1: se ve el tablero OS con la línea fina, sin destello.
  El «destello fijo sin pulso» aplica donde hay héroe: móvil y tableta.
- En móvil no hay «tablero OS»: `hb-390-os.png` es la página un viewport más abajo y `hb-390-p03.png` el héroe
  saliendo al 30 %.

## Sin verificar / pendientes

- **TBT y Lighthouse no medidos**: la máquina estaba cargada por otros agentes. No añadí JS al arranque (un
  observer y cuatro `setProperty` por cuadro de scroll), pero el coste de `mix-blend-mode` sobre el canvas del
  vidrio en un móvil real no está medido. Si pesa, se quita esa línea y el destello sigue leyéndose.
- Solo probado en Chromium. Sin `view-timeline` (Firefox) el destello no se atenúa en móvil: sale con la foto.
  Safari y la foto provisional `199598aa` (ojos medidos, no vistos en pantalla), sin comprobar.
- No se revisó junto al barrido automático de H-A (otro worktree): conviene mirar los dos juntos al integrar.
- Intensidad: el núcleo blanco cubre el iris a propósito. Si Doug lo quiere más sobrio, basta bajar los
  porcentajes del primer degradado de `.dst-ojo`.

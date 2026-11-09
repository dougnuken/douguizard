# Pulido F · P2 de la crítica E (pie, anclas, año de /experience, alto del home)

Rama `claude/douguizard-portfolio-redesign-9ivnau`. Sin despliegue. Fuente: `pulido-E/06-CRITICA-E.md` P2-1, 2, 5 y 6.
No se tocaron el P2-3 (títulos de K14: copy de Doug) ni el P2-4 (Trayectoria con 3 hitos a 360–375: decisión de Doug).
Medidas con build de producción (`next start -p 3100`), Chromium sin cabeza, RM salvo en /experience.

## 1 · Pie: fila base con un solo cuerpo (`767a1b4`)
- **Causa**: `.pie-b` va a 14 px y solo el colofón bajaba a 12 (`.pie-b-colofon`). En móvil la base entera ya iba a 12, así que el desajuste solo se veía a ≥ 1024: © a 14 px y colofón a 12 en la misma línea.
- **Arreglo** (`paginas-b.css`): el cuerpo de 12 px pasa a `.pie-b-base` (todas las anchuras); se quitan la regla del colofón y la duplicada de móvil. 12 y no 14: es la línea legal/colofón, y móvil ya la tenía así (no cambia su alto).
- **Prueba** (`pie-b.spec.ts`, 4 casos: `/` y `/en/about` × 1440/390): los dos `<p>` de la base con el mismo cuerpo y a 12 px. **Antes: falla a 1440 (14 · 12), pasa a 390.**
- Captura: `F-pie-base-1440.png`.

## 2 · Anclas del home: el rótulo a 24 px de la cabecera (`4254fe7`)
- **Causa**: `[data-seccion]` tenía `scroll-margin-top: var(--cabecera)` (88). En escritorio el ancla es la card y su canto queda a 88 − 64 = 24 px de la cabecera. En móvil (< 1024) el rótulo visible de la sección (`.seccion-titulo`, «Trabajo», «Experiencia», «Perfil», «Contacto») va **antes** del ancla (24 px de línea + 12 de gap): con 88 de margen el rótulo quedaba a y = 52, **4 px por debajo del canto** de la cabecera (56). Pasaba en las cuatro secciones, no solo en `#contact`, y por todas las vías (dock en el home, dock desde /about con `/#contact`, «Escríbeme» de K5, URL directa).
- **Arreglo**: una sola regla, `scroll-margin-top: calc(var(--header-h) + 24px + var(--rotulo-seccion, 0px))` (`chrome.css`); en móvil el tablero declara `--rotulo-seccion: calc(1.2 * var(--t-20) + var(--gap))` = 36 px (`tablero.css`, junto al estilo del rótulo, así sigue al token si cambia). Escritorio: 88 (sin cambio). Móvil: 116 → rótulo a y = 80, **24 px bajo la cabecera** en las cuatro secciones. Los casos ya usaban su propio margen (`caso.css`), no se tocan. El espía de secciones corta a 0,35 × vh (≥ 199 px), así que sigue marcando bien.
- **Prueba** (`tablero.spec.ts`): «ancla #id @w: el rótulo queda 24 px bajo la cabecera» para `work`, `experience`, `about`, `contact` × 390/1440 (8), y «390: Contacto del dock (home y desde /about)…» (dock desde /about, luego Perfil y Contacto con el dock en el home). **Antes: las 4 de 390 y la del dock fallan (rótulo a −4 px); las de 1440 pasan.**
- Captura: `F-contacto-dock-390.png` (/about → Contacto: cabecera 56, rótulo 80).

## 3 · /experience móvil: la cifra fija es el año de inicio del hito activo (`29434fc`)
- **Causa**: en móvil el `y` de la escena recorre el periodo del hito activo mientras su tarjeta cruza el 55 % de la pantalla (inicio → fin), y el odómetro mostraba `floor(y)`: con «Ago 2017 — Nov 2018» pasaba a 2018 a mitad de tarjeta.
- **Regla**: el año es el de **inicio del hito activo**. Cambia a la vez que la tarjeta activa y que el círculo que enciende la punta del hilo (mismo umbral), y coincide con escritorio, donde cada hito se lee en `p = pDe(i)` ≈ su año de inicio. Al final del recorrido (fondo de la página) la cifra llega a hoy, con el chip «Hoy», como en `p = 1` de escritorio. Los acumulados, tramos y el hilo siguen siendo continuos.
- **Arreglo** (`TrayectoriaCliente.tsx`): `enAnio(y, activo, anioForzado)`; el móvil pasa `floor(hitos[activo].inicio)` salvo al final.
- **Prueba** (`experience.spec.ts` «año fijo 390»): 30 posiciones de scroll; en cada una la cifra = primer año del periodo de la tarjeta activa, ≥ 4 años distintos vistos y, al fondo, el año actual. **Antes: falla** (la cifra se adelantaba al año de fin dentro de la tarjeta).
- Captura: `F-experience-anio-390.png` («Ago 2017 — Nov 2018» activo, cifra 2017).

## 4 · Alto del home a 390: de 15 a 47 px de margen (`def1ff3`, `81a9db1`)
- **Gaps dobles** (`def1ff3`, `tablero.css`, solo < 1024): entre K5 y «Más trabajo» había 24 px (el `--gap` inferior de la escena + el margen superior de `.os-resto`) y entre Contacto y la losa del pie 32. Ambos pasan al `--gap` del tablero (12): el pie es una losa más. −32 px sin quitar contenido ni tocar tipografía, relleno de cards ni blancos táctiles.
- **Fuga de CSS entre rutas** (`81a9db1`, encontrada al medir la vía del punto 2): tras navegar en cliente a `/#contact`, la hoja de la ruta anterior sigue cargada. `.firma` de /about (`display: grid`) volvía rejilla la firma de K15 (+51 px) y `.contador` de /experience (sticky, 72 px de relleno) inflaba los contadores de los dos carruseles (+157 px). El home llegaba a **5.068 px desde /about y 5.174 desde /experience**: por encima del presupuesto justo en la vía «Contacto» del dock, y con K15 y los carruseles desmontados. Arreglo: `.testimonios .firma` (`perfil.css`) y `.exp .contador` (`trayectoria.css`). Comprobado: tras llegar desde /about, /work y /experience, ningún elemento de `main` cambia de alto (0 de todos) a 390 y 1440; desde /cv el alto total es el mismo.
- **Resultado**: home a 390 **5.049 → 5.017 px** (ES; EN 5.006 → 4.974), margen **15 → 47 px** frente a 5.064; con emulación de móvil (`isMobile`, táctil) 4.999. El límite de `tablero.spec.ts` no se tocó.
- **Prueba**: la existente (`tablero.spec.ts` «≤ 5.064 px a 390») y una nueva por ruta: «390: el home mide lo mismo llegando por el dock desde /about | /work | /experience» (alto = carga directa y ≤ 5.064). **Antes: /about 5.068 y /experience 5.174 ≠ 5.017.**
- Captura: `F-home-final-390.png` (Contacto → pie con un solo gap).

## Verificación
Tras los cinco commits de arreglo: lint ✔ · `tsc --noEmit` ✔ · vitest **258/258** ✔ · build ✔ · Playwright completo
(`--trace off`, sin `retries`, `next start -p 3100`): **611/611** ✔ en 26,8 min (594 anteriores + 17 nuevas: 4 del pie,
8 de anclas, 1 del dock, 1 del año de /experience, 3 de alto por ruta). Sin fallos, así que no hubo que repetir nada por
intermitencia. Las 14 pruebas de los puntos 1, 2, 3 y 4 (sin las de ruta) se corrieron también contra el build sin
arreglos: fallan las 8 esperadas (pie a 1440 ×2, anclas a 390 ×4, dock, año). Home a 390: **5.017 px** (≤ 5.064).

## Capturas (build + `next start`)
`F-pie-base-1440.png`, `F-contacto-dock-390.png`, `F-experience-anio-390.png`, `F-home-final-390.png`.

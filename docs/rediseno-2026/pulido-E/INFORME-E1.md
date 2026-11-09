# Pulido E · E1 · cromo (ES/EN, dock «Contacto», pie)

Rama `claude/douguizard-portfolio-redesign-9ivnau`. Sin despliegue. No se tocaron `tablero/`, `perfil/` ni `/experience`.

## 1 · Burbuja ES/EN: círculo perfecto (`0ddaf69`)
- **Causa del «huevo»**: la burbuja era el content-box de la opción con `background-clip: content-box` y `border-radius` de pastilla. El radio interior se calcula restando el relleno de cada lado, y el relleno es asimétrico (2 / 10 px en horizontal, 6 en vertical): esquinas elípticas de 20×16 y 12×16 px.
- **Arreglo**: la burbuja es un `::after` propio de 32 × 32 con `border-radius: 50 %`, con el mismo inset (4 px del canto de la pastilla en los 4 lados). La burbuja viajera (`.idioma::before`, 32 × 32, 50 %) solo se traslada: sin `scaleX` ni cambio de ancho.
- **Prueba** (`f3-arreglos.spec.ts` «pulido D · inset concéntrico», ES y EN, 1440 y 390): ancho = alto ±0,5 px, radio `50%`, opacidad 1 en reposo, inset 4 px y radios concéntricos.

## 2 · Dock «Contacto» sin viaje ni ida y vuelta (`02573bb`)
- **Causa**: desde una página B (`/about`, `/work`…), «Contacto» navega a `/#contact`. Al montar el home, el `scroll-behavior: smooth` de `html` bajaba **desde el scroll heredado** hasta el ancla (~0,7 s) y el scroll-spy marcaba cada sección por la que pasaba: Trabajo → Experiencia → Perfil → Contacto. En el home mismo no pasaba (allí `irASeccion` ya fija la sección durante el scroll).
- **Arreglo**: el espía (`SiteHeader`) lee el `#ancla` al montar: marca esa sección de inmediato y salta a ella sin animación (`behavior: "instant"`). El dock, al tocar «Contacto» fuera del home, deja `contact` en el store para que el dock del home nazca ya marcado (sin fotograma vacío).
- **Prueba** (`dock-pulido.spec.ts` «pulido E», 390×844, `/about`, `/work`, `/en/about`): en el home solo se marca `#contact` y hay ≤ 2 fotogramas entre el scroll heredado y el destino. **Sin el arreglo falla (3/3); con él pasa.**
- Vídeo: `dock-contacto-390.webm` (/about → Contacto).

## 3 · Pie rediseñado (sistema B)
- **Losa** (`--losa`, filo, `--r-losa`) con: wordmark «d douguizard» (el mismo componente de la cabecera, enlaza al inicio), línea de cierre, correo, disponibilidad (`availability.note` con el punto láser de `Estado`), dos listas con rótulo — *En este sitio*: Trabajo · Perfil · Experiencia · CV; *En otros sitios*: LinkedIn · Behance · GitHub · Correo — y una base con © · Barranquilla · UTC-5 · colofón (D11).
- **Cierre** (`sistema.pie.cierre`, paridad ES/EN por tipo): «Diseño productos y los construyo. Si tienes uno entre manos, hablemos.» / «I design products and build them. If you have one in the works, let's talk.» No añade datos: reformula el posicionamiento (Product Designer → Design Engineer).
- **«Volver arriba»** es un `<button>` circular de 48 px con la flecha del sistema (`BotonArriba.tsx`): hover blanco con la flecha subiendo 2 px, `:active` 0,94, foco con anillo; sube en suave (instantáneo con RM), lleva el foco a `#main` y limpia el `#ancla`.
- **Móvil (< 1024)**: el home tiene presupuesto de alto (≤ 5.064 px a 390, `tablero.spec.ts`), y la primera versión lo pasaba (5.370). El pie se compacta: la flecha sube a la fila del wordmark, los enlaces fluyen en dos renglones (los rótulos quedan solo para lector), el correo vive en la lista (en el home también en «Contacto»), cierre a 18 px. Home a 390: **5.034 px**. La losa termina por encima del dock (84 px + safe-area de margen inferior).
- Detalle técnico: con la losa en rejilla, el `grid-column/row` de un absoluto define su bloque contenedor (CSS Grid §9.2); en móvil la flecha los vuelve a `auto` para quedar centrada con el wordmark.
- **Prueba** (`pie-b.spec.ts`, 8 casos: ES/EN × 1440/390): wordmark, cierre, «Barranquilla · UTC-5», orden exacto de los 8 enlaces, botón circular ≥ 44 px con radio 50 %, ningún `a[href="#main"]`, sin scroll horizontal, losa por encima del dock y el botón deja `scrollY = 0`.

## Verificación
lint ✔ · tsc ✔ · vitest 258 ✔ · build ✔ · Playwright completo: 577 ✔ / 1 ✘ (el presupuesto de alto del home a 390 con la primera versión del pie); tras compactar el pie móvil, las 222 pruebas de las suites afectadas (pie, tablero, layout, f7, teclado, a11y, dock, f3, controles) ✔. La corrida completa contó 578 pruebas (incluye las 11 nuevas: 3 del dock y 8 del pie), sin `skip` ni `retries`; no se repitió completa tras el ajuste final por el límite de uso.

## Capturas (build + `next start`)
`zoom-idioma-{es,en}.png` (×4), `footer-1440-{es,en}.png`, `footer-390-{es,en}.png`, `dock-contacto-390.webm`.

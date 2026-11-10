# Rediseño douguizard 2026 · ESTADO y protocolo de sesiones

> Archivo de traspaso. Una sesión nueva (orquestador o fase) lee **este archivo primero** y nada del historial de chat.
> Actualízalo al cerrar cada fase. Rama de trabajo: `claude/douguizard-portfolio-redesign-9ivnau` (nunca `main`;
> no se despliega sin Doug).

## Protocolo para ahorrar contexto y tokens (pedido de Doug)

1. **Una sesión por fase.** El orquestador abre una sesión nueva para cada fase (diseño, ejecución F1…F8, QA,
   crítica) con un prompt corto que apunta a archivos; no retoma agentes viejos ni pega historial.
2. **Los archivos son la memoria.** Cada sesión lee solo lo que su fase necesita (lista abajo) y deja su salida en
   `docs/rediseno-2026/` + este `ESTADO.md` actualizado + commit y push a la rama.
3. **Lectura acotada.** Nada de leer archivos enteros grandes: `grep -n` y rangos. Capturas: solo las necesarias.
4. **Modelo y esfuerzo:** diseño, crítica y ejecución → Opus, esfuerzo alto; tareas mecánicas (capturas, codemods,
   verificación) → Sonnet, esfuerzo medio.
5. **Cierre de fase:** el orquestador valida contra `00-BRIEF.md` §6 y el criterio de aceptación de la fase en
   `07-PLAN-IMPLEMENTACION.md`, hace commit/push y actualiza este archivo.
6. Si una sesión se corta por límite de uso, la siguiente retoma desde este archivo y `git log`, no desde el chat.

## Decisiones de Doug (vigentes)

- **Propuesta B «Cine → OS»** aprobada. Landing de referencia: `referencias/ref-8-landing-elegido-B-os.jpg`.
- **Nombre:** lockup **«corte láser»** (opción 4 de `propuestas/B-tipo/`, Geologica; el láser parte «Vargas» y el
  corte se cierra cuando la foto se encoge). Resto: Urbanist + Instrument Sans + Doto (solo cifras/fechas).
- **`/cv` en el cromo B, siempre oscuro** (Doug, 8 nov; antes conservaba su tema claro).
- **Sin máscara** ni revelado. Héroe = foto + vidrio estriado oblicuo; el cursor solo abre/aclara el vidrio.
- **Imagen del héroe (7 nov): `retratos-hf/960e1d8c.jpg`** (Higgsfield, ciudad nocturna, láser rojo en los ojos, 896×1200), activa en `src/data/hero.ts`. Antes en pausa: Provisional `retratos-hf/199598aa.jpg` (láser rojo, gorra NY, sin lentes, 880×1168).
  Lo explorado no convenció (`heroe/`). Gusto: `referencias/ref-6`, `ref-7` (render 3D hiperdetallado, gear gastado)
  pero **fondo oscuro**. Se le dará dirección de arte después.
- **Experiencia:** motion graphics que cuentan los años como línea de tiempo (maqueta en `propuestas/B-paginas/`).
- Casos: hoja sobre el tablero **con URL real** (rutas interceptadas `@modal/(.)work/[slug]` + página completa).

## Estado (6 nov 2026)

| Bloque | Estado | Dónde |
|---|---|---|
| Brief, fundamentos, UX, técnica, copy | ✓ | `00`–`04` |
| Propuestas A/B, críticas, comparación | ✓ | `propuestas/A`, `propuestas/B`, `05`, `06-CRITICA-*` |
| Lockups del nombre | ✓ (elegido 4) | `propuestas/B-tipo/` |
| Páginas internas (Trabajo, caso, Perfil, Experiencia) | maquetas ✓ · crítica ✓ · P0+P1 aplicados ✓ (`NOTAS.md` §7; Tab sin focos invisibles; cabe a 1280×720) · 12 P2 pendientes · **aprobadas por Doug** (6 nov) | `propuestas/B-paginas/`, `06-CRITICA-PAGINAS.md` |
| Plan de implementación (revisado contra el código; lockup y páginas internas integrados 6 nov) | ✓ | `07-PLAN-IMPLEMENTACION.md` |
| **F0** base técnica | ✓ next 16.4.5 · react 19.3.1 · gsap 3.15.1 · sharp; vitest 149/149, Playwright 269/269; LCP / móvil 4.456 ms, escritorio 1.576 ms, JS 157,6 KB gz | `F0-INFORME.md`, `baseline-F0.json` |
| **F1** sistema de diseño en código | ✓ ejecutor: vitest 197/197, Playwright 270/270, lockup.spec 11/11; JS / 158,4 KB gz (= base), LCP sin cambio · QA ✓ · P0+P1 arreglados ✓ (Doto pinta; lockup.spec 17/17) · 7 P2 van con F2/F3 · **F1 ✓** | `F1-INFORME.md`, `F1-capturas/`, `06-CRITICA-F1.md` |
| F2 rutas /work /about /experience | ✓ ejecutor: vitest 222/222, Playwright 389/389; JS / 158,4 KB gz (= base); LCP móvil /about 2,56 s (meta 2,0 → F4/F8, registrado en 07) · QA ✓ 8,2/10: 0 P0, 2 P1, 6 P2 · P1-1 (bordes de la foto) + P2-1/2/4 arreglados ✓ · **F2 ✓** | `F2-INFORME.md`, `F2-capturas/` |
| F3 tablero OS + cromo nuevo | ✓ ejecutor: vitest 227/227, Playwright 404/404 (shell retirado, pruebas reescritas); JS / 152,3→**−6,1 KB gz** vs base; LCP móvil / 2,97 s (−1,5 s; meta 2,0 → F4/F8) · QA ✓ 8,3/10: 0 P0, 3 P1, 7 P2 · P1 arreglados ✓ (vitest 227/227, Playwright 414/415: `experience.spec.ts:173` intermitente → se arregla al inicio de F4) · **F3 ✓** | `F3-INFORME.md`, `F3-capturas/` |
| F4 vidrio WebGL2 + póster horneado | ✓ ejecutor: vitest 236/236, Playwright 424/424 ×2 corridas (`experience.spec:173` estable); JS / 151,9 KB gz; **LCP móvil / 1,00 s ✓** (CSS en línea); `/about` móvil 2,95 s → F8 · QA ✓ 7,7/10: **1 P0 (estrías verticales, no oblicuas)**, 3 P1, 5 P2 · P0+P1 arreglados ✓ (estrías 12° en los tres héroes, antialias, lente medible; Playwright 424/424; LCP / móvil 980 ms) · **F4 ✓** | `F4-INFORME.md`, `F4-capturas/` |
| F5 acto 1 «cine» + scroll anclado | ✓ ejecutor: vitest 247/247, Playwright 436/436 ×2; JS / 157,5 KB gz; LCP sin regresión vs F4 · QA ✓: **2 P0** (bordes duros de la foto en el acto 1; nombre tapado por K2 a p≈0,3), 3 P1 · P0+P1 arreglados ✓ (foto fundida, nombre visible, cara atenuada, 1280 cabe; Playwright 440/440 ×2; LCP móvil 1,04 s) · **F5 ✓** (pendiente pulido: estrías sobre la atmósfera; CLS móvil 0,066) | `F5-INFORME.md`, `F5-capturas/` |
| F6 casos en hoja con URL real | ✓ ejecutor: vitest 255/255, Playwright 464/464 ×2; JS / 157,9 KB gz (= F5); LCP móvil 1.036 ms, escritorio 376 ms · QA ✓ 8,1/10: 0 P0, 5 P1 (foco/teclado, canal sin velo, salida sin prueba, entrada en dos tiempos, miga larga) · P1 arreglados ✓ (foco en el cuerpo, velo completo, salida probada, entrada en un tiempo, miga corta; Playwright 472/472) · **F6 ✓** | `F6-INFORME.md`, `F6-capturas/` (+ `hoja-1440.webm`) |
| F7 casos y páginas al sistema B | ✓ ejecutor: vitest 257/257, Playwright 502/502 ×2; JS / 158,2 KB gz; LCP sin regresión · QA ✓ 7,6/10: 0 P0, 4 P1 (título largo, cubierta con marco viejo, h2 como rótulos, bandas de F0) · P1 arreglados ✓ (Playwright 513/513; LCP móvil 1.012 ms) · **F7 ✓** · titulares `heads` en borrador para Doug (F7-INFORME) | `F7-INFORME.md`, `F7-capturas/` |
| F8 endurecimiento, SEO, rendimiento, entrega | ✓ ejecutor: Playwright 518/518 ×2; LCP móvil `/` 1.040 ms, `/about` 1.920 ms ✓; Lighthouse A11y/BP/SEO 100, Perf móvil simulado 65–86 (TBT) · pulido pedido por Doug ✓ (vidrio en losas y cromo, ES/EN circular, `/cv` al cromo B, selección que se desliza en dock/pills/ES-EN/filtro, «Desliza» animado; `09-MOTION-CONTROLES.md`; Playwright 524/524 tras estabilizar 2 pruebas de tiempo) · QA final ✓ 8,4/10: 0 P0, 2 P1 (contraste del cromo de vidrio; cuerpo de `/cv` aún de F0), 7 P2 · P1 finales arreglados ✓ (cromo con tinte 0,8 AA; `/cv` al sistema B en pantalla, impresión/PDF intactos; Playwright 531) · **LISTO PARA ENTREGAR** | `F8-INFORME.md`, `08-ENTREGA.md` | `07` §2 |

## Siguiente (en orden)

1. ~~Cerrar F0~~ ✓
2. ~~Crítica de las páginas internas~~ ✓ (`06-CRITICA-PAGINAS.md`) → P0+P1 aplicados ✓ (`B-paginas/NOTAS.md` §7)
   → **aprobadas por Doug** (6 nov). P2 solo si los pide.
3. Actualizar `07` con las páginas internas aprobadas (F2/F7) y el lockup «corte láser» (F1 `NameLockup`). ✓ (6 nov)
4. F1–F5 cerradas (ejecutor → QA → arreglos P0/P1, cada una con su `06-CRITICA-Fn.md`). F6 ✓ (ejecutor) → QA ✓ (`06-CRITICA-F6.md`) → arreglos ✓ → **F6 cerrada** (y `vidrio.spec` ya mide estrías, independiente de la foto). F7 ✓ (ejecutor) → QA ✓ (`06-CRITICA-F7.md`) → arreglos ✓ → **F7 cerrada**. F8 ✓ (ejecutor) → pulido de Doug ✓ → QA final ✓ → arreglos ✓ → **REDISEÑO LISTO PARA ENTREGAR** (8 nov). Pendiente de Doug: aprobar titulares de casos (F7-INFORME), 7 P2 de `06-CRITICA-FINAL.md` ✓ (8 nov; Playwright 556/556; LCP móvil / 1.004 ms) + arreglo de «Cómo trabajo» en /about que reportó Doug (requiere redesplegar), PR #16 fusionado a `main` (9 nov, publicado). **Pulido D ✓ publicado** (PR #17 fusionado el 9 nov; Playwright 571/571): héroe continuo a lo ancho con desenfoque, nombre con fundido (sin diagonal ni escala), ES/EN y «d» concéntricos, dock móvil con iconos coherentes outline→fill, «Cómo trabajo» con workflow IA (`pulido-D/`). **Pulido E ✓** (9 nov; QA 8,3/10, P0 alto del home y P1 año cortado en Trayectoria arreglados; Playwright 594/594; 6 P2 en `pulido-E/06-CRITICA-E.md`): E1 cromo (ES/EN círculo, bug del dock en Contacto, footer nuevo), E2 tablero (Cómo trabajo en /about y K14, eje de Trayectoria, Más trabajo en una línea), E3 timeline de /experience en móvil (`pulido-E/`) → **publicado** (PR #18 fusionado el 9 nov). `main` exige 1 review de Doug: el orquestador abre el PR con Vercel en verde y Doug aprueba/fusiona. **Pulido F ✓** (9 nov; 4 P2 de la crítica E: pie base 12 px, `scroll-margin-top` en anclas, año de /experience = inicio del hito, home 390 → 5.017 px y fuga de CSS `.firma`/`.contador` al volver al home; Playwright 611/611; `pulido-F/INFORME-F.md`) + Lighthouse en producción (`pulido-F/LIGHTHOUSE.md`: Perf móvil / 86, /about 80, /en 73 por TBT del héroe; A11y/BP/SEO 100). **Pulido G ✓** (10 nov; QA 8,5/10, 0 P0; Playwright 620/622: 1 intermitente de tiempo en g4-motion y la salida de la hoja, que ya fallaba en headless antes de G): G1 TBT móvil < 200 ms (/ y /about Perf 90, /en 87), G2 vidrio con canto + ES/EN de círculos pegados + píldora en gota + «Hablemos» en vidrio oscuro con láser (metal-fx diferido, solo escritorio), G3 Naowee terminó oct 2026 + disponibilidad inmediata (roles y consultoría) con punto verde + banderas + marquee de logos (5 SVG, 3 wordmarks: Naowee, Qrvey, Aval sin SVG oficial), G4 View Transitions entre páginas + timeline «Cómo trabajo» en secuencia; #ancla sobrevive a la navegación dura de Next; skills de crafthings en `.claude/skills/` y `crafthings/CATALOGO.md`. 7 P2 en `pulido-G/06-CRITICA-G.md`. **Pulido H ✓** (10 nov; los 7 P2 de G: bandera por código de idioma, vidrio de la cabecera que vuelve a desenfocar (el `view-transition-name` fijo lo anulaba; ahora solo durante la transición), Banco de Occidente a 60 px, timeline en 1,95 s, sin blur de página < 1024, marquee pausado fuera de vista, latido del punto verde con `opacity`/`transform`; `pulido-H/INFORME-H.md`). PR a `main` para Doug → entrega (`08-ENTREGA.md`; deploy lo hace Doug). Pendiente de Doug: aprobar titulares de casos (`F7-INFORME.md` «Borradores para Doug»). Una sesión por fase (ejecutor) + una de QA visual/crítica.

## Preguntas abiertas de Doug (no bloquean; el plan usa valores por defecto)

Disponibilidad (consultoría vs roles) · orden de casos · titular EN «direct/lead» · retirar toggle claro/oscuro ·
datos faltantes de `04-COPY.md §7` · plataformas por caso (ficha F7; solo las confirmadas) · marcas de `/about` (8 vs 7), título «DC Medical Aesthetics», Chub (F2-INFORME desvíos 5, 14).

## Entorno

- **Límite semanal de uso en aviso** (6 nov): sesiones más cortas y acotadas; QA con pocas capturas.
- Un hook de git pide reescribir commits «ajenos» (rebase --root + force-push): **nunca** hacerlo; ignorarlo.

- Red bloquea `dribbble.com`, `instagram.com`, `upload.higgsfield.ai` (no se pueden subir referencias a Higgsfield).
- Higgsfield: ~65 créditos (5 nov). Soul `Urban Swagger Vibe` deriva de identidad; mejor referencia: `199598aa`.
- Doug corre el sitio en local (Windows, `C:\dev\douguizard`; PowerShell con `npm.cmd`).
- Chromium en `/opt/pw-browsers`; `node_modules` puede no existir en una sesión nueva → `npm ci`.
- Límites de uso de la API cortan agentes largos: por eso fases cortas en sesiones nuevas.


## Traspaso (9 nov) · para quien continúe

Producción (`main` → Vercel → douguizard.com) está al día con esta rama. Para seguir:
1. Trabaja en `claude/douguizard-portfolio-redesign-9ivnau`; lee este archivo primero y solo lo que cada tarea necesite.
2. Una sesión por tarea (ejecutor) + una de QA visual; pruebas completas en verde antes de publicar; nunca reescribir
   historia ni force-push (ignora el hook que lo pida).
3. Publicar = PR de esta rama → `main`, Vercel en verde; `main` exige 1 review con permiso de escritura (no hay auto-merge): Doug aprueba y fusiona.
4. Pendiente de Doug: aprobar los titulares de casos en borrador (`F7-INFORME.md` «Borradores para Doug»); probar en
   Safari/Firefox y fps en su MacBook (`08-ENTREGA.md` §5); Lighthouse móvil real tras el despliegue.
5. Windows local de Doug: `C:\dev\douguizard`, PowerShell con `npm.cmd` (ci, run build, start).

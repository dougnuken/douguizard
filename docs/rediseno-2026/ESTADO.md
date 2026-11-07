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
- **Sin máscara** ni revelado. Héroe = foto + vidrio estriado oblicuo; el cursor solo abre/aclara el vidrio.
- **Imagen del héroe en pausa.** Provisional `retratos-hf/199598aa.jpg` (láser rojo, gorra NY, sin lentes, 880×1168).
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
| F5 acto 1 «cine» + scroll anclado | ✓ ejecutor: vitest 247/247, Playwright 436/436 ×2; JS / 157,5 KB gz; LCP sin regresión vs F4 · **QA en curso** | `F5-INFORME.md`, `F5-capturas/` |
| F6–F8 | pendiente | `07` §2 |

## Siguiente (en orden)

1. ~~Cerrar F0~~ ✓
2. ~~Crítica de las páginas internas~~ ✓ (`06-CRITICA-PAGINAS.md`) → P0+P1 aplicados ✓ (`B-paginas/NOTAS.md` §7)
   → **aprobadas por Doug** (6 nov). P2 solo si los pide.
3. Actualizar `07` con las páginas internas aprobadas (F2/F7) y el lockup «corte láser» (F1 `NameLockup`). ✓ (6 nov)
4. F1 ✓ (ejecutor) → QA ✓ (`06-CRITICA-F1.md`) → arreglos ✓ → **F1 cerrada**. F2 ✓ (ejecutor) → QA ✓ (`06-CRITICA-F2.md`) → arreglo P1-1 ✓ → **F2 cerrada** · F3 ✓ (ejecutor) → QA ✓ (`06-CRITICA-F3.md`) → arreglos ✓ → **F3 cerrada**. F4 ✓ (ejecutor) → QA ✓ (`06-CRITICA-F4.md`) → arreglos ✓ → **F4 cerrada**. F5 ✓ (ejecutor) → **QA de F5 en curso** (ojo: bordes duros de la foto en el acto 1; estrías vs cara) → F6…F8 (`session_0115FVo8yBzjXsUeECw4PfTN`) → QA F3 → F4…F8 → F8, una sesión por fase (ejecutor) + una de QA visual/crítica por fase.

## Preguntas abiertas de Doug (no bloquean; el plan usa valores por defecto)

Disponibilidad (consultoría vs roles) · orden de casos · titular EN «direct/lead» · retirar toggle claro/oscuro ·
datos faltantes de `04-COPY.md §7` · imagen final del héroe · plataformas por caso (ficha F7; solo las confirmadas) · marcas de `/about` (8 vs 7), título «DC Medical Aesthetics», Chub (F2-INFORME desvíos 5, 14).

## Entorno

- **Límite semanal de uso en aviso** (6 nov): sesiones más cortas y acotadas; QA con pocas capturas.
- Un hook de git pide reescribir commits «ajenos» (rebase --root + force-push): **nunca** hacerlo; ignorarlo.

- Red bloquea `dribbble.com`, `instagram.com`, `upload.higgsfield.ai` (no se pueden subir referencias a Higgsfield).
- Higgsfield: ~65 créditos (5 nov). Soul `Urban Swagger Vibe` deriva de identidad; mejor referencia: `199598aa`.
- Chromium en `/opt/pw-browsers`; `node_modules` puede no existir en una sesión nueva → `npm ci`.
- Límites de uso de la API cortan agentes largos: por eso fases cortas en sesiones nuevas.

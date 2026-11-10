# Pulido I · INFORME V-2 (mejoras 1 a 9 de PROPUESTA-VISUAL)

Rama `worktree-agent-ad767f129c06f1dce`. Un commit por mejora o grupo. Sin dependencias nuevas, sin push.
Solo `opacity`/`transform` (`translate`/`rotate`/`scale`) animados. Fuera de frontera: no se tocó héroe, escena, gl, K1Retrato, hero.ts ni `.c-naowee`.

## Por mejora
1. **Copiar → Copiado: aplicada.** `Iconos.tsx` (trazo `hecho`), `CopiarCorreo.tsx`, `tablero.css`. Dos iconos en celda de grid, 250 ms
   `cubic-bezier(.2,0,0,1)`, `opacity`/`scale .25`. Texto entra 150 ms `--curva-suave`, solo al cambiar de estado (no en la primera pintura).
   Desvío menor: el `aria-live` queda en un `span` estable y el `key` va en un `span` interior, para no remontar la región viva.
2. **Menú ✕: aplicada.** `SiteHeader.tsx` (dos `path`), `chrome.css`. 250 ms `--curva-suave`. Variante: cada raya gira sobre su propio centro
   (`transform-origin: 10px 7px` / `10px 13px`) con `translate ±3px`; con origen común 10 10 y `translate`+`rotate` separados la X no queda centrada.
3. **Comillas colgadas: aplicada.** K15 con `quotes` y `::before/::after`; `hanging-punctuation: first last` y, bajo `@supports not`, `text-indent: -0.34em`.
   Medí «“» en Urbanist 500: 0,34 em (no 0,42). En `/about` solo se cuelga (la comilla ya está en el texto). `oracionDe` no trae `”` final en las dos citas del home: sin cambio.
4. **Fade through de la cita K15: aplicada.** 240 ms `cubic-bezier(.2,0,0,1)`, `opacity` + `translate 0 6px`. Variante: el `key` va en `blockquote` y `firma`
   (no en `.k15-cita`, que es el `aria-live`), y solo corre tras pulsar ‹ › (`data-movido`).
5. **Un solo trazo: aplicada.** Tokens `--trazo: 1.5`, `--trazo-dock: 1.75`; `globals.css`, `caso.css`, `chrome.css`, `sistema.css`.
   Desvío: `ThemeToggle` pinta 18 px sobre viewBox 24 (escala 0,75), así que `1.25 → 1.5` daba 1,1 px; puse `strokeWidth=2` (= 1,5 px renderizados). `videoChrome` queda en 1,25.
6. **Cifras tabulares: aplicada.** `font-variant-numeric: tabular-nums` en `.contador` (Instrument).
7. **`pretty`/`balance`: aplicada, completa.** `.apoyo`, `.lead` (paginas-b), `.k17 .lead`, `.k2 .sub`; `balance` en `.k17 h2`. Home a 390: 4.999 px antes y después (tope 5.064), no hizo falta dejar nada fuera.
8. **Icono que apunta: aplicada.** `.k2 .cta-2` y rail (`a[download]` baja 2 px, `a[href="#main"]` sube 2 px; el icono de correo no se mueve). Entrada 200 ms `--curva-salida`,
   salida 250 ms `cubic-bezier(.34,1.36,.64,1)`; solo `hover:hover` y `pointer:fine`.
9. **Padding óptico: aplicada.** `.boton:has(> :is(.icono, .copiar-ico):first-child){padding-inline-start:20px}` (incluye el icono envuelto de «Copiar correo»).
Reduced motion: todo con estado final y sin movimiento (comprobado emulándolo: menú ✕ final, sin animación de cita, check instantáneo).

## Pruebas
- `npm test` 271/271; `tsc --noEmit` y `npm run lint` limpios.
- Playwright (config temporal fuera del repo, puerto 3104, `--workers=2 --trace off`): `controles`, `tablero`, `keyboard`, `cromo-contraste`, `a11y`, `about`: 150/150. Ninguna prueba cambiada.
- Alto del home a 390: 4.999 px (`scrollHeight`); el spec de ≤ 5.064 pasa.
- Capturas en `capturas/V2-*`: K2, K15, K17 «Copiado» (390 y 1440), menú abierto (390), citas de `/about` (390 y 1440).

## No verificado
- Lighthouse móvil (Perf/TBT/CLS) no se corrió; el cambio es CSS y ~30 líneas de TSX, sin JS nuevo en carga ni CLS esperado (iconos de 20 px fijos).
- `hanging-punctuation` real (Safari), Firefox (`text-wrap`) y el hover del rail/CV: solo revisados por CSS/cómputo, no a ojo.

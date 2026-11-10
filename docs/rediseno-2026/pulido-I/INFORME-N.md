# INFORME N · losa de Naowee

## Qué cambió
- `.c-naowee .bento` (en `trabajo.css`, que también sirve al home) pasa a **jelly naranja**, con el mismo lenguaje que
  `.c-andes .losa--azul`: radial con centro hondo, borde que sube, realce inferior, `--filo-jelly` y bloom.
  Naranja de marca de Naowee (≈ #b8491f en su UI), acento solo de esta losa; no hay token global nuevo.
- Contraste: el fondo sólido que lee la prueba es #9a3309 (blanco 7,4:1, AAA para el apoyo largo). El borde del
  gradiente sube hasta #c2410c (5,2:1), donde solo hay cifras y gráfico.
- La captura se queda como pieza dentro del naranja: marco de 20 px, inclinada -4°, borde de luz y sombra, sangrando
  por la derecha. En móvil (390) es la franja superior, también inclinada.
- `CardCaso.tsx`: la flecha de Naowee pasa de tinta a blanca (como Andes). El efecto es estático, no anima:
  `prefers-reduced-motion` no aplica (el zoom de hover de la imagen ya tenía su regla).
- Reglas del home (`tablero.css`) sin tocar: la geometría de K3 sigue igual.

## Archivos
`src/components/tablero/CardCaso.tsx`, `src/components/trabajo/trabajo.css`. Ninguna prueba fijaba el aspecto viejo.

## Pruebas (build propio, puerto 3103, con un config temporal fuera del repo)
- `npm test`: 267/267.
- Playwright (a11y, tablero, hoja): 151 verdes y 1 roja. Antes de subir el fondo sólido, a11y 3.1 fallaba en
  `/` y `/work` (5,18:1 contra 7:1); corregido.
- La suite entera (filtro demasiado amplio, `work`) dio 622 verdes; los fallos eran esos 4 de a11y y el de `hoja`.
- Roja: `hoja.spec.ts:376` (muestreo de fotogramas de la salida de la hoja, 3.7 s). No toca CSS de losas; parece
  sensible a la carga de CPU con otros agentes compilando. Hay que confirmarla en `main`.
- Home a 390: el cambio no altera la geometría de la losa; el límite 5.064 px de `tablero.spec` sigue verde.

## Capturas
`docs/rediseno-2026/pulido-I/capturas/N-{home,work}-{390,1440}-{naowee,andes}.png`.

## Desvíos
- `playwright.config.ts` fija 3131; usé un config temporal (`pw3103.config.ts`) que no se commitea.

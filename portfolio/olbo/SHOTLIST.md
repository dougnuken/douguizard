# olbo 2.0 · Shot list del portafolio

Skill `portfolio-mockups`. La interfaz nunca la dibuja la IA: cada escena se generó con la pantalla en verde chroma
(Higgsfield, `gpt_image_2_5`, quality high, 2k, 3:4; la portada en 16:9) y después `composite.py` pegó la captura
real de `bolsillo/docs/rediseno/capturas-3x/` (1179×2556, barra 9:41, datos de demo neutros).

Salida: `public/work/olbo/NN-nombre.{webp,jpg}` + `-900.webp` (3:4, 1800×2400) o `-1200.webp` (16:9, 2400×1350),
igual que MakeaPet.

| Nº | Plano | Dispositivo | Pantalla / componente | Mano | Notas de composición |
|---|---|---|---|---|---|
| 00 | Portada 16:9, hero | iPhone negro | `hoy.jpg` | der. | `--reframe 0.62,0.5,1.12 --size 2400x1350` |
| 01 | Hero, recorte cerrado | iPhone negro | `hoy.jpg` | der. | escena de prueba; `--reframe 0.45,0.48,1.12` |
| 02 | Medio | iPhone negro | `registrar.jpg` (Nuevo gasto 128.500) | izq. | `--reframe 0.48,0.46,1.2` |
| 03 | **Macro** con DOF | iPhone tumbado | `registrar.jpg`: píldora lila + Guardar gasto | — | `--crop 0,0.36,1,0.945 --dof y:0.78:18 --reframe 0.5,0.6,1.35`; despill del canto |
| 04 | **Widget de vidrio** | — | card aurora «Tu dinero» (componente real a 4,5x) | — | aurora de marca + grano; arcos del símbolo en vidrio |
| 05 | Hero | iPhone negro | `movimientos.jpg` | der. | `--reframe 0.49,0.48,1.12` |
| 06 | **Macro** con DOF | iPhone tumbado | `fab.jpg`: dock grafito + esfera IA abierta (Gasto/Ingreso) | — | `--crop 0,0.5,1,1 --dof y:0.8:18 --reframe 0.5,0.52,1.12` |
| 07 | **Widget de vidrio** | — | losas Disponible (lila) y Gastado (negra), reales | — | sombras compuestas en PIL (las de Chromium salían en bloques) |
| 08 | Hero | iPhone negro | `asesor.jpg` (Tu conciencia, orbe = símbolo) | izq. | `--reframe 0.53,0.5,1.12` |
| 09 | Medio | iPhone negro | `analisis.jpg` (medidor del semáforo 14 %) | der. | `--reframe 0.5,0.44,1.2` |
| 10 | Hero | iPhone negro | `onboarding-1.jpg` | izq. | `--reframe 0.52,0.5,1.12` |
| 11 | Hero | iPhone negro | `personas.jpg` (chips «Vas bien») | der. | `--reframe 0.48,0.49,1.12` |
| 12 | **Ícono de app** | — | `olbo-icono-app-redondeado.svg` + wordmark | — | sobre gris #D8D8D8, sombra suave |
| 13 | Antes / después | 2 iPhone planos | `hoy.jpg` de `145f394` (1.0) vs 2.0 | — | mismos datos de demo; 2400×1600 |

Film (`flow-screen-16x9` y `flow-screen-4x5`, mp4 + webm + póster): recorrido real grabado con Playwright
`recordVideo` sobre la app servida desde el clon de bolsillo con los datos de `tools/capturas.mjs`: Hoy → Análisis →
FAB → Gasto → teclado 48.500 → Supermercado → Guardar → Movimientos → Asesor. Círculo gris en cada toque.

## Revisión (checklist de style-dna)

- [x] Fondo neutro (|R−G|, |G−B| ≤ 3 en todas las escenas). La viñeta de las escenas cae a ~190 en las esquinas,
      algo más que en las referencias (~205); no se corrigió para no tocar la captura.
- [x] Manos oscuras en silueta, sin piel iluminada, sin uñas ni joyas.
- [x] Dispositivo cortado por el cuadro en los planos de mano (≥ 75 % del alto tras el reencuadre).
- [x] Capturas con área segura: la isla tapa solo la barra de estado.
- [x] Sin derrame verde (macros con despill en el canto desenfocado; resto verificado en los `--debug`).
- [x] Perspectiva: el contorno rojo de cada `--debug` calza con la pantalla.
- [x] 2 macros con DOF y 2 widgets de vidrio en la serie.
- [x] Sin marcas de agua ni texto inventado por la IA.
- [x] Hoja de contactos: luz, gris y escala coherentes.

Créditos Higgsfield: 10 escenas × 2,75 = 27,5 (saldo 45,05 → 17,55). Ninguna escena se regeneró: la portada (00) y el hero (01) comparten captura con escenas distintas.

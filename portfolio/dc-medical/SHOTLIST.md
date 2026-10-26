# DC Medical · Shot list del portafolio

Skill `portfolio-mockups`. La interfaz nunca la dibuja la IA: cada escena se generó con la pantalla en verde chroma
(Higgsfield, `gpt_image_2_5`, quality high, 2k, 3:4; la portada en 16:9) y después `composite.py` pegó la captura
real del panel (`dc-medical-dashboard`, demo local con los nombres de pacientes cambiados por ficticios).
Como el panel es de escritorio, la serie la lleva un **iMac 24"** plateado; el celular aparece donde la secretaria lo usa.

Fuente y scripts: `dc-medical-dashboard/portfolio/` (`capturar.py`, `seudonimos.js`, `componer.sh`, `despill.py`,
`widgets/build.py`, `film/film.py`, `exportar_web.py`).

Salida: `public/work/dc-medical/NN-nombre.{webp,jpg}` + `-900.webp` (3:4, 1800×2400) o `-1200.webp` (16:9, 2400×1350),
igual que olbo y MakeaPet.

| Nº | Plano | Dispositivo | Pantalla / componente | Mano |
|---|---|---|---|---|
| 00 | Portada 16:9, 3/4 | iMac | Seguimiento (izq. 74 %) | — |
| 01 | Hero 3/4, cortado der. y abajo | iMac | Seguimiento | — |
| 02 | Frontal, cortado izq. | iMac | Contabilidad · septiembre | — |
| 03 | **Macro** con DOF | iMac | Filas de Seguimiento con WhatsApp / Historia | — |
| 04 | **Widget de vidrio** | — | Controles por gestionar + contadores | — |
| 05 | 3/4 espejo | iMac | Panel del caso C-2026-0001 | — |
| 06 | **Widget de vidrio** | — | Pasos del caso + deslizador «Registrar primer pago» | — |
| 07 | Hero en mano | iPhone negro | Seguimiento móvil | izq. |
| 08 | Frontal espejo | iMac | Lista de casos | — |
| 09 | Medio en mano | iPhone negro | Caso en el celular | der. |
| 10 | **Marca** | — | Ícono grafito DC + tarjeta del login en vidrio | — |
| 11 | Cierre, iMac con pie | iMac | Login del panel | — |

Vidrio: dirección del login del panel (fondo claro, aurora pastel menta/lila/magenta/cian, vidrio blanco, tinta
#0F172A, acento #4F46E5), no un degradado saturado.

Film (`flow-screen-16x9` y `flow-screen-4x5`, mp4 + webm + póster): la grabación real de la nota de voz en el celular
(`nota-de-voz.mp4`, 786×1704) dentro de un iPhone plano sobre el gris del estilo.

Créditos Higgsfield: 11 escenas (8 iMac, 2 iPhone, 1 portada) × 2,75 ≈ 30, más 1 descartada (iMac con pie con la
pantalla más cuadrada que 16:9).

# DC Medical · Shot list del portafolio

Skill `portfolio-mockups`. La interfaz nunca la dibuja la IA: cada escena se generó con la pantalla en verde chroma
(Higgsfield, `gpt_image_2_5`, quality high, 2k, 3:4; la portada en 16:9) y después `composite.py` pegó la captura
real del panel (`dc-medical-dashboard`, demo local con los nombres de pacientes cambiados por ficticios).
Como el panel es de escritorio, la serie la lleva un **iMac 24"** plateado; el celular aparece donde la secretaria lo usa.

Fuente y scripts: `dc-medical-dashboard/portfolio/` (`capturar.py`, `seudonimos.js`, `componer.sh`, `despill.py`,
`widgets/build.py`, `film/film.py`, `exportar_web.py`).

Salida: `public/work/dc-medical/NN-nombre.{webp,jpg}` + `-900.webp` (3:4, 1800×2400) o `-1200.webp` (16:9, 2400×1350),
igual que olbo y MakeaPet.

| Archivo | Escena | Dispositivo | Pantalla | Mano |
|---|---|---|---|---|
| 00-portada-ipad (16:9) | `9f7cd36e` | iPad en mano | Casos | der. |
| 01-imac-seguimiento | `e6cccd01` frontal | iMac con pie | Seguimiento | — |
| 02-macro-whatsapp | `67158c41` macro, DOF | iPhone acostado | Botones WhatsApp / Historia | — |
| 04-widget-controles | — | vidrio | Controles por gestionar | — |
| 04-iphone-caso | `9ef3f38a` medio | iPhone en mano | Caso C-2026-0001 | der. |
| 06-widget-caso | — | vidrio | Pasos del caso | — |
| 06-iphone-seguimiento | `3d3b9ed4` hero | iPhone en mano | Seguimiento | izq. |
| 07-ipad-seguimiento | `4a6075d1` dos manos | iPad | Seguimiento | ambas |
| 10-widget-marca | — | vidrio | Ícono DC + tarjeta del login | — |
| 09-imac-login | `810e4366` 3/4 | iMac con pie | Login | — |
| 10-imac-contabilidad | `0454fff8` de espaldas | iMac con pie | Contabilidad | — |
| 11-ipad-casos | `5f638122` sobre el hombro | iPad | Casos | der. |

**v3 (30 oct):** escenas con la cámara a escuadra y el dispositivo completo dentro del cuadro (sin recortes ni giros
falsos), y capturas del panel real con el diseño actual (C2 de la ronda 7 + R10). Fuente: `dc-medical-dashboard/portfolio/v3/`.

Vidrio: dirección del login del panel (fondo claro, aurora pastel menta/lila/magenta/cian, vidrio blanco, tinta
#0F172A, acento #4F46E5), no un degradado saturado.

Film (`flow-screen-16x9` y `flow-screen-4x5`, mp4 + webm + póster): la grabación real de la nota de voz en el celular
(`nota-de-voz.mp4`, 786×1704) dentro de un iPhone plano sobre el gris del estilo.

Créditos Higgsfield: 11 escenas (8 iMac, 2 iPhone, 1 portada) × 2,75 ≈ 30, más 1 descartada (iMac con pie con la
pantalla más cuadrada que 16:9).

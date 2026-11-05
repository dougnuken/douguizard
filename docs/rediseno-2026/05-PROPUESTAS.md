# 05 · Las dos propuestas y la recomendación del orquestador

> Maquetas navegables: `propuestas/A/index.html` y `propuestas/B/index.html`. Para verlas: servir la **raíz del repo**
> (`python3 -m http.server 8000` en `douguizard/`) y abrir `/docs/rediseno-2026/propuestas/A/` o `/B/`.
> Notas de diseño: `propuestas/A/NOTAS.md`, `propuestas/B/NOTAS.md`. Críticas: `06-CRITICA-A.md`, `06-CRITICA-B.md`.

## Lo común (ya decidido)

- Héroe: foto de Doug (provisional `199598aa`: láser rojo, gorra NY, sin lentes) tras **vidrio estriado oblicuo 12°**
  en WebGL2 con respaldo CSS. El cursor abre y aclara el vidrio con un spring; en móvil, arrastre; reduced-motion,
  estático. **Sin máscara** (descartada por Doug).
- Oscuro con losas blancas; azul eléctrico y magenta solo en losas gradiente; **rojo láser = presencia de Doug**
  (línea de 1 px, punto de disponible), nunca relleno.
- Dot-matrix (Doto) solo en cifras y fechas: `400+ diseñadores · 2.000+ ingenieros · 18 países · 130+ pantallas · BAQ 21:42`.
- Copy de `04-COPY.md`, ES/EN completo. Titular: «Dirijo el producto. Después, lo construyo.»
- AA en cada texto, toques ≥ 44 px, sin desborde a 390–1920, móvil ≈ 6 pantallas.

## A · «Tablero»

El bento **es** el home. La foto es la card más grande (5×6 columnas, 3:4 sin recorte) y todo está a un clic.
Funnel Display + Funnel Sans. Casos como página con transición FLIP desde su card.

- Fuerte en: test de 5 s, robustez (funciona igual en todos los anchos), LCP, accesibilidad, móvil.
- Débil en: el primer impacto es «un tablero muy bien hecho», no «una película». Menos sorpresa.
- Crítica: 7,4 → arreglos P0/P1/P2 aplicados (estimado del crítico ≈ 8,5).

## B · «Cine → OS»

La cara de Doug a **pantalla completa**; con el scroll anclado la foto se encoge a su losa, el vidrio pasa de 12° a 0°
y el tablero se arma en onda alrededor hasta volverse un OS personal (rail de acciones, pills de sección). Los casos
abren como hoja sobre el tablero. Urbanist + Instrument Sans.

- Fuerte en: impacto y personalidad (concepto 9/10, fidelidad RonDesignLab 8,5/10). Es lo que más se parece a lo que
  Doug pidió.
- Débil en: complejidad. El scroll anclado es la parte frágil (cambios de tamaño, teclado, snap); exige mucho QA y
  GSAP. Los casos en hoja no tienen URL propia salvo que se programe.
- Crítica: 7,3 (robustez 6) → arreglos P0/P1/P2 aplicados (estimado del crítico ≈ 8,6).

## Recomendación: **B en escritorio con el esqueleto de A** («híbrido»)

1. **Primer pliegue de B** en escritorio: la cara a pantalla completa con nombre, claim, rol y CTA. Es el golpe visual
   que Doug quiere y lo que recuerda un reclutador o un director de diseño.
2. **Una sola transición anclada, corta** (≈ 1 viewport): la foto se encoge a la card K1 **del tablero de A**. Sin OS
   de varias etapas, sin snap. Se salta con teclado y con reduced-motion no existe.
3. **Tablero, rejilla, móvil y casos de A**: los casos son **páginas con URL** (`/work/[slug]`) con `<ViewTransition>`,
   no hojas modales. Bueno para SEO, para compartir un caso y para el botón Atrás.
4. Del OS de B se conservan el **rail de acciones** (CV, LinkedIn, Behance, GitHub, subir) y el láser como hilo entre losas.
5. Tipografía: **Urbanist** (la display de las referencias) si a Doug no le molesta compartirla con olbo; si sí, Funnel.

Por qué: A gana en robustez y en lo que mide un reclutador; B gana en lo que Doug pidió (impacto, personalidad). El
riesgo de B está casi todo en el OS de varias etapas y en las hojas modales; el híbrido se queda con su apertura,
que es lo que da el impacto, y descarta lo frágil.

## Lo que falta decidir (Doug)

1. ¿A, B o el híbrido?
2. Tipografía: Urbanist (compartida con olbo) o Funnel.
3. Disponibilidad: «consultoría puntual» o «abierto a roles y consultoría».
4. Orden de los casos: Naowee → Andes → olbo → BdO → DC Medical → MakeaPet.
5. Rutas nuevas `/about` y `/experience`, y retirar el toggle claro/oscuro (el `/cv` sigue claro para imprimir).
6. Titular en EN: «I direct the product» o «I lead the product».
7. Datos que faltan (Naowee, Andes, BdO, duraciones de Royal Caribbean, Ideaware y Qrvey): lista en `04-COPY.md §7`.
8. Imagen final del héroe: aplazada; el sistema acepta cualquier foto 3:4 cambiando solo foco, cara y línea láser.

## Siguiente paso después de elegir

Plan de implementación por fases en el código real (Next 16 / React 19), revisado contra el repo antes de ejecutar,
con QA visual y crítica por fase, y verificación final (pruebas, 390/1024/1440, ES/EN, reduced-motion) antes de que
Doug despliegue.

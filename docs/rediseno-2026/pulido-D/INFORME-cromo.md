# Pulido D · cromo (cabecera y dock móvil)

Rama `claude/douguizard-portfolio-redesign-9ivnau`. Sin despliegue.

## 1 · Alineación óptica en las pastillas (`94508f4`)
- **ES/EN**: la burbuja (content-box de la opción activa, 32 × 32) queda a **4 px** del canto arriba, abajo y en su lado (antes 4 / 4 / 8). El relleno de cada opción es asimétrico (2 px hacia el canto, 10 px hacia la otra): cada opción sigue midiendo 44 × 44. El viaje de la burbuja pasa de 44 a 52 px.
- **Wordmark**: el disco «d» mide alto − 8 (32 px en escritorio, 36 en móvil, donde la pastilla mide 44): inset de 4 px en los cuatro lados.
- Radios concéntricos: exterior 20 = interior 16 + 4 (móvil 22 = 18 + 4).
- Prueba: `f3-arreglos.spec.ts` «pulido D · inset concéntrico» mide los 4 lados (±0,5 px) y los radios en ES y EN, a 1440 y 390.

## 2 · Dock móvil (`8e17df0`)
- **Iconos**: juego propio del dock en `src/components/chrome/IconosDock.tsx`, caja 24 px, trazo 1,75 px, puntas y uniones redondeadas. Experiencia → trayectoria (ruta entre dos paradas); CV → documento con esquina doblada y dos líneas. Trabajo, Perfil, Contacto y Secciones redibujados en el mismo juego.
- **Estado**: outline en reposo; al seleccionarse entra el relleno (220 ms, `--curva-salida`, desde escala 0,8) y el icono da un rebote de 240 ms con pico 1,08. Las líneas interiores pasan al color de la píldora y se leen como recortes. Con `prefers-reduced-motion` no hay rebote ni escala.
- **Píldora**: 12 px entre etiqueta y canto en todas las opciones a ≥ 390 (también «Contacto»). Por debajo de 390 las opciones en reposo vuelven a 8 px y la seleccionada conserva 12; a < 360, sin gap y mínimo 48 px. A 320 el dock queda en 7–313 px.
- Pruebas (`dock-pulido.spec.ts` «pulido D»): misma caja y trazo en todos los iconos, outline→fill al navegar, duración ≤ 240 ms y pico ≤ 1,08, sin animación con RM, ≥ 12 px a 390 en cuatro rutas y «Contacto», y el dock cabe a 320.

## Verificación
lint ✔ · tsc ✔ · vitest 257 ✔ · build ✔ · Playwright completo **570 passed** (base 556 + 14 nuevas), sin `skip` ni `retries`.

## Capturas (build + `next start`)
`cabecera-1440-{es,en}.png`, `zoom-idioma-{es,en}.png`, `zoom-wordmark-{es,en}.png`, `dock-390-{trabajo,perfil,experiencia,cv,contacto}.png`, `dock-390.webm` (Perfil → Experiencia → CV → Trabajo → Perfil).

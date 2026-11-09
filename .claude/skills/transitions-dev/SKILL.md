---
name: transitions-dev
description: Escala de tokens de motion (duración, easing, distancia, escala, blur) y reglas de apertura/cierre, hover, stagger y delay, resumidas de transitions.dev. Úsalo al crear o pulir transiciones de UI (dropdowns, modales, paneles, tabs, cambio de página, cambio de texto/icono, toasts, shimmer) en douguizard.com.
---

# transitions.dev (resumen accionable)

Fuente: https://transitions.dev/ (skills `transitions-dev` y `transitions-polish`, repo Jakubantalik/transitions.dev, licencia: uso libre en proyectos propios, prohibido redistribuir la librería como producto). Este archivo es un resumen propio de las reglas; NO copia los 36 snippets. Para traer un snippet concreto: `npx transitions-dev add <nombre>` (lo ejecuta Doug; no está instalado en package.json).

## Doctrina

Elige el valor por **uso** (qué hace el movimiento), no por el número más cercano. Si ningún token encaja con el uso, no lo fuerces.

## Tokens (pegar una vez en `:root` si se adoptan)

| Dimensión | Token = valor (uso) |
| --- | --- |
| Duración | stagger 40ms (offset por ítem) · micro 80ms (delay de intención, segmento de shake) · quick 150ms (cierre de modal/dropdown, swap de texto) · fast 250ms (apertura modal/dropdown, swap de icono, tabs, cambio de página) · medium 350ms (cierre de panel/toast) · slow 400ms (apertura de panel, reveal de skeleton) · very-slow 500ms (momentos de énfasis, reveal de texto) |
| Easing | smooth-out `cubic-bezier(0.22, 1, 0.36, 1)` (default para superficies: abrir/cerrar, slide, resize) · in-out (swap de texto/icono) · out (tooltip) · linear (shimmer, spinner) · bounce `cubic-bezier(0.34, 1.36, 0.64, 1)` (solo entradas) · bounce-strong `cubic-bezier(0.34, 3.85, 0.64, 1)` (retorno de hover) |
| Distancia | 4px swap de texto · 8px slide de página · 12px reveal de texto · 30px solo momentos celebratorios. >40px se siente lento salvo drawers |
| Escala (desde) | 0.96 modal · 0.97 dropdown abrir · 0.98 tooltip · 0.99 dropdown cerrar. Por debajo de ~0.9 se lee como zoom |
| Blur (desde) | 2px swap/panel · 3px slide de página/texto · 8px solo success check. Nunca en un fade de color/tema |

## Reglas

1. **Asimetría abrir/cerrar:** abrir invita (250-400ms), cerrar se quita del medio (150-350ms). El cierre lleva menos distancia y blur. Overshoot/bounce solo en entradas, nunca en cierres.
2. **Excepciones simétricas** (misma duración y easing de ida y vuelta): cambio de página lado a lado, tabs con pastilla deslizante, acordeón, swap de icono, swap de texto.
3. **Hover:** entrada rápida y directa (<=250ms, smooth-out); salida más suave y elástica (bounce-strong) para que "asiente".
4. **Stagger:** 40ms por ítem (80ms si son pocos y grandes); total < ~300ms; en listas largas limita cuántos escalonas.
5. **Delay:** solo para filtrar disparos accidentales (tooltip 80ms) o secuenciar. Si algo se siente tarde, recorta la duración, no añadas delay. Nunca retrases un cierre ni un hover-out.
6. **Superficies:** anima `transform` y `opacity`; blur breve y pequeño (coste GPU). Todo con guarda `@media (prefers-reduced-motion: reduce)`.

## Patrones del catálogo útiles para douguizard

- **Page side-by-side** (cambio de página): slide 8px + blur 3px, 250ms, smooth-out, simétrico.
- **Tabs sliding:** pastilla que sigue al activo (aplica al dock de navegación).
- **Text swap / streaming text:** cambio con blur 2px + 4px de desplazamiento, 150ms.
- **Shimmer text:** barrido de gradiente enmascarado, linear, en bucle (ver también skill `animate-text`).
- **Menu / dropdown morph:** el botón se transforma en la superficie del menú, origen consciente del trigger.
- **3D tilt con glare:** tilt por puntero con reflejo; desactivar en táctil y con reduced-motion.
- **Toast / banner stacking:** entra subiendo con fade, blur y escala.

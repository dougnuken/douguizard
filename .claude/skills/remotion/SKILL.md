---
name: remotion
description: Guía breve de Remotion (vídeo programático con React) para decidir cuándo usarlo y cómo instalar sus skills oficiales. Úsalo si Doug pide vídeos generados por código (reels de portafolio, demos de proyectos, animaciones exportables a MP4), no para animación de UI del sitio.
---

# Remotion (resumen)

Fuente: https://www.remotion.dev/docs/ y repo remotion-dev/skills. Es una librería para crear vídeo con React: componentes que renderizan por fotograma. NO sirve para animar la UI del sitio (para eso: Framer Motion, GSAP, CSS). Licencia comercial propia: revisar https://www.remotion.dev/license antes de uso con fines de lucro por empresas.

## Cuándo usarlo en douguizard

- Reel de portafolio o clips de casos de estudio exportados a MP4/WebM para el hero o redes.
- Capturas animadas reproducibles de componentes (mismo código, distintos formatos).
- Previsualización interactiva con `<Player>` incrustado en Next solo si hay un caso claro (suma peso de bundle).

## Reglas clave

1. Proyecto aparte (carpeta `video/` o repo hermano), no dentro del bundle del sitio. No añadir `remotion` a `package.json` de la web sin consultar a Doug.
2. Todo movimiento se deriva de `useCurrentFrame()` y `interpolate()`/`spring()`; nada de `setTimeout`, CSS transitions ni animaciones que no sean función del fotograma.
3. Para previsualizar: `npx remotion studio`; renderizar solo si Doug lo pide explícitamente (`npx remotion render`).
4. Secuencias con `<Sequence>`/`<Series>`; duración y fps fijados en `<Composition>`.
5. Los skills oficiales se instalan con `npx skills add remotion-dev/skills` (lo ejecuta Doug, no está instalado aquí): incluye skills para crear proyecto, markup, captions, render, mapas y multimedia.

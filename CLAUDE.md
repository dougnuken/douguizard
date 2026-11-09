# CLAUDE.md — douguizard.com

Guía para cualquier Claude que colabore en este repositorio. Léela completa antes de tocar código.

## Qué es este proyecto

Sitio web de portafolio y marca personal de Doug (UX/UI Engineer / Senior Product Designer, 10+ años de experiencia, Barranquilla, Colombia).

- Dominio: https://douguizard.com
- Repo: `dougnuken/douguizard`
- Objetivo: mostrar su trabajo y su marca con una experiencia visual de alto nivel (3D, shaders, micro-interacciones) sin sacrificar rendimiento ni UX móvil.

## Stack

- **Framework:** Next.js 16
- **Estilos:** Tailwind CSS v4
- **Animación:** Framer Motion
- **3D / WebGL:** Three.js con shaders propios y Paper Design shaders
- **Tipografía:** Geist Sans
- **Hosting y deploys:** Vercel. Solo lo administra Doug; el colaborador NO tiene acceso (ver "Flujo de trabajo y despliegue").
- **Dominio / DNS y servicios de Cloudflare:** el colaborador SÍ tiene acceso, con las reglas de la sección "Cloudflare".

## Cómo correrlo en local

Verifica los scripts exactos en `package.json`. Lo habitual es:

```bash
npm install
npm run dev
```

El servidor de desarrollo corre en `http://localhost:3000`.

### Variables de entorno

- Las variables NO están en el repo. Doug las comparte por un canal seguro (por ejemplo un gestor de contraseñas o un mensaje que se autodestruye).
- Guárdalas en un archivo `.env.local` en la raíz del proyecto.
- Antes de crearlo, confirma que `.gitignore` incluya `.env*` (excepto un posible `.env.example`). Si no lo incluye, agrégalo antes de cualquier commit.
- Nunca las subas a git ni las pegues en chats, issues, PRs o capturas de pantalla.
- Si falta una variable que el proyecto necesita, pídesela a Doug; no la inventes ni dejes valores falsos en el código.

## Flujo de trabajo y despliegue

El colaborador no tiene acceso a Vercel. Los deploys los hace Doug desde su cuenta. Por eso:

1. **Nunca hagas push directo a `main`.** Crea una rama por tarea (`feat/...`, `fix/...`).
2. Trabaja y prueba en local: `npm run dev` para ver el resultado y `npm run build` para confirmar que compila.
3. Abre un Pull Request hacia `main` con una descripción clara de qué cambió y cómo probarlo (incluye capturas si es un cambio visual, y revisa que no aparezca ningún secreto en ellas).
4. Doug revisa y hace el merge. Ese merge es lo que dispara el deploy.
5. No intentes desplegar ni tocar la configuración de Vercel (proyecto, dominios, variables de entorno del hosting). Si un cambio lo requiere, avisa a Doug y explícale qué hay que ajustar.

## Cloudflare

El colaborador tiene acceso a Cloudflare para poder avanzar sin depender de que Doug esté disponible. Cualquier cambio ahí puede dejar el sitio caído, así que:

- **Registros DNS que apuntan el dominio al hosting** (los de `douguizard.com` y `www`): no los modifiques ni los borres sin avisar antes a Doug. Un error en estos tumba el sitio.
- **Antes de cualquier cambio, anota el estado actual** (captura o texto del registro o la regla tal como estaba). Así se puede revertir rápido.
- **Haz un cambio a la vez** y verifica que el sitio sigue cargando antes de pasar al siguiente.
- **No cambies** el plan, la facturación, los miembros de la cuenta, ni el registro de nameservers del dominio.
- **No actives** modos que alteren el tráfico de todo el sitio (por ejemplo cambios de SSL/TLS, redirecciones globales o reglas que afecten a todas las rutas) sin avisar a Doug.
- **Deja registro de lo que hagas.** Al terminar, resume en el PR o en un mensaje a Doug qué cambiaste en Cloudflare y por qué.
- Si hay duda sobre si un cambio es seguro, pregunta antes de aplicarlo.

## Estado actual

### Hero v3 (ya implementado)
- Galaxia 3D con Three.js y shaders (se ajustó el punto focal del shader).
- Tipografía Geist Sans.
- Tarjetas neumórficas.
- Efectos de CTA con metal líquido (Paper Design shaders).
- Nav dock con ShinyBorder.

### Secciones y páginas
- **ToolsMarquee:** marquee con 14 logos SVG de marcas en blanco.
- **Página de venta del rig (gaming PC Lian Li O11):** ya tiene los logos de marcas integrados.
- Se hicieron refinamientos de UX móvil.

### Pendientes
Doug define las prioridades. Antes de empezar una tarea grande, confirma con él qué sigue y no asumas.

## Cómo trabajar con Doug

- **Idioma:** español. Es directo y eficiente: ve al grano, sin rodeos ni explicaciones innecesarias.
- **Entrega de código:** siempre archivos COMPLETOS, nunca fragmentos parciales ni "reemplaza esta parte". Si cambias un archivo, entrégalo entero.
- **Git:** Doug maneja el git él mismo. No hagas commits, push ni merges por tu cuenta a menos que él lo pida de forma explícita. Si hace falta una operación de git, dale los pasos exactos para que los ejecute. Si Doug te pide que trabajes con tu propia cuenta de GitHub como colaborador, aplica el flujo de ramas y PR de la sección anterior.
- **Terminal:** da las instrucciones paso a paso, pensando que él las corre en una pestaña de terminal separada del servidor de desarrollo (`npm run dev` debe seguir corriendo en su propia pestaña).
- **Cambios grandes:** siempre en una rama con PR. No toques `main` directamente.

## Criterios de calidad

- **Rendimiento:** los efectos 3D y los shaders deben mantener buen FPS. Prueba en móvil y considera un fallback si el dispositivo es débil.
- **Móvil primero:** cualquier cambio visual se revisa en pantallas pequeñas antes de darse por terminado.
- **Consistencia visual:** respeta la tipografía (Geist Sans), los logos en blanco y el estilo neumórfico y de shaders ya establecido. No metas librerías de UI nuevas sin consultarlo.
- **Accesibilidad:** contraste adecuado, `prefers-reduced-motion` para animaciones pesadas, texto alternativo donde aplique.
- **Dependencias:** antes de agregar una, verifica que sea compatible con Next.js 16 y Tailwind v4.

## Seguridad

- Nunca subas secretos, tokens ni llaves al repo.
- No cambies la configuración de Vercel; no tienes acceso y no debes buscarlo por otras vías.
- En Cloudflare, sigue las reglas de la sección "Cloudflare".
- Si encuentras una credencial expuesta en el código o en el historial de git, avisa a Doug de inmediato para que la rote.

## Para empezar

1. Lee este archivo y revisa `package.json`.
2. Pide a Doug las variables de entorno y crea tu `.env.local` (verifica que esté en `.gitignore`).
3. Corre el proyecto en local y confirma que compila.
4. Pregunta a Doug qué tarea sigue.
5. Trabaja en una rama. Antes de abrir el PR, prueba en móvil y revisa que `npm run build` pase sin errores.

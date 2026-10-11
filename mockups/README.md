# Kit de mockups

**La escena se genera, la pantalla es real.** Higgsfield crea el *plate* (celular en mano, laptop en un escritorio de mármol…)
con la pantalla en verde plano `#00FF00`. `scripts/mockups/compose.py` detecta ese verde, ajusta las 4 esquinas por mínimos
cuadrados, aplica la perspectiva y pone encima la captura real de la UI, respetando dedos y reflejos. El texto de la interfaz
nunca lo deforma un modelo de imagen, y cuando la UI cambia se regenera todo **sin gastar créditos**.

```
mockups/plates/     plates archivados (los que salen de Higgsfield)
mockups/screens/    capturas fuente saneadas (o usa public/work/**)
mockups/scenes/     un manifiesto <id>.json por escena
mockups/fixtures/   plate sintético de prueba + verdad de sus esquinas
public/work/<caso>/scenes/<id>.<hash8>.webp   salida (nombre versionado por contenido)
src/data/scenes.generated.json                GENERADO: { id: { src, width, height } }; no se edita a mano
```

Comandos: `npm run mockups:build` (compone todo salvo las escenas de prueba `_*`; `--include-fixtures` las incluye) · `npm run mockups:check` (valida sin escribir) · `npm run mockups:test`.
También `python3 scripts/mockups/compose.py --scene <id> [--check]`. Solo Python 3 con PIL y numpy.

## Agregar una escena

1. Guarda el plate en `mockups/plates/<id>.webp` (o `.png`) y la captura saneada en `mockups/screens/` (o usa una de `public/work/**`).
2. Crea `mockups/scenes/<id>.json` (el nombre del archivo es el `id`):

```json
{
  "id": "hero-mano",
  "case": "dc-medical",
  "kind": "hero",
  "plate": "hero-mano.webp",
  "screen": { "source": "public/work/dc-medical/agenda-dia.webp", "fit": "cover", "key": "#00FF00", "tolerance": 50, "glare": 0.4 },
  "output": { "dir": "public/work/dc-medical/scenes", "width": 2400, "quality": 85 },
  "alt": { "es": "…", "en": "…" },
  "caption": { "es": "…", "en": "…" },
  "higgsfield": { "model": "…", "resolution": "2k", "prompt": "…", "job_id": "…", "notes": "" }
}
```

| Campo | Notas |
|---|---|
| `id` | `[a-z0-9_-]`, igual al nombre del archivo. El prefijo `_` marca escenas de prueba (el frontend las ignora). |
| `case` | slug del caso. `kind`: `hero`, `wide`, `duo` o `detail`. |
| `plate` | relativo a `mockups/plates/`; o ruta completa desde la raíz si empieza por `mockups/` o `public/`. |
| `screen.source` (o `screens[].source`) | relativo a `mockups/screens/`, o ruta completa bajo `public/work/`. Cualquier otro origen falla (privacidad). |
| `screen.fit` | `cover` (recorta, por defecto) o `contain` (barras con `screen.bg`, `#000000`). |
| `screen.key` / `tolerance` | color clave (`#00FF00`) y tolerancia (50): es clave el píxel con G > 120 y G − máx(R,B) > tolerancia. |
| `screen.glare` | 0–1: devuelve al resultado los reflejos del plate sobre la pantalla (0 = sin reflejos). |
| `screens` | en vez de `screen`: lista de 1 a 3 pantallas `{ source, fit, glare, rank, … }`. `rank` 1 = la región verde de mayor área, 2 = la siguiente… `screen` único equivale a `screens:[{rank:1}]`. `key` y `tolerance` deben coincidir. |
| `screen.aspect` | opcional, ancho/alto físico de la pantalla si la perspectiva engaña (por defecto se estima del plate). |
| `output` | `dir` bajo `public/`, `width` máx. (2400), `quality` WebP (85), `lossless` opcional. |
| `higgsfield` | `model`, `resolution`, `prompt`, `job_id` (vacío si el plate es sintético), `notes`. |

**Dúo y pantallas múltiples:** declara cada pantalla en `screens`. Una región verde significativa (≥ 20 % de la mayor) que no esté declarada es un ERROR (y declarar de más también); las manchas verdes pequeñas se ignoran. Ejemplo: `mockups/scenes/_fixture-duo.json`. **Ojo con `rank`:** se decide por el conteo de píxeles verdes; si dos pantallas miden casi lo mismo, el orden es frágil y puede invertirse al regenerar el plate. Prefiere plates donde una pantalla sea claramente mayor. Una pantalla pegada al borde de la imagen se rechaza (esquinas falsas); si la captura es menor que la pantalla, avisa por stderr.

3. `npm run mockups:check` → debe imprimir «ok» con las esquinas detectadas; luego `npm run mockups:build` y mira el resultado.
4. Commit del plate, el manifiesto, la salida `.webp` y `src/data/scenes.generated.json`.

El nombre de salida lleva el hash del plate + la captura + los parámetros: cambiar cualquiera crea una URL nueva (el optimizador
cachea un año por URL) y borra solo las versiones viejas del mismo `id`. Los bytes del WebP pueden variar con la versión de libwebp/PIL aunque el nombre no cambie: el determinismo está garantizado en la misma máquina y versión de PIL. El `plate` debe estar bajo `mockups/plates/` o `mockups/fixtures/`; se rechazan rutas fuera y imágenes de más de 60 Mpx.

## Cuando Doug cambie la UI

1. Reemplaza la captura: la de `mockups/screens/` o la de `public/work/**` a la que apunta `screen.source` (misma ruta; saneada).
2. `npm run mockups:build`. Se regeneran solo las escenas cuya captura cambió; cero créditos.
3. Commit (captura, `.webp` nuevos y `src/data/scenes.generated.json`).

Si la captura nueva tiene otra proporción, `fit: "cover"` la recorta al formato de la pantalla; usa `contain` para no recortar.

## Regenerar un plate con Higgsfield

El prompt vive en el manifiesto (`higgsfield.prompt`). **Solo el director gasta créditos** (consulta el costo antes; un plate 2k
cuesta ~2). Nunca se reintenta a ciegas: si el plate falla, se describe el defecto y se cambia el prompt. Al aprobarlo: guarda
el resultado en `mockups/plates/<id>.webp`, anota `job_id`, `model`, `resolution` y corre `npm run mockups:check`. Un buen plate:
verde sin reflejos ni degradados, la pantalla entera a cuadro, dedos delante del verde, sin otros objetos verdes.

## Privacidad

Las capturas que entran a un mockup salen **solo** de fuentes ya saneadas: `public/work/**` o la demo sintética. Nunca de los
fixtures del panel real ni de capturas con pacientes, teléfonos o correos reales. El compositor rechaza cualquier otro origen.
Antes de commitear: `node scripts/qa/leak-scan.mjs`.

## Plantilla de prompt (plates con pantalla verde)

Hay dos direcciones. El primer plate real (`hero-mano`, 2 créditos, `gpt_image_2` 2k medium, 3:4) usó la **oscura editorial**;
la dirección final del sitio la elige Doug (Puerta A de `docs/rondas/FASE-1-DC.md`). Cambia solo la primera parte (el objeto) y
pega la base de la dirección elegida al final.

### Base CLARA (marfil, champán, mármol claro)

> Photorealistic editorial product photograph for a luxury aesthetic-medicine clinic. Palette: ivory, champagne, soft beige,
> light marble, white orchids or white peonies in a blurred background, soft diffused window light from the left, shallow depth
> of field, 85mm lens, high-end magazine look. **The device screen is a perfectly flat, uniform, pure chroma-key green
> (#00FF00): no reflections, no glare, no gradient, no UI, no text, no icons, no notch artifacts, entire screen visible and
> sharp.** No green plants or leaves anywhere in the scene, no other green objects, no text, no logos, no brand marks, no
> identifiable faces (crop faces out of frame; hands and forearms only), natural manicured hands, no jewelry with text.

**Celular en mano:** `A woman's manicured hand holding a modern smartphone in portrait, tilted about 15 degrees toward the camera, screen facing the viewer, three-quarter view, soft ivory linen sleeve, champagne-colored background bokeh.` + base clara.

**Laptop en escritorio:** `A slim laptop open on a light Carrara marble desk, viewed from a three-quarter front angle at a slightly raised height, a porcelain cup and a single white orchid stem beside it, champagne wall softly out of focus.` + base clara.

**Dúo (laptop + celular):** `A slim laptop open on a light marble desk with a smartphone standing upright next to it on a small champagne stone stand, both screens facing the camera, three-quarter view, white peonies in a blurred vase behind.` + base clara. *(Dos pantallas verdes: decláralas en `screens`; la laptop suele ser `rank` 1.)*

**Tableta:** `A tablet held landscape in two manicured hands over a light marble surface, slightly tilted toward the camera, soft ivory cashmere cuff, champagne bokeh with white flowers.` + base clara.

### Base OSCURA EDITORIAL (obsidiana, champán, luz de borde) — la del primer plate

**Celular en mano (objeto):**
`Photorealistic editorial product photograph for a luxury aesthetic-medicine clinic, dark and moody. A woman's elegant manicured hand with nude champagne-toned nails holds a modern smartphone in portrait, tilted about 15 degrees toward the camera, screen facing the viewer, three-quarter view, black silk sleeve cuff.`

**Base oscura (pegar después del objeto; sustituye el objeto para laptop, dúo o tableta):**

> Background: deep obsidian black polished marble with fine champagne-gold veining, softly out of focus, with a few soft
> champagne-gold light bokeh circles far behind. Lighting: one soft warm key light from the upper left and a thin champagne
> rim light along the edges of the hand and phone, subtle film grain, shallow depth of field, 85mm lens, high-end magazine
> look, generous dark negative space around the subject. The phone screen is a perfectly flat, uniform, pure chroma-key green
> (#00FF00) fill: no UI, no text, no icons, no reflections, no glare, no gradient, the entire screen visible and sharp with
> all four rounded corners fully in frame. **The screen does not emit light and casts no green glow, no green reflection and
> no green tint on the skin, nails, phone frame or background.** No other green anywhere in the scene, no plants, no leaves.
> No text, no logos, no brand marks, no jewelry, no identifiable faces (hand and forearm only, face out of frame).

El prompt literal del primer plate está en `mockups/scenes/hero-mano.json` (`higgsfield.prompt`).

### Lo que funcionó

Pedir **explícitamente** que la pantalla verde no emite brillo ni tinte sobre la piel, las uñas y el marco dio 0 píxeles de exceso
verde tras componer (sin esa frase, los modelos suelen dejar un reflejo verdoso en los dedos). Pide también las cuatro esquinas
redondeadas a cuadro: el compositor las necesita completas.

Pide 3:4 o 4:5 para `hero`/`detail` y 16:9 para `wide`. Revisa en el plate: verde plano y limpio, 4 esquinas visibles, sin texto ni rostros.

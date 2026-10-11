# Kit de mockups

**La escena se genera, la pantalla es real.** Higgsfield crea el *plate* (celular en mano, laptop en un escritorio de mármol…)
con la pantalla en verde plano `#00FF00`. `scripts/mockups/compose.py` detecta ese verde, ajusta las 4 esquinas por mínimos
cuadrados, aplica la perspectiva y pone encima la captura real de la UI, respetando dedos y reflejos. El texto de la interfaz
nunca lo deforma un modelo de imagen, y cuando la UI cambia se regenera todo **sin gastar créditos**.

```
mockups/plates/     plates archivados (los que salen de Higgsfield)
mockups/screens/    capturas fuente saneadas (o usa public/work/**)
mockups/scenes/     un manifiesto <id>.json por escena
mockups/fixtures/   plates sintéticos de prueba + verdad de sus esquinas (`make-fixture-plate.py`)
public/work/<caso>/scenes/<id>.<hash8>.webp   salida (nombre versionado por contenido)
src/data/scenes.generated.json                GENERADO (ver «Salida»); no se edita a mano
```

Comandos: `npm run mockups:build` (compone todo salvo las escenas de prueba `_*`; `--include-fixtures` las incluye) · `npm run mockups:check` (valida sin escribir) · `npm run mockups:test`.
También `python3 scripts/mockups/compose.py --scene <id> [--check]`. Solo Python 3 con PIL y numpy.

## Agregar una escena

1. Guarda el plate en `mockups/plates/<id>.webp` (o `.png`) y la captura saneada en `mockups/screens/` (o usa una de `public/work/**`).
2. Crea `mockups/scenes/<id>.json` (el nombre del archivo es el `id`):

```json
{
  "id": "dc-hero",
  "case": "dc-medical",
  "kind": "hero",
  "plate": "dc-hero.webp",
  "screen": { "source": "public/work/dc-medical/seguimiento-controles.webp", "fit": "cover", "key": "#00FF00", "tolerance": 50, "glare": 0, "cropped": true, "sheen": { "amount": 0.5, "angle": 40 } },
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
| `screen.cropped` | `true` si el encuadre corta la pantalla a propósito (esquinas fuera del plate). Sin él, una pantalla que toca el borde se rechaza. Ver «Pantallas recortadas». |
| `screen.quad` | respaldo manual `[[x,y]×4]` = TL, TR, BR, BL en px del plate (pueden quedar fuera); solo si la detección falla en un plate ya pagado. Se valida con el mismo residual. |
| `screen.sheen` | `{ "amount": 0–1, "angle": 0–360 }`: brillo de cristal que nace en una esquina de la captura y sigue la perspectiva; no toca los dedos. Ausente o `amount: 0` = sin brillo. Valor de las escenas: `{ 0.5, 35–140 }`. |
| `screen.aspect` | opcional, ancho/alto físico de la pantalla si la perspectiva engaña (por defecto se estima del plate). |
| `output` | `dir` bajo `public/`, `width` máx. (2400), `quality` WebP (85), `lossless` opcional. |
| `higgsfield` | `model`, `resolution`, `prompt`, `job_id` (vacío si el plate es sintético), `notes`. |

**Dúo y pantallas múltiples:** declara cada pantalla en `screens`. Una región verde significativa (≥ 20 % de la mayor) que no esté declarada es un ERROR (y declarar de más también); las manchas verdes pequeñas se ignoran. Ejemplo: `mockups/scenes/_fixture-duo.json`. **Ojo con `rank`:** se decide por el conteo de píxeles verdes; si dos pantallas miden casi lo mismo, el orden es frágil y puede invertirse al regenerar el plate. Prefiere plates donde una pantalla sea claramente mayor. Una pantalla pegada al borde de la imagen se rechaza (esquinas falsas); si la captura es menor que la pantalla, avisa por stderr.

3. `npm run mockups:check` → debe imprimir «ok» con las esquinas detectadas; luego `npm run mockups:build` y mira el resultado.
4. Commit del plate, el manifiesto, la salida `.webp` y `src/data/scenes.generated.json`.

### Pantallas recortadas (`cropped`) y brillo (`sheen`)

Con `cropped: true` el contorno del borde de la imagen (≤ 3 px) se ignora y las 4 rectas se ajustan solo con el borde real del
device; las esquinas se obtienen intersectando rectas y pueden caer **fuera** del plate (`--check` las marca `(fuera)`). Hace falta
ver **los cuatro lados**, cada uno con ≥ 40 puntos y ≥ 6 % de `max(ancho, alto)`; si no, falla diciendo qué lado falta. El recorte del 12 %
de cada extremo solo se aplica en las esquinas reales, no donde el lado termina contra el borde. `--check` imprime el **residual**
(debe ser ≤ 1,5 px), el **% del plate** que ocupa la pantalla y el **derrame** verde del anillo de 24 px (aviso ≥ 12, error ≥ 24).
El borde de la pantalla se compone con la cobertura real del verde (sin escalones) y el borde del dedo se descontamina del verde.

## Salida

`src/data/scenes.generated.json` lo escribe `compose.py` (no se edita a mano), ordenado por `id`, sin las escenas `_*` (salvo con
`--include-fixtures`); es lo único que importa el frontend. Los textos viven **solo** en el manifiesto:

```json
"dc-hero": {
  "case": "dc-medical", "kind": "hero",
  "src": "/work/dc-medical/scenes/dc-hero.1a2b3c4d.webp", "width": 2400, "height": 1350,
  "alt": { "es": "…", "en": "…" }, "caption": { "es": "…", "en": "…" }
}
```

`--all` regenera el archivo entero; `--scene <id>` actualiza solo esa entrada y conserva las demás. Una escena `_*` se compone
pero nunca entra al JSON salvo que se pida con `--include-fixtures` (úsalo solo en un `--root` temporal).

## Pruebas y fixtures

`npm run mockups:test` usa plates y capturas **sintéticos** (`mockups/fixtures/`, `mockups/screens/fixture-*.webp`), generados con
`python3 scripts/mockups/make-fixture-plate.py` (`--cropped` solo el recortado). Ninguna prueba con fixtures usa capturas reales.
Los plates reales de prueba (`_light-phone-a`, `_light-tablet-b`) están en `mockups/plates/` con prefijo `_`: no se publican.

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

**Dirección vigente (Doug): clara y limpia**, referencias «Ron Design Lab»: fondo liso y claro (gris perla, azul hielo, lavanda→rosa
suave; degradados sin textura), **sin props**, el device ocupa casi todo el encuadre con perspectiva dramática (inclinado 20–35°),
a veces cortado por el borde, y manos cuyos dedos cruzan **por delante** de la pantalla. La UI de DC es pastel, así que escena y
UI se sienten un solo sistema. Prohibido en escena y fondo: verde y menta (chocan con la clave), plantas, joyas, marcas, rostros.

**Base clara** (rellena `{ESCENA}`, `{FONDO}` y `{DISPOSITIVO}`; es la de las pruebas A y B):

> Clean, refined premium product photograph, the style of a high-end app launch mockup. {ESCENA}. Seamless soft studio background: {FONDO}, no props, no objects. Soft diffused studio light, shallow depth of field, ultra clean and minimal.
> The {DISPOSITIVO} screen is a perfectly flat, uniform, pure chroma-key green (#00FF00): no UI, no text, no icons, no reflections, no glare, no gradient; the screen emits no light and casts no green glow or green tint on the skin, nails, frame or background. No other green anywhere, no plants. No text, no logos, no brand marks, no jewelry, no identifiable face (hands and forearms only, when hands appear).

| Variante | `{ESCENA}` | `{FONDO}` / `{DISPOSITIVO}` |
|---|---|---|
| Celular en mano, dedo por delante | *Extreme close-up of a modern smartphone held in portrait by an elegant woman's hand with natural nude manicure, tilted about 25 degrees toward the camera with strong perspective, the device filling most of the frame and slightly cropped by the frame edge. The fingertips of her other hand reach in front of the lower part of the screen, as if about to tap, overlapping the screen* | *a smooth pale pearl-grey to soft lavender-blush gradient* / *phone* |
| Tableta en dos manos, recortada | *A slim modern tablet held in landscape by two elegant hands with natural nude manicure and a light-to-medium skin tone, strongly foreshortened with dramatic perspective as if seen from the left and slightly below, the device huge in the frame, its upper-right corner cropped by the edge of the image while the screen's top, left, bottom and right edges all stay partly visible* | *a smooth pale ice-blue to pearl-grey gradient* / *tablet* |
| Monitor, primer plano | *An extreme close-up of a large thin-bezel desktop monitor seen from slightly above and from the right with strong perspective, the display filling most of the frame, its lower-left corner cropped by the edge of the image while the screen's four edges all stay partly visible, no desk and no stand base in view* | *a smooth pearl-grey to soft lavender-blush gradient* / *monitor* |
| Laptop en picado bajo | *A slim modern laptop open, seen from a low angle at about 30 degrees from the left with dramatic perspective, the screen filling most of the frame and its upper-right corner cropped by the edge of the image while all four edges of the screen stay partly visible, no hands* | *a smooth pale ice-blue to soft lavender gradient* / *laptop* |
| Laptop con guante negro | *A slim modern laptop open, seen from the right and slightly above in strong perspective, the screen filling most of the frame; the fingertips of a hand in a thin black glove reach in front of the lower-right part of the screen, overlapping it, as if about to tap* | *a smooth pearl-grey to pale ice-blue gradient* / *laptop* |
| Tableta con una mano de piel oscura | *A slim modern tablet held in landscape by one hand with a deep brown skin tone and natural nude manicure, tilted about 25 degrees toward the camera with strong perspective, the device filling most of the frame; the fingertips of the other hand reach in front of the lower-left part of the screen, overlapping it, as if about to tap* | *a smooth soft lavender to blush-pink gradient* / *tablet* |

Criterios de aceptación de un plate (se revisan con `--check` y **una** mirada al compuesto): una sola región verde sólida con los 4 lados
detectados, residual ≤ 1,5 px, derrame < 12; sin tinte verde en piel, uñas, marco ni fondo; sin plantas, texto, logos, rostros ni joyas;
dedos limpios por delante de la UI (cinco dedos); el device protagonista; fondo liso de la familia indicada. **Un reintento por escena,
solo con aprobación del director**; antes se corrige sin créditos (`tolerance`, `quad`, `fit`).

### Lo que funcionó

Pedir **explícitamente** que la pantalla verde no emite luz ni tinte sobre la piel, las uñas y el marco dio 0 píxeles de exceso verde
tras componer (sin esa frase, los modelos suelen dejar un reflejo verdoso en los dedos). Con fondo liso y claro el borde del dedo se
descontamina bien. Pide siempre los cuatro lados de la pantalla visibles: el compositor los necesita completos, aunque el encuadre corte una esquina.

### Alternativa archivada: oscura editorial (solo texto)

La usó el primer plate (`_hero-mano-oscuro`, `gpt_image_2` 2k medio, 3:4, 2 créditos); Doug eligió la dirección clara. Su prompt literal está en
`mockups/scenes/_hero-mano-oscuro.json`. Objeto + base:

> Photorealistic editorial product photograph for a luxury aesthetic-medicine clinic, dark and moody. A woman's elegant manicured hand with nude champagne-toned nails holds a modern smartphone in portrait, tilted about 15 degrees toward the camera, screen facing the viewer, three-quarter view, black silk sleeve cuff.
> Background: deep obsidian black polished marble with fine champagne-gold veining, softly out of focus, with a few soft champagne-gold light bokeh circles far behind. Lighting: one soft warm key light from the upper left and a thin champagne rim light along the edges of the hand and phone, subtle film grain, shallow depth of field, 85mm lens, high-end magazine look, generous dark negative space around the subject. The phone screen is a perfectly flat, uniform, pure chroma-key green (#00FF00) fill: no UI, no text, no icons, no reflections, no glare, no gradient, the entire screen visible and sharp with all four rounded corners fully in frame. The screen does not emit light and casts no green glow, no green reflection and no green tint on the skin, nails, phone frame or background. No other green anywhere in the scene, no plants, no leaves. No text, no logos, no brand marks, no jewelry, no identifiable faces (hand and forearm only, face out of frame).

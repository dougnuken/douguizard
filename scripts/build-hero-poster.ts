/**
 * Póster de la foto activa del héroe (`src/data/hero.ts`), **sin hornear**
 * (F2): AVIF y WebP a los anchos de `rutas.poster` desde el máster de
 * `docs/rediseno-2026/retratos-hf/<id>.jpg`. F4 lo cambia por el póster
 * horneado con el vidrio. Uso: `npm run hero:poster`.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getFotoActiva } from "../src/data/hero";

const foto = getFotoActiva();
const master = path.join("docs/rediseno-2026/retratos-hf", `${foto.id}.jpg`);
const salida = (ruta: string) => path.join("public", ruta);
mkdirSync(path.join("public", "hero"), { recursive: true });

async function main() {
  for (const [w, ruta] of Object.entries(foto.rutas.poster.avif)) {
    await sharp(master).resize({ width: Number(w) }).avif({ quality: 52, effort: 6 }).toFile(salida(ruta));
  }
  for (const [w, ruta] of Object.entries(foto.rutas.poster.webp)) {
    await sharp(master).resize({ width: Number(w) }).webp({ quality: 74, effort: 6 }).toFile(salida(ruta));
  }
  console.log(`póster de ${foto.id} v${foto.version} listo en public/hero/`);
}
main();

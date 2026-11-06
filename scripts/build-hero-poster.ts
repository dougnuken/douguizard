/**
 * Póster de la foto activa del héroe (`src/data/hero.ts`), **sin hornear**
 * (F2): AVIF y WebP a los anchos de `rutas.poster` desde el máster de
 * `docs/rediseno-2026/retratos-hf/<id>.jpg`. F4 lo cambia por el póster
 * horneado con el vidrio. Uso: `npm run hero:poster`.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getFotoActiva, retratoPerfil } from "../src/data/hero";

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
  // K13 (F3): el retrato de la card de Perfil del home.
  const k13 = path.join("docs/rediseno-2026/retratos-hf", `${retratoPerfil.id}.jpg`);
  mkdirSync(path.join("public", "portrait"), { recursive: true });
  for (const [w, ruta] of Object.entries(retratoPerfil.rutas.avif)) {
    await sharp(k13).resize({ width: Number(w) }).avif({ quality: 50, effort: 6 }).toFile(salida(ruta));
  }
  for (const [w, ruta] of Object.entries(retratoPerfil.rutas.webp)) {
    await sharp(k13).resize({ width: Number(w) }).webp({ quality: 72, effort: 6 }).toFile(salida(ruta));
  }
  console.log(`retrato K13 ${retratoPerfil.id} v${retratoPerfil.version} listo en public/portrait/`);
}
main();

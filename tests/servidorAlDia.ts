import { readFileSync } from "node:fs";
import type { FullConfig } from "@playwright/test";

/**
 * `globalSetup` de Playwright (pulido G, tarea del dock). Con
 * `reuseExistingServer`, la suite usa cualquier servidor que ya escuche en el
 * puerto, aunque sea un `next-server` de una compilación anterior (matar
 * `next start` deja vivo su hijo `next-server`). Ese servidor mezcla páginas en
 * memoria del build viejo con ficheros del nuevo: el RSC trae otro `buildId`
 * y Next cae a navegaciones duras (el «Contacto» del dock perdía `#contact`).
 * Se comprueba que el servidor sirve el build de `.next/BUILD_ID`.
 */
export default async function servidorAlDia(config: FullConfig) {
  const base = config.projects[0]?.use.baseURL ?? "http://localhost:3131";
  let esperado: string;
  try {
    esperado = readFileSync(".next/BUILD_ID", "utf8").trim();
  } catch {
    return; // sin build local (p. ej. otra raíz): nada que comparar
  }
  const html = await (await fetch(base + "/")).text();
  const servido = /\\?"b\\?":\\?"([\w-]+)/.exec(html)?.[1];
  if (servido && servido !== esperado) {
    throw new Error(
      `El servidor de ${base} sirve el build ${servido}, pero .next/BUILD_ID es ${esperado}: ` +
        "es un next-server de una compilación anterior. Páralo (pkill -f next-server) y vuelve a correr la suite.",
    );
  }
}

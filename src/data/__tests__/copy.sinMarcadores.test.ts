import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Ningún marcador de borrador puede llegar a lo que el sitio muestra: ni en el
 * diccionario ni en los datos. (04-COPY usa `[DATO A CONFIRMAR …]` y
 * `⚠️ CONFIRMAR` para lo que Doug aún no respondió.)
 */
const ROOT = process.cwd();
const MARCADORES = [/\[DATO A CONFIRMAR/, /⚠️\s*CONFIRMAR/, /\bTODO\b/, /\bFIXME\b/, /\bTBD\b/, /\bLorem ipsum\b/i];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) return e === "__tests__" ? [] : walk(full);
    return /\.tsx?$/.test(e) ? [full] : [];
  });
}

/**
 * Quita los comentarios (los `⚠️ CONFIRMAR DOUG` de `cv.ts`/`work.ts` son notas
 * para Doug, no texto visible), conservando los saltos de línea para que el
 * número de línea del fallo siga siendo el del archivo.
 */
function sinComentarios(fuente: string): string {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, (b) => b.replace(/[^\n]/g, ""))
    .replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");
}

const archivos = [join(ROOT, "src/i18n/dictionaries.ts"), join(ROOT, "src/i18n/sistema.ts"), ...walk(join(ROOT, "src/data"))];

describe("copy sin marcadores de borrador", () => {
  for (const archivo of archivos) {
    it(relative(ROOT, archivo), () => {
      const hallados = sinComentarios(readFileSync(archivo, "utf8"))
        .split("\n")
        .flatMap((linea, i) => (MARCADORES.some((m) => m.test(linea)) ? [`${i + 1}: ${linea.trim()}`] : []));
      expect(hallados).toEqual([]);
    });
  }
});

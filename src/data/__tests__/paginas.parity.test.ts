import { describe, expect, it } from "vitest";
import { archivo, ordenCasos } from "@/data/home";
import { cifrasCaso } from "@/data/home";
import { dictionaries } from "@/i18n/dictionaries";
import { enPalabras, paginasDict } from "@/i18n/paginas";
import { sistemaDict } from "@/i18n/sistema";

function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => shape(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

describe("copy de /work, /about y /experience", () => {
  it("tiene la misma forma en los dos idiomas", () => {
    expect(shape(paginasDict.es).sort()).toEqual(shape(paginasDict.en).sort());
  });

  it("no choca con el diccionario ni con el microcopy del sistema", () => {
    for (const k of Object.keys(paginasDict.en)) {
      expect(Object.keys(dictionaries.en)).not.toContain(k);
      expect(Object.keys(sistemaDict.en)).not.toContain(k);
    }
  });

  it("cada losa y cada fila del archivo tiene su copy, con una etiqueta por cifra", () => {
    for (const l of ["es", "en"] as const) {
      for (const slug of ordenCasos) {
        expect(paginasDict[l].trabajo.losas[slug].etiquetas, `${l} ${slug}`).toHaveLength(cifrasCaso[slug].length);
      }
      for (const slug of archivo) expect(paginasDict[l].trabajo.lineasArchivo[slug], `${l} ${slug}`).toBeTruthy();
    }
  });

  it("los títulos de 04 §4.6 caben en 60 y las descripciones en 160", () => {
    for (const l of ["es", "en"] as const) {
      const d = paginasDict[l];
      for (const t of [d.trabajo.meta.titulo, d.perfil.meta.titulo, d.trayectoria.meta.titulo]) {
        expect(`${t} · Doug Vargas`.length).toBeLessThanOrEqual(60);
      }
      expect(d.trabajo.meta.descripcion(10, enPalabras(3, l)).length).toBeLessThanOrEqual(160);
      expect(d.perfil.meta.descripcion("Head of Product", "Naowee").length).toBeLessThanOrEqual(160);
    }
  });

  it("números en palabras hasta nueve, cifra después", () => {
    expect(enPalabras(3, "es")).toBe("tres");
    expect(enPalabras(6, "en")).toBe("six");
    expect(enPalabras(12, "es")).toBe("12");
  });
});

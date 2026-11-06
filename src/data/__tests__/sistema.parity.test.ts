import { describe, expect, it } from "vitest";
import { sistemaDict } from "@/i18n/sistema";
import { dictionaries } from "@/i18n/dictionaries";

function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => shape(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, path ? `${path}.${k}` : k));
  }
  return [path];
}

describe("microcopy del sistema B", () => {
  it("tiene la misma forma en los dos idiomas", () => {
    expect(shape(sistemaDict.es).sort()).toEqual(shape(sistemaDict.en).sort());
  });

  it("no choca con ninguna clave del diccionario actual (F3 las fusiona)", () => {
    for (const k of Object.keys(sistemaDict.en)) expect(Object.keys(dictionaries.en)).not.toContain(k);
  });

  it("el dock tiene los 5 destinos de 07 (más «Secciones» en el caso)", () => {
    const { label, secciones, ...destinos } = sistemaDict.es.dock;
    expect(label).toBeTruthy();
    expect(secciones).toBeTruthy();
    expect(Object.keys(destinos)).toEqual(["trabajo", "perfil", "experiencia", "cv", "contacto"]);
  });
});

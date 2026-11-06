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

  // F3 la fusionó en el diccionario: cada clave llega tal cual (ninguna clave
  // del diccionario base la pisa ni la pisa a ella).
  it("está fusionada en el diccionario sin choques (F3)", () => {
    for (const l of ["es", "en"] as const)
      for (const [k, v] of Object.entries(sistemaDict[l])) expect(dictionaries[l][k as keyof typeof dictionaries.en]).toBe(v);
  });

  it("el dock tiene los 5 destinos de 07 (más «Secciones» en el caso)", () => {
    const { label, secciones, ...destinos } = sistemaDict.es.dock;
    expect(label).toBeTruthy();
    expect(secciones).toBeTruthy();
    expect(Object.keys(destinos)).toEqual(["trabajo", "perfil", "experiencia", "cv", "contacto"]);
  });
});

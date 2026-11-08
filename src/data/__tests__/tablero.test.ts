import { describe, expect, it } from "vitest";
import { nodosK11, secciones } from "@/data/home";
import { decisiones } from "@/data/decisiones";
import { getTestimonial, testimonials } from "@/data/testimonials";
import { retratoPerfil } from "@/data/hero";
import { paginasDict } from "@/i18n/paginas";
import { citasHome, oracionDe, tableroDict } from "@/i18n/tablero";
import { hitosTrayectoria } from "@/lib/trayectoria";
import { existsSync } from "node:fs";
import path from "node:path";

function shape(value: unknown, p = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => shape(v, `${p}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => shape(v, p ? `${p}.${k}` : k));
  return [p];
}

/** F3 · el tablero del home. */
describe("tablero del home (F3)", () => {
  it("el copy tiene la misma forma en ES y EN", () => {
    expect(shape(tableroDict.es).sort()).toEqual(shape(tableroDict.en).sort());
  });

  it("K15: cada oración del home está literal en su cita, en inglés, y Francesca no va", () => {
    expect(decisiones.citaFrancescaEnHome).toBe(false);
    expect(citasHome.map((c) => c.id)).not.toContain("francesca");
    for (const c of citasHome) {
      const t = testimonials.find((x) => x.id === c.id)!;
      const o = oracionDe(t.quote, c.fragmento);
      expect(t.quote).toContain(o);
      expect(o.split(/\s+/).length).toBeLessThanOrEqual(25);
      expect(getTestimonial(c.id, "es")!.quote).toBe(t.quote);
    }
  });

  it("K11: cada nodo existe en la trayectoria y caben cuatro en móvil", () => {
    const ids = hitosTrayectoria("es").map((h) => h.id as string);
    for (const n of nodosK11) for (const id of n.ids) expect(ids).toContain(id);
    expect(nodosK11.filter((n) => n.movil)).toHaveLength(4);
    // El último nodo es el cargo de hoy.
    expect(nodosK11.at(-1)!.ids[0]).toBe(hitosTrayectoria("es").filter((h) => !h.paralelo).at(-1)!.id);
  });

  it("las secciones del home son las de las pills y el dock", () => {
    expect([...secciones]).toEqual(["work", "about", "experience", "contact"]);
  });

  it("K13: el retrato 83a47bc7 existe en public/ en AVIF y WebP", () => {
    for (const r of [...Object.values(retratoPerfil.rutas.avif), ...Object.values(retratoPerfil.rutas.webp)]) {
      expect(r).toContain(`-v${retratoPerfil.version}-`);
      expect(existsSync(path.join("public", r)), r).toBe(true);
    }
  });

  it("«Leer el caso» lleva el artículo en ES (F2 P2-3)", () => {
    expect(paginasDict.es.perfil.leerCasoDe("Banco de Occidente")).toBe("Leer el caso del Banco de Occidente");
    expect(paginasDict.es.perfil.leerCasoDe("Qrvey")).toBe("Leer el caso de Qrvey");
    expect(paginasDict.en.perfil.leerCasoDe("Qrvey")).toBe("Read the Qrvey case");
  });
});

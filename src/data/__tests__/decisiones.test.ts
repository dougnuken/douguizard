import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  COLOFONES,
  CONSTRUCCIONES_LOCKUP,
  decisiones,
  DISPONIBILIDADES,
  FUENTES_LOCKUP,
  NOMBRES_K1,
  PDFS,
  RUTAS_PERFIL,
  TEMAS_CLARO_EN,
} from "@/data/decisiones";
import { getSite } from "@/data/site";
import { rolCorto } from "@/lib/career";

describe("decisiones de Doug", () => {
  it("cada valor está dentro de su unión", () => {
    expect(DISPONIBILIDADES).toContain(decisiones.disponibilidad);
    expect(RUTAS_PERFIL).toContain(decisiones.rutasPerfil);
    expect(TEMAS_CLARO_EN).toContain(decisiones.temaClaroEn);
    expect(FUENTES_LOCKUP).toContain(decisiones.nombreLockup.fuente);
    expect(CONSTRUCCIONES_LOCKUP).toContain(decisiones.nombreLockup.construccion);
    expect(PDFS).toContain(decisiones.pdfPorIdioma.es);
    expect(PDFS).toContain(decisiones.pdfPorIdioma.en);
    expect(COLOFONES).toContain(decisiones.colofon);
    expect(NOMBRES_K1).toContain(decisiones.nombreK1);
    expect(typeof decisiones.telefonoEnHome).toBe("boolean");
    expect(typeof decisiones.citaFrancescaEnHome).toBe("boolean");
    expect(typeof decisiones.hojaDesdeIndices).toBe("boolean");
  });

  it("Doto nunca baja de 20 px (D20)", () => {
    expect(decisiones.dotoMinimo).toBeGreaterThanOrEqual(20);
  });

  it("la disponibilidad de site.ts espeja D1 en los dos idiomas", () => {
    expect(getSite("es").availability.modo).toBe(decisiones.disponibilidad);
    expect(getSite("en").availability.modo).toBe(decisiones.disponibilidad);
  });

  it("el lockup es el decidido el 6 nov: opción 4, «corte láser»", () => {
    expect(decisiones.nombreLockup).toEqual({ fuente: "geologica", construccion: "corte" });
  });

  it("lockup.ts carga la fuente que dice decisiones.nombreLockup", () => {
    const lockup = readFileSync(join(process.cwd(), "src/app/fonts/lockup.ts"), "utf8");
    const familia = { geologica: "Geologica", "big-shoulders": "Big_Shoulders_Stencil" }[
      decisiones.nombreLockup.fuente as "geologica" | "big-shoulders"
    ];
    // Geologica se sirve local (instancia estática, F8); Big Shoulders vendría de Google.
    expect(lockup).toMatch(
      new RegExp(`import \\{ ${familia} \\} from "next/font/google"|src: "\\./${familia.toLowerCase()}[^"]*\\.woff2"`),
    );
  });

  it("rolCorto se deriva del cargo actual del CV", () => {
    expect(rolCorto()).toMatch(/^Head of Product · Barranquilla$/);
  });
});

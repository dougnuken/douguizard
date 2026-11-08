import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { caseStudies } from "@/data/work";
import { decisiones } from "@/data/decisiones";
import { tituloHojaId } from "../ids";
import { UMBRAL_PX, UMBRAL_VEL } from "../useArrastreHoja";

const raiz = path.resolve(__dirname, "../../../..");
const leer = (p: string) => fs.readFileSync(path.join(raiz, p), "utf8");

describe("hoja (F6)", () => {
  it("un id de título por caso, válido y único", () => {
    const ids = caseStudies.map((c) => tituloHojaId(c.slug));
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^hoja-titulo-[a-z0-9-]+$/);
  });

  it("arrastre: > 120 px o > 0,5 px/ms cierra (07 §1.3)", () => {
    expect(UMBRAL_PX).toBe(120);
    expect(UMBRAL_VEL).toBe(0.5);
  });

  it("un slot @modal por idioma, cada uno con default.tsx y la página interceptada", () => {
    for (const base of ["src/app/(es)/@modal", "src/app/(en)/en/@modal"]) {
      expect(fs.existsSync(path.join(raiz, base, "default.tsx")), base).toBe(true);
      const pagina = leer(`${base}/(.)work/[slug]/page.tsx`);
      expect(pagina).toContain("generateStaticParams");
      expect(pagina).toContain("notFound()");
      expect(pagina).toContain("enHoja");
    }
    // Sin catch-all en el slot: rompería los 404 (07 §1.2).
    expect(fs.existsSync(path.join(raiz, "src/app/(es)/@modal/[...catchAll]"))).toBe(false);
    expect(leer("src/app/(es)/layout.tsx")).toMatch(/modal/);
    expect(leer("src/app/(en)/en/layout.tsx")).toMatch(/modal/);
  });

  it("D22: /cv enlaza los casos con <a> (página completa); D21: /about y /experience con <Link>", () => {
    expect(decisiones.casosDesdeCv).toBe("pagina");
    expect(decisiones.hojaDesdeIndices).toBe(true);
    expect(leer("src/components/cv/CvExperience.tsx")).not.toMatch(/from "next\/link"/);
    expect(leer("src/components/perfil/Secciones.tsx")).toMatch(/from "next\/link"/);
    expect(leer("src/components/trayectoria/Trayectoria.tsx")).toMatch(/from "next\/link"/);
  });

  it("la página completa lleva la única <main> y el JSON-LD; CaseBody no", () => {
    const body = leer("src/components/case/CaseBody.tsx");
    expect(body).not.toMatch(/<main id=|<main\s*\n/);
    expect(body).not.toMatch(/ld\+json/);
    const pagina = leer("src/components/pages/CasePage.tsx");
    expect(pagina).toMatch(/<main id="main"/);
    expect(pagina).toMatch(/ld\+json/);
  });
});

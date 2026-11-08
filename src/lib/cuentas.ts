import { experiences } from "@/data/cv";
import { archivo } from "@/data/home";
import { caseStudies } from "@/data/work";
import { yearsOfExperience } from "@/lib/career";

/**
 * **La única cuenta** (07 §1.5, P1-4 de la crítica de páginas). «En cifras» de
 * `/work`, K12 del home y los acumulados de `/experience` salen de aquí; ningún
 * componente cuenta casos, propios, años ni empresas por su cuenta.
 * Valores de nov 2026: 12 años · 10 casos · 3 propios · 6 empresas.
 */

/** Años en producto digital: los mismos de `yearsOfExperience()` (ancla de carrera). */
export function aniosEnProducto(now: Date = new Date()): number {
  return yearsOfExperience(now);
}

/** Casos publicados: todos los de `work.ts` (largos, cortos y el paralelo). */
export function casosPublicados(): number {
  return caseStudies.length;
}

/** Productos propios (`kind: "personal"`), en el orden de `work.ts`. Chub es `side`: no cuenta. */
export function productosPropios(): { slug: string; project: string }[] {
  return caseStudies.filter((c) => c.kind === "personal").map((c) => ({ slug: c.slug, project: c.project }));
}

/**
 * Empleador de registro de cada experiencia (`employer ?? company.name`), sin
 * `freelance`: Qrvey cuenta como Ideaware. Ordenados por primera aparición en el tiempo.
 */
export function empleadores(): { nombre: string; desde: { year: number; month?: number } }[] {
  const vistos = new Map<string, { year: number; month?: number }>();
  const ordenadas = [...experiences].sort(
    (a, b) => a.start.year - b.start.year || (a.start.month ?? 1) - (b.start.month ?? 1),
  );
  for (const e of ordenadas) {
    if (e.id === "freelance") continue;
    const nombre = e.employer ?? e.company.name;
    if (!vistos.has(nombre)) vistos.set(nombre, e.start);
  }
  return [...vistos].map(([nombre, desde]) => ({ nombre, desde }));
}

/** Empresas: empleadores de registro distintos (6). */
export function empresas(): number {
  return empleadores().length;
}

export type GrupoCaso = "escala" | "propio" | "anterior";

/** Grupo del filtro de `/work`: propio (`personal`), anterior (archivo del home) o escala. */
export function grupoCaso(slug: string): GrupoCaso {
  const c = caseStudies.find((x) => x.slug === slug);
  if (!c) throw new Error(`cuentas.grupoCaso: no existe el caso "${slug}".`);
  if (c.kind === "personal") return "propio";
  if ((archivo as readonly string[]).includes(slug)) return "anterior";
  return "escala";
}

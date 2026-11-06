import type { CaseStudy } from "./work";

/**
 * Estructura del tablero del home B (F3 lo pinta). Solo slugs, ids y punteros:
 * las cifras y los textos se leen de `work.ts` / `cv.ts`, nunca se reescriben.
 */

/** D2 · Orden de los casos en el tablero y en `/work`. No cambia `num` ni `getNextCaseStudy` (D19). */
export const ordenCasos = [
  "naowee-suid",
  "mercadolibre-andes",
  "olbo",
  "banco-de-occidente",
  "dc-medical",
  "makeapet",
] as const satisfies readonly CaseStudy["slug"][];

/** K16 · «Más trabajo»: los casos cortos y el proyecto paralelo. */
export const archivo = ["royal-caribbean", "qrvey", "ideaware", "chub"] as const;

/**
 * Ids de las secciones del home, **en inglés en los dos idiomas**: `/#work` y
 * `/#contact` de hoy siguen llegando, y el cambio de idioma conserva el ancla.
 */
export const secciones = ["work", "about", "experience", "contact"] as const;
export type Seccion = (typeof secciones)[number];

export type Superficie = "vacio" | "losa" | "clara" | "niebla" | "azul" | "magenta" | "vidrio";

export interface CardCaso {
  /** Card del tablero (K3, K4, K7–K10). */
  k: "K3" | "K4" | "K7" | "K8" | "K9" | "K10";
  slug: (typeof ordenCasos)[number];
  superficie: Superficie;
  /** Índice del KPI en `caseStudies[].kpis` (el mismo en ES y EN). `null` = sin cifra. */
  kpi: number | null;
}

/** Mapeo K → caso (NOTAS de B §1). El KPI va por índice, nunca por la cifra escrita. */
export const cardsCaso: CardCaso[] = [
  { k: "K3", slug: "naowee-suid", superficie: "losa", kpi: 0 },
  { k: "K4", slug: "mercadolibre-andes", superficie: "azul", kpi: 0 },
  { k: "K7", slug: "olbo", superficie: "niebla", kpi: 0 },
  { k: "K8", slug: "banco-de-occidente", superficie: "losa", kpi: 0 },
  { k: "K9", slug: "dc-medical", superficie: "losa", kpi: null },
  { k: "K10", slug: "makeapet", superficie: "magenta", kpi: null },
];

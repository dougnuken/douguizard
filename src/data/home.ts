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
  // 04 §3 K3: la cifra de la card es «130+ pantallas» (índice 2), no los 30 trámites.
  { k: "K3", slug: "naowee-suid", superficie: "losa", kpi: 2 },
  { k: "K4", slug: "mercadolibre-andes", superficie: "azul", kpi: 0 },
  { k: "K7", slug: "olbo", superficie: "niebla", kpi: 0 },
  { k: "K8", slug: "banco-de-occidente", superficie: "losa", kpi: 0 },
  { k: "K9", slug: "dc-medical", superficie: "losa", kpi: null },
  { k: "K10", slug: "makeapet", superficie: "magenta", kpi: null },
];

/**
 * Cifras de cada losa de `/work` (y de las cards del tablero en F3), por
 * **índice** del KPI en `caseStudies[].kpis` (04 §3): la cifra escrita se lee
 * de `work.ts`. Andes lleva tres (diseñadores · ingenieros · países).
 */
export const cifrasCaso: Record<(typeof ordenCasos)[number], number[]> = {
  "naowee-suid": [2],
  "mercadolibre-andes": [0, 1, 2],
  olbo: [0],
  "banco-de-occidente": [0],
  "dc-medical": [0],
  makeapet: [0],
};

/**
 * K11 · nodos de la trayectoria del home (04 §3): ids de `lib/trayectoria`
 * (año de inicio desde `cv.ts`), empresa y cargo **cortos** cuando el del CV no
 * cabe en ~119 px. `movil`: los cuatro que caben a 390. `caso`: tiene caso.
 */
export const nodosK11: { ids: string[]; empresa?: string; cargo?: string; movil?: boolean; caso?: boolean }[] = [
  { ids: ["freelance"], movil: true },
  { ids: ["smartbiz"], empresa: "Smartbiz", cargo: "Junior UI" },
  { ids: ["ideaware", "qrvey"], empresa: "Ideaware · Qrvey", cargo: "Senior UX/UI → Lead UI", caso: true },
  { ids: ["globant"], cargo: "Senior PD", caso: true },
  { ids: ["aval"], empresa: "Aval · BdO", cargo: "Senior PD · DS Gatekeeper", movil: true, caso: true },
  { ids: ["mercadolibre"], cargo: "Tech Lead · DS", movil: true, caso: true },
  { ids: ["naowee"], movil: true, caso: true },
];

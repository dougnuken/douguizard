import { CAREER_ANCHOR, getCv, type YearMonth } from "@/data/cv";
import { eras, logros, type Hito } from "@/data/perfil";
import { getCaseMeta, getCaseStudy } from "@/data/work";
import type { Locale } from "@/i18n/config";
import { formatPeriod, getExperience } from "@/lib/career";
import { empleadores, productosPropios } from "@/lib/cuentas";
import { clamp, lerp } from "@/lib/mates";

/**
 * La trayectoria de `/experience` (07 §1.5, F2): hitos en orden, eras, el año
 * que corresponde a cada punto del scroll y los acumulados en cada año.
 * Puro y sin DOM: lo prueba vitest y lo usa la isla del pin. Fechas, cargos y
 * empresas salen de `cv.ts` / `work.ts`; el logro, de `perfil.ts`.
 */

export interface HitoTrayectoria {
  id: Hito;
  /** Año decimal de inicio (2016,75 = oct 2016). */
  inicio: number;
  /** Año decimal de fin (exclusivo). El rol en curso termina «hoy». */
  fin: number;
  /** Corre en paralelo (Chub): sin tramo propio en el eje. */
  paralelo: boolean;
  /** Título del hito: empresa (· cliente). */
  titulo: string;
  /** Rótulo corto bajo el tramo del eje. */
  corto: string;
  rol: string;
  periodo: string;
  logro: string;
  /** Slug del caso, si lo hay. */
  caso?: string;
  /** Nombre del caso para el `sr-only` de «Ver caso». */
  casoNombre?: string;
  /** El caso está bajo NDA («Ver caso · NDA»). */
  nda?: boolean;
}

const decimal = (p: YearMonth) => p.year + ((p.month ?? 1) - 1) / 12;
const decimalFin = (p: YearMonth) => (p.month ? p.year + (p.month - 1) / 12 : p.year + 1);

/** «Hoy» como año decimal, por mes y en UTC (nov 2026 = 2026,83). */
export function hoyDecimal(now: Date = new Date()): number {
  return now.getUTCFullYear() + now.getUTCMonth() / 12;
}

/** Iniciales de las palabras con mayúscula: «Universidad Autónoma del Caribe» → «UAC». */
const sigla = (s: string) =>
  s
    .split(/\s+/)
    .filter((w) => /^\p{Lu}/u.test(w))
    .map((w) => w[0])
    .join("");

const VIA: Record<Locale, string> = { es: "vía", en: "via" };

/** Los 10 hitos, del más antiguo al actual. */
export function hitosTrayectoria(locale: Locale, now: Date = new Date()): HitoTrayectoria[] {
  const cv = getCv(locale);
  const hoy = hoyDecimal(now);
  const out: HitoTrayectoria[] = [];

  for (const ed of cv.education) {
    if (ed.id !== "uac") continue;
    out.push({
      id: "uac",
      inicio: decimal(ed.start),
      fin: ed.end ? decimalFin(ed.end) : hoy,
      paralelo: false,
      titulo: ed.institution,
      corto: sigla(ed.institution),
      rol: ed.program,
      periodo: `${ed.start.year} — ${ed.end?.year ?? ""}`.trim(),
      logro: logros.uac[locale],
    });
  }

  for (const e of cv.experiences) {
    const caso = e.caseSlug ? getCaseStudy(e.caseSlug, locale) : undefined;
    const titulo = e.employer
      ? `${e.company.name} (${VIA[locale]} ${e.employer})`
      : e.client && caso
        ? `${e.company.name} · ${e.client}`
        : e.company.name;
    out.push({
      id: e.id,
      inicio: decimal(e.start),
      fin: e.end ? decimal(e.end) : hoy,
      paralelo: false,
      titulo,
      corto: e.company.name,
      rol: e.role,
      periodo: formatPeriod(e, locale),
      logro: logros[e.id][locale],
      caso: caso?.slug,
      casoNombre: caso ? (getCaseMeta(caso.slug, locale).client ?? caso.project) : undefined,
      nda: caso?.nda,
    });
  }

  // El proyecto paralelo: un hito con caso, sin tramo propio (P1-4).
  const chub = getCaseStudy("chub", locale);
  if (chub) {
    const meta = getCaseMeta("chub", locale);
    const anio = Number.parseInt(meta.year, 10);
    out.push({
      id: "chub",
      inicio: anio,
      fin: anio + 1,
      paralelo: true,
      titulo: `${getExperience("freelance").company.name} · ${chub.project}`,
      corto: chub.project,
      rol: meta.role,
      periodo: meta.year,
      logro: logros.chub[locale],
      caso: chub.slug,
      casoNombre: chub.project,
    });
  }

  return out.sort((a, b) => a.inicio - b.inicio);
}

/** Primer año del eje (inicio del primer hito). */
export const inicioEje = (hs: HitoTrayectoria[]) => hs[0].inicio;

/**
 * P1-9 · scroll por hito: cada hito recibe 1/n del recorrido y el año
 * interpola dentro de su tramo (de su inicio al inicio del siguiente; el
 * último, hasta hoy). El eje sigue dibujando duraciones reales.
 */
export function yDe(p: number, hs: HitoTrayectoria[], hoy: number): number {
  const n = hs.length;
  const k = clamp(p) * n;
  const i = Math.min(n - 1, Math.floor(k));
  const f = k - i;
  return lerp(hs[i].inicio, i < n - 1 ? hs[i + 1].inicio : hoy, f);
}

/** Progreso que activa el hito i: un poco dentro de su tramo. */
export function pDe(i: number, n: number): number {
  return (i + 0.08) / n;
}

/** Índice del hito activo en el año y (el último que ya empezó). */
export function activoEn(y: number, hs: HitoTrayectoria[]): number {
  let activo = 0;
  hs.forEach((h, i) => {
    if (y >= h.inicio - 1e-6) activo = i;
  });
  return activo;
}

/** Año decimal de cada producto propio (su `yearOverride`). */
function propiosConAnio(): number[] {
  return productosPropios().map((p) => Number.parseInt(getCaseMeta(p.slug, "en").year, 10));
}

export interface Acumulados {
  anios: number;
  empresas: number;
  casos: number;
}

/**
 * Acumulados en el año y. En y = hoy dan lo mismo que `cuentas.ts`
 * (`aniosEnProducto()`, `empresas()`, `casosPublicados()`).
 */
export function acumuladosEn(y: number, hs: HitoTrayectoria[]): Acumulados {
  const ancla = decimal(getExperience(CAREER_ANCHOR).start);
  // Tolerancia de una fracción de mes: los años decimales (k / 12) no son exactos en coma flotante.
  const e = 1e-3;
  return {
    anios: Math.max(0, Math.floor(y - ancla + e)),
    empresas: empleadores().filter((x) => decimal(x.desde as YearMonth) <= y + e).length,
    casos: hs.filter((h) => h.caso && h.inicio <= y + e).length + propiosConAnio().filter((a) => a <= y + e).length,
  };
}

/** Era en el año y (de `perfil.ts`). */
export function eraEn(y: number) {
  const i = eras.findIndex((e) => y >= e.desde && (e.hasta == null || y < e.hasta));
  return Math.max(0, i === -1 ? eras.length - 1 : i);
}

/** Posición 0–1 de un año a lo largo del eje. */
export function xDe(y: number, t0: number, t1: number): number {
  return (y - t0) / (t1 - t0);
}

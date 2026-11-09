import {
  CAREER_ANCHOR,
  experiences,
  type Experience,
  type ExperienceId,
  type YearMonth,
} from "@/data/cv";
import type { Locale } from "@/i18n/config";

const MONTHS: Record<Locale, readonly string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
};

/** The open end of a current role. "Hoy" is the Spanish CV's word for it. */
const NOW: Record<Locale, string> = { en: "Now", es: "Hoy" };

/**
 * The most recent role: the one with the latest start. Naowee ended in
 * Oct 2026, so no experience is open any more: this is the "last role", not
 * the "current role". At most one experience may omit `end`.
 */
export function latestExperience(): Experience {
  const open = experiences.filter((e) => e.end === undefined);
  if (open.length > 1) {
    throw new Error(`cv.experiences may declare at most one open role (no \`end\`); found ${open.length}.`);
  }
  const t = (e: Experience) => e.start.year * 12 + (e.start.month ?? 1);
  return [...experiences].sort((a, b) => t(b) - t(a))[0];
}

/** Experience by id. Throws on an unknown id — a typo must fail the build. */
export function getExperience(id: ExperienceId): Experience {
  const found = experiences.find((e) => e.id === id);
  if (!found) throw new Error(`Unknown experience id: "${id}".`);
  return found;
}

/** "Oct 2016", "2024" (month omitted), "Now" (end undefined). "Ago 2017" / "Hoy" in Spanish. */
export function formatPoint(point: YearMonth | undefined, locale: Locale = "en"): string {
  if (!point) return NOW[locale];
  return point.month ? `${MONTHS[locale][point.month - 1]} ${point.year}` : String(point.year);
}

/**
 * "Oct 2016 — Aug 2017" · "Jan 2026 — Now" · "2024 — Jan 2026".
 * Em dash with single spaces on both sides. Never "Present", never "Ongoing" —
 * and in Spanish never "Presente" or "Actualidad" either: "Ene 2026 — Hoy".
 */
export function formatPeriod(e: Pick<Experience, "start" | "end">, locale: Locale = "en"): string {
  return `${formatPoint(e.start, locale)} — ${formatPoint(e.end, locale)}`;
}

/**
 * Whole years, floored, between a start point and `now`. Compared at
 * year+month resolution in UTC so the result is timezone-independent.
 * Exported so the derivation can be tested against an arbitrary anchor
 * without mocking the data module.
 */
export function yearsBetween(from: YearMonth, now: Date): number {
  const years = now.getUTCFullYear() - from.year;
  const nowMonth = now.getUTCMonth() + 1;
  return nowMonth < (from.month ?? 1) ? years - 1 : years;
}

/**
 * Whole years from CAREER_ANCHOR's start to `now`. Replaces every hardcoded
 * "Twelve years" / "12" / "A decade" in the codebase. `now` is injected so the
 * test is not time-dependent.
 */
export function yearsOfExperience(now: Date = new Date()): number {
  return yearsBetween(getExperience(CAREER_ANCHOR).start, now);
}

/**
 * Employers whose END CLIENT is surfaced as its own wordmark.
 *
 * 07 §a (which the review deltas §A make authoritative over 03 §3.1) fixes the
 * strip as: Naowee · Mercadolibre · Aval Digital Labs · Banco de Occidente ·
 * Globant · Qrvey · Ideaware. Only Aval's client appears there: the other
 * `client` values name a product (Andes Design System, Embedded Analytics
 * Platform) or sit inside their employer's own case (Royal Caribbean).
 * ⚠️ CONFIRMAR DOUG — adding an id here adds that client to the strip.
 */
const CLIENT_WORDMARK_EMPLOYERS: ReadonlySet<ExperienceId> = new Set(["aval"]);

/**
 * The hero wordmark strip, newest first. Derived from `cv.experiences`, so
 * adding an employer updates the strip with no component edit. "Earlier" roles
 * (Smartbiz, Freelance) are excluded.
 */
export function getWordmarks(): string[] {
  return experiences
    .filter((e) => e.era !== "earlier")
    .flatMap((e) =>
      e.client && CLIENT_WORDMARK_EMPLOYERS.has(e.id)
        ? [e.company.name, e.client]
        : [e.company.name],
    );
}

/** "Barranquilla, Colombia" · "LATAM" — whichever the experience declares. */
export function formatLocation(e: Experience): string | undefined {
  const { city, country, region } = e.location;
  const parts = [city, country].filter(Boolean);
  if (parts.length) return parts.join(", ");
  return region ?? undefined;
}

/**
 * «Cargo · Ciudad» del rol en curso, para K1 y el pie del sistema B («Head of
 * Product · Barranquilla»). Vive aquí y no en `site.ts` porque `site.ts` lo
 * importan componentes cliente (`SiteHeader`) y esto arrastraría `cv.ts` entero
 * al JS del navegador (+5 KB gz medidos en F1).
 */
export function rolCorto(): string {
  const actual = latestExperience();
  return `${actual.roleShort ?? actual.role} · ${actual.location.city ?? ""}`.replace(/ · $/, "");
}

import {
  CAREER_ANCHOR,
  experiences,
  type Experience,
  type ExperienceId,
  type YearMonth,
} from "@/data/cv";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** The one experience with no `end`. Throws if the data has zero or two. */
export function currentExperience(): Experience {
  const open = experiences.filter((e) => e.end === undefined);
  if (open.length !== 1) {
    throw new Error(
      `cv.experiences must declare exactly one current role (no \`end\`); found ${open.length}.`,
    );
  }
  return open[0];
}

/** Experience by id. Throws on an unknown id — a typo must fail the build. */
export function getExperience(id: ExperienceId): Experience {
  const found = experiences.find((e) => e.id === id);
  if (!found) throw new Error(`Unknown experience id: "${id}".`);
  return found;
}

/** "Oct 2016", "2024" (month omitted), "Now" (end undefined). */
export function formatPoint(point: YearMonth | undefined): string {
  if (!point) return "Now";
  return point.month ? `${MONTHS[point.month - 1]} ${point.year}` : String(point.year);
}

/**
 * "Oct 2016 — Aug 2017" · "Jan 2026 — Now" · "2024 — Jan 2026".
 * Em dash with single spaces on both sides. Never "Present", never "Ongoing".
 */
export function formatPeriod(e: Experience): string {
  return `${formatPoint(e.start)} — ${formatPoint(e.end)}`;
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

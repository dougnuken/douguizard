import generated from "@/data/scenes.generated.json";
import type { CaseStudy } from "@/data/work";
import type { Locale } from "@/i18n/config";

export type SceneKind = "hero" | "wide" | "duo" | "detail";

export interface SceneEntry {
  case: string;
  kind: SceneKind;
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
}

export interface CaseScene {
  id: string;
  kind: SceneKind;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export const SCENE_BAND_MAX = 5;

/**
 * The scenes a case lists, resolved against the generated manifest in one
 * language. Throws (so the build fails) on anything that should never ship: an
 * unknown id, a `_` fixture id, another case's scene, a repeat, or missing words.
 */
export function getCaseScenes(
  study: CaseStudy,
  locale: Locale,
  source: Record<string, SceneEntry> = generated as unknown as Record<string, SceneEntry>,
): CaseScene[] {
  const seen = new Set<string>();
  return (study.scenes ?? []).map((id) => {
    if (id.startsWith("_")) throw new Error(`${study.slug}: scene "${id}" is a fixture and must never be listed`);
    const entry = source[id];
    if (!entry) throw new Error(`${study.slug}: scene "${id}" is not in scenes.generated.json`);
    if (entry.case !== study.slug) throw new Error(`${study.slug}: scene "${id}" belongs to "${entry.case}"`);
    if (seen.has(id)) throw new Error(`${study.slug}: scene "${id}" is listed twice`);
    seen.add(id);
    const alt = entry.alt?.[locale];
    const caption = entry.caption?.[locale];
    if (!alt?.trim() || !caption?.trim()) throw new Error(`${study.slug}: scene "${id}" lacks alt/caption in "${locale}"`);
    return { id, kind: entry.kind, src: entry.src, width: entry.width, height: entry.height, alt, caption };
  });
}

export function planScenes(scenes: CaseScene[]): {
  hero?: CaseScene;
  band: { scene: CaseScene; span: 6 | 12; offset: boolean }[];
} {
  const heroes = scenes.filter((s) => s.kind === "hero");
  if (heroes.length > 1) throw new Error("A case can have only one hero scene");
  const rest = scenes.filter((s) => s.kind !== "hero");
  if (rest.length > SCENE_BAND_MAX) throw new Error(`A scene band holds at most ${SCENE_BAND_MAX} scenes`);
  const band = rest.map((scene, i) => {
    if (scene.kind !== "detail") return { scene, span: 12 as const, offset: false };
    const prev = rest[i - 1]?.kind === "detail";
    const next = rest[i + 1]?.kind === "detail";
    // Details pair up in order: a run of details shares rows two by two.
    let run = 0;
    for (let j = i - 1; j >= 0 && rest[j].kind === "detail"; j--) run++;
    const paired = run % 2 === 0 ? next : prev;
    return { scene, span: 6 as const, offset: !paired };
  });
  return { hero: heroes[0], band };
}

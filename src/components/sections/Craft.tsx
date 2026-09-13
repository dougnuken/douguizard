import { sections } from "@/data/sections";
import { getCaseStudy } from "@/data/work";
import { currentExperience } from "@/lib/career";
import RevealText from "@/components/text/RevealText";
import CraftTimeline, { type Step } from "@/components/sections/CraftTimeline";

const panel = sections[2];
const current = currentExperience();

// The Andes scale figures come from the case's own data, never retyped here.
const andes = getCaseStudy("mercadolibre-andes");
const andesScale = (andes?.team ?? "").replace(", ", " and ");
const andesCountries =
  andes?.kpis?.find((k) => k.label === "Countries shipped to")?.value ?? "";

const EXPERTISE: { title: string; body: string }[] = [
  {
    title: "Product direction",
    body: `I decide what a product should be and then stay accountable for it shipping. At ${current.company.name} that means eight business modules, the states and roles underneath them, and a review where the built version has to match the demo.`,
  },
  {
    title: "Design systems",
    body: `Tokens, components, governance and the boring documentation that makes good design repeatable. I have built one for a bank and maintained one used by ${andesScale} across ${andesCountries} countries.`,
  },
  {
    title: "Design engineering with AI",
    body: "I prototype in code, with Claude Code, Cursor and Gemini carrying the repetitive weight. The output is a running product, not a mockup, which is why business signs off against it instead of against a document.",
  },
];

const STEPS: Step[] = [
  {
    title: "Read the domain before drawing",
    // 45+ states / 15 roles are on Naowee's verified figure set (cv.ts).
    body: `Before a screen exists I map how the thing actually works. For ${current.company.name}'s inspection flow that was 45+ states and 15 roles. The states were the product; the interface was the easy part.`,
  },
  {
    title: "Build the language, not the screens",
    body: "The failure mode is eight modules with eight dialects. So I build the system first and hold everyone to it, myself included. No custom component — if the system is missing something, the system gets extended.",
  },
  {
    title: "The prototype is the spec",
    body: "What business signs is a working prototype with real roles and real states, walked through one story at a time. Disagreement surfaces while it is still cheap and engineering receives something already resolved.",
  },
  {
    title: "Ship, then listen",
    body: "Daily use surfaces what no spec would have. olbo taught me that in a week — a timezone bug that broke the colour after dark, receipts I refused to retype. Each one became a decision, a test and a version bump.",
  },
];

/**
 * Rules instead of cards: a hairline between cells, on the axis the grid
 * actually splits at each breakpoint. Stacked below md, two columns at md,
 * one row at lg — so the rules always meet and no gap floats.
 *
 * The air around a rule is 48px, not 32. At 32 the rule sat close enough to a
 * 34ch measure to read as a border drawn around the paragraph instead of a
 * division between two of them.
 */
const CELL_BASE =
  "border-[var(--line)] border-t pt-6 first:border-t-0 first:pt-0 " +
  "md:[&:nth-child(-n+2)]:border-t-0 md:[&:nth-child(-n+2)]:pt-0 " +
  "md:[&:nth-child(2n)]:border-l md:[&:nth-child(2n)]:pl-12 md:[&:nth-child(2n+1)]:pr-12";

const CELL_3 =
  `${CELL_BASE} lg:border-t-0 lg:pt-0 lg:pr-0 lg:[&:nth-child(2n)]:pl-0 ` +
  "lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-12 lg:[&:not(:last-child)]:pr-12";

export default function Craft() {
  return (
    <section
      id={panel.id}
      aria-labelledby="craft-title"
      className="mx-auto flex w-full max-w-[1400px] shrink-0 flex-col gap-14 px-6 py-16 md:px-12 lg:min-h-full lg:justify-center lg:py-20"
    >
      <header className="flex flex-col gap-4">
        <p className="kicker">
          {panel.num} — Craft
        </p>
        <h2
          id="craft-title"
          className="font-display text-[length:var(--step-title)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--ink)]"
        >
          {panel.title}
        </h2>
      </header>

      <div className="flex flex-col gap-6">
        <p className="kicker text-[var(--ink-dim)]">Expertise</p>
        <div className="grid gap-6 md:grid-cols-2 md:gap-0 lg:grid-cols-3">
          {EXPERTISE.map((item, i) => (
            <RevealText
              key={item.title}
              as="div"
              variant="fade"
              delay={Math.min(i * 0.06, 0.25)}
              className={`flex flex-col gap-3 ${CELL_3}`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-dim)]">
                <span aria-hidden className="mb-2 block h-px w-6 bg-[var(--line-strong)]" />
                FIG 0.{i + 1}
              </span>
              <h3 className="font-display text-[length:var(--step-lead)] font-semibold leading-[1.2] tracking-[-0.015em] text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="max-w-[34ch] text-[length:var(--step-body)] leading-[1.6] text-[var(--ink-muted)]">
                {item.body}
              </p>
            </RevealText>
          ))}
        </div>
      </div>

      <div className="hairline-t flex flex-col gap-8 pt-14">
        <p className="kicker text-[var(--ink-dim)]">How I work</p>
        <CraftTimeline steps={STEPS} />
      </div>
    </section>
  );
}

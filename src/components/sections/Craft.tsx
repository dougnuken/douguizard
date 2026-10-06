import { getSections } from "@/data/sections";
import { getCaseStudy } from "@/data/work";
import { currentExperience } from "@/lib/career";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import RevealText from "@/components/text/RevealText";
import CraftTimeline, { type Step } from "@/components/sections/CraftTimeline";

/**
 * The panel's copy in each language. The figures inside it are read from the
 * data — the Andes scale from the case, the company from the CV — never
 * retyped here.
 */
function craftCopy(locale: Locale): { expertise: { title: string; body: string }[]; steps: Step[] } {
  const company = currentExperience().company.name;
  const andes = getCaseStudy("mercadolibre-andes", locale);
  const countries =
    getCaseStudy("mercadolibre-andes", "en")?.kpis?.find((k) => k.label === "Countries shipped to")
      ?.value ?? "";
  const scale = getDict(locale).hero.joinScale(andes?.team ?? "");

  if (locale === "es") {
    return {
      expertise: [
        {
          title: "Dirección de producto",
          body: `Decido qué debería ser un producto y después sigo respondiendo por él hasta que sale. En ${company} eso significa ocho módulos de negocio, los estados y roles que tienen debajo, y una revisión donde la versión construida tiene que coincidir con la demo.`,
        },
        {
          title: "Sistemas de diseño",
          body: `Tokens, componentes, gobierno y la documentación aburrida que hace repetible el buen diseño. Construí uno para un banco y mantuve uno que usan ${scale} en ${countries} países.`,
        },
        {
          title: "Ingeniería de diseño con IA",
          body: "Prototipo en código, con Claude Code, Cursor y Gemini cargando el peso repetitivo. Lo que sale es un producto que funciona, no un mockup, y por eso el negocio aprueba contra él y no contra un documento.",
        },
      ],
      steps: [
        {
          title: "Leer el dominio antes de dibujar",
          body: `Antes de que exista una pantalla, mapeo cómo funciona la cosa de verdad. Para el flujo de inspección de ${company} fueron más de 45 estados y 15 roles. Los estados eran el producto; la interfaz era la parte fácil.`,
        },
        {
          title: "Construir el lenguaje, no las pantallas",
          body: "La falla típica son ocho módulos con ocho dialectos. Por eso construyo primero el sistema y hago que todos lo respeten, yo incluido. Ningún componente a la medida: si al sistema le falta algo, se extiende el sistema.",
        },
        {
          title: "El prototipo es la especificación",
          body: "Lo que el negocio firma es un prototipo que funciona, con roles y estados reales, recorrido una historia a la vez. Los desacuerdos salen cuando todavía son baratos, e ingeniería recibe algo ya resuelto.",
        },
        {
          title: "Lanzar, y después escuchar",
          body: "El uso diario muestra lo que ninguna especificación habría mostrado. olbo me lo enseñó en una semana: un error de zona horaria que dañaba el color de noche, recibos que me negué a volver a digitar. Cada cosa se volvió una decisión, una prueba y un salto de versión.",
        },
      ],
    };
  }

  return {
    expertise: [
      {
        title: "Product direction",
        body: `I decide what a product should be and then stay accountable for it shipping. At ${company} that means eight business modules, the states and roles underneath them, and a review where the built version has to match the demo.`,
      },
      {
        title: "Design systems",
        body: `Tokens, components, governance and the boring documentation that makes good design repeatable. I have built one for a bank and maintained one used by ${scale} across ${countries} countries.`,
      },
      {
        title: "Design engineering with AI",
        body: "I prototype in code, with Claude Code, Cursor and Gemini carrying the repetitive weight. The output is a running product, not a mockup, which is why business signs off against it instead of against a document.",
      },
    ],
    steps: [
      {
        title: "Read the domain before drawing",
        // 45+ states / 15 roles are on Naowee's verified figure set (cv.ts).
        body: `Before a screen exists I map how the thing actually works. For ${company}'s inspection flow that was 45+ states and 15 roles. The states were the product; the interface was the easy part.`,
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
    ],
  };
}

/**
 * Rules instead of cards: a hairline between cells, on the axis the grid
 * actually splits at each breakpoint. Stacked below md, two columns at md,
 * one row at lg.
 *
 * Each range is scoped to itself with `md:max-lg:`, and nothing undoes
 * anything. The previous version layered lg rules over md ones and cancelled
 * the leftovers with `pl-0` / `pr-0` — but an arbitrary variant carries a
 * pseudo-class of specificity, so `lg:[&:nth-child(2n)]:pl-0` and
 * `lg:[&:not(:first-child)]:pl-12` tie at (0,2,0) and source order decides.
 * The reset won: column two shipped with a rule flush against its text and
 * column three with 48px of trailing air it had no use for.
 *
 * The air around a rule is 48px. At 32, beside a 34ch measure, a rule reads as
 * a border drawn around the paragraph rather than a division between two.
 */
const CELL_3 = [
  // Stacked: a rule above every cell but the first.
  "border-[var(--line)] border-t pt-6 first:border-t-0 first:pt-0",
  // Two columns: no rule above the first row, one rule down the middle.
  "md:max-lg:[&:nth-child(-n+2)]:border-t-0 md:max-lg:[&:nth-child(-n+2)]:pt-0",
  "md:max-lg:[&:nth-child(2n)]:border-l md:max-lg:[&:nth-child(2n)]:pl-12",
  "md:max-lg:[&:nth-child(2n+1)]:pr-12",
  // One row: no rule above anything, a rule before every cell but the first.
  "lg:border-t-0 lg:pt-0",
  "lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-12",
  "lg:[&:not(:last-child)]:pr-12",
].join(" ");

export default function Craft({ locale }: { locale: Locale }) {
  const t = getDict(locale).craft;
  const panel = getSections(locale)[2];
  const { expertise: EXPERTISE, steps: STEPS } = craftCopy(locale);
  return (
    <section
      id={panel.id}
      aria-labelledby="craft-title"
      className="mx-auto flex w-full max-w-[1400px] shrink-0 flex-col gap-14 px-6 py-16 md:px-12 lg:min-h-full lg:justify-center lg:py-20"
    >
      <header className="flex flex-col gap-4">
        <p className="kicker">
          {panel.num} — {t.kicker}
        </p>
        <h2
          id="craft-title"
          className="font-display text-[length:var(--step-title)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--ink)]"
        >
          {panel.title}
        </h2>
      </header>

      <div className="flex flex-col gap-6">
        <p className="kicker text-[var(--ink-dim)]">{t.expertise}</p>
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
        <p className="kicker text-[var(--ink-dim)]">{t.howIWork}</p>
        <CraftTimeline steps={STEPS} />
      </div>
    </section>
  );
}

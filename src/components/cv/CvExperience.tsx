import Link from "next/link";
import type { ReactNode } from "react";
import { experiences, type Experience } from "@/data/cv";
import { formatLocation, formatPeriod } from "@/lib/career";

/**
 * `**bold**` → `<strong>`. A server-side twin of the case template's helper:
 * that one lives in a `"use client"` module and importing it here would drag
 * the whole CV across the client boundary for a string split.
 */
function renderBold(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-[var(--ink)]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

const MODE_LABEL = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" } as const;

function metaLine(e: Experience): string {
  return [formatLocation(e), MODE_LABEL[e.location.mode]].filter(Boolean).join(" · ");
}

/** Entries older than Globant lose their summary first when print runs long. */
const OLD_ERA_IDS = new Set(["qrvey", "ideaware"]);

function Entry({ e }: { e: Experience }) {
  const title = e.client ? `${e.company.name} · ${e.client}` : e.company.name;

  return (
    <li
      className={`cv-entry hairline-b grid gap-x-8 gap-y-3 py-7 md:grid-cols-[180px_minmax(0,1fr)] ${
        OLD_ERA_IDS.has(e.id) ? "cv-entry--old" : ""
      }`}
    >
      <p className="cv-meta font-mono text-[11px] leading-[1.6] tracking-[0.04em] text-[var(--ink-muted)] tabular-nums md:whitespace-nowrap">
        {formatPeriod(e)}
      </p>

      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="cv-company font-display text-[length:var(--step-lead)] font-semibold leading-[1.2] tracking-[-0.015em] text-[var(--ink)]">
          {title}
        </h3>

        <p className="cv-role-line flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="cv-role text-[length:var(--step-body)] font-medium text-[var(--ink)]">
            {e.role}
          </span>
          <span className="cv-meta font-mono text-[11px] tracking-[0.04em] text-[var(--ink-dim)]">
            {metaLine(e)}
          </span>
        </p>

        <p className="cv-summary max-w-[68ch] text-[length:var(--step-body)] leading-[1.6] text-pretty text-[var(--ink-muted)]">
          {e.summary}
        </p>

        {e.impact && (
          <ul className="cv-bullets mt-1 flex list-none flex-col gap-2">
            {e.impact.map((line) => (
              <li key={line} className="flex gap-3 text-[length:var(--step-body)] leading-[1.55] text-[var(--ink-muted)]">
                <span
                  aria-hidden="true"
                  className="mt-[0.62em] h-px w-2 shrink-0 bg-[var(--line-strong)]"
                />
                <span className="min-w-0 text-pretty">{renderBold(line)}</span>
              </li>
            ))}
          </ul>
        )}

        {e.caseSlug && (
          <Link
            href={`/work/${e.caseSlug}`}
            aria-label={`See the ${e.company.name} case study`}
            className="cv-case mt-1 w-fit font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--ink)] no-underline underline-offset-4 hover:underline"
          >
            See case →
          </Link>
        )}
      </div>
    </li>
  );
}

/** The compact `Earlier` row: period, company, role, one sentence, no bullets. */
function EarlierEntry({ e }: { e: Experience }) {
  return (
    <li className="cv-entry hairline-b grid gap-x-8 gap-y-1 py-5 md:grid-cols-[180px_minmax(0,1fr)]">
      <p className="cv-meta font-mono text-[11px] leading-[1.6] tracking-[0.04em] text-[var(--ink-muted)] tabular-nums md:whitespace-nowrap">
        {formatPeriod(e)}
      </p>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="flex flex-wrap items-baseline gap-x-3">
          <span className="cv-role text-[length:var(--step-body)] font-semibold text-[var(--ink)]">
            {e.company.name}
          </span>
          <span className="text-[length:var(--step-body)] text-[var(--ink-muted)]">{e.role}</span>
        </p>
        <p className="cv-summary max-w-[68ch] text-[length:var(--step-small)] leading-[1.55] text-pretty text-[var(--ink-dim)]">
          {e.summary}
        </p>
      </div>
    </li>
  );
}

export default function CvExperience() {
  const core = experiences.filter((e) => e.era !== "earlier");
  const earlier = experiences.filter((e) => e.era === "earlier");

  return (
    <section aria-labelledby="cv-experience">
      <h2 id="cv-experience" className="cv-h2">
        Experience
      </h2>
      <ol className="flex list-none flex-col">
        {core.map((e) => (
          <Entry key={e.id} e={e} />
        ))}
      </ol>

      <h2 id="cv-earlier" className="cv-h2 mt-12">
        Earlier
      </h2>
      <ol className="flex list-none flex-col">
        {earlier.map((e) => (
          <EarlierEntry key={e.id} e={e} />
        ))}
      </ol>
    </section>
  );
}

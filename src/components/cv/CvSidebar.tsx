import { certifications, education, languages } from "@/data/cv";
import { testimonials } from "@/data/testimonials";
import { formatPoint } from "@/lib/career";

function Block({
  id,
  title,
  className,
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={`cv-block break-inside-avoid ${className ?? ""}`}>
      <h2 id={id} className="cv-h2">
        {title}
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

/**
 * Education, certifications, languages and references. A real `<aside>` on
 * desktop; below `lg` it drops under the skills and lays its four blocks out
 * two-up so the column of air on the right does not become a column of nothing.
 */
export default function CvSidebar() {
  return (
    <aside
      aria-label="Education, certifications and references"
      className="cv-sidebar mt-14 grid grid-cols-1 content-start gap-x-10 gap-y-12 self-start sm:grid-cols-2 lg:mt-0 lg:grid-cols-1"
    >
      <Block id="cv-education" title="Education">
        {education.map((e) => (
          <div key={e.id} className="cv-edu flex flex-col gap-0.5">
            <p className="cv-meta font-mono text-[11px] tracking-[0.04em] text-[var(--ink-dim)] tabular-nums">
              {formatPoint(e.start)} — {formatPoint(e.end)}
            </p>
            <p className="text-[length:var(--step-small)] font-medium leading-[1.4] text-[var(--ink)]">
              {e.program}
            </p>
            <p className="text-[length:var(--step-small)] leading-[1.45] text-[var(--ink-muted)]">
              {e.institution}
            </p>
          </div>
        ))}
      </Block>

      <Block id="cv-certifications" title="Certifications">
        {certifications.map((c) => (
          <div key={c.id} className="cv-cert flex flex-col gap-0.5">
            <p className="cv-meta font-mono text-[11px] tracking-[0.04em] text-[var(--ink-dim)] tabular-nums">
              {c.year}
            </p>
            <p className="text-[length:var(--step-small)] font-medium leading-[1.4] text-[var(--ink)]">
              {c.name}
            </p>
            <p className="text-[length:var(--step-small)] leading-[1.45] text-[var(--ink-muted)]">
              {c.issuer}
            </p>
          </div>
        ))}
      </Block>

      <Block id="cv-languages" title="Languages">
        <ul className="flex list-none flex-col gap-2">
          {languages.map((l) => (
            <li
              key={l.name}
              className="flex flex-wrap items-baseline gap-x-2 text-[length:var(--step-small)] leading-[1.45]"
            >
              <span className="font-medium text-[var(--ink)]">{l.name}</span>
              <span aria-hidden="true" className="text-[var(--ink-dim)]">
                ·
              </span>
              <span className="text-[var(--ink-muted)]">{l.level}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="cv-references" title="References" className="cv-block--refs">
        {testimonials.map((t) => (
          <figure key={t.id} className="cv-ref flex flex-col gap-2">
            <blockquote className="text-[length:var(--step-small)] leading-[1.55] text-pretty text-[var(--ink-muted)]">
              {t.quote}
            </blockquote>
            <figcaption className="cv-meta font-mono text-[11px] leading-[1.6] tracking-[0.04em] text-[var(--ink-dim)]">
              <span className="text-[var(--ink)]">{t.author.name}</span>
              {" — "}
              {t.author.role}, {t.author.company}
            </figcaption>
          </figure>
        ))}
      </Block>
    </aside>
  );
}

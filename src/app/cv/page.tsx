"use client";

import { motion } from "framer-motion";
import { experiences, education, skills, tools, languages } from "@/data/cv";

const ease = [0.16, 1, 0.3, 1] as const;

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

// Helper to render bold markdown-style text **text**
function renderImpact(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="text-[var(--color-ink)] font-medium">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export default function CVPage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "var(--color-bg-deep)",
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(139, 127, 255, 0.06), transparent 50%), radial-gradient(circle at 80% 90%, rgba(255, 139, 94, 0.04), transparent 50%), radial-gradient(circle at 50% 50%, rgba(94, 184, 255, 0.03), transparent 60%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="grain-overlay" />

      {/* Top bar */}
      <div className="sticky top-0 z-[100] backdrop-blur-md bg-[rgba(5,4,7,0.7)] border-b border-[var(--color-line)] px-8 py-4 flex justify-between items-center font-mono text-[11px] tracking-[0.2em] uppercase print:hidden">
        <div className="text-[var(--color-ink-muted)]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent-warm)] shadow-[0_0_8px_var(--color-accent-warm)] mr-2 align-middle animate-pulse-dot" />
          Doug Vargas · CV / 2026
        </div>
        <div className="flex gap-6 items-center">
          <a
            href="/"
            className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)] transition-colors"
            data-cursor="hover"
          >
            ← Back to site
          </a>
          <a
            href="mailto:dougvargas72@gmail.com"
            className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)] transition-colors hidden md:inline"
            data-cursor="hover"
          >
            Contact
          </a>
          <button
            onClick={() => window.print()}
            data-cursor="hover"
            className="border border-[var(--color-line)] px-4 py-2 rounded-full bg-transparent text-[var(--color-ink)] font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-[var(--color-bg-deep)] cursor-pointer"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-12 py-20 pb-32 relative z-[2] print:px-6 print:py-6">
        {/* Header */}
        <FadeIn>
          <header className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-end">
            <div>
              <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] mb-8">
                <span className="inline-block w-6 h-px bg-[var(--color-accent)] mr-3 align-middle" />
                Curriculum Vitae · Updated May 2026
              </div>
              <h1 className="font-display text-[clamp(56px,9vw,120px)] leading-[0.9] tracking-[-0.04em] mb-6">
                Doug
                <br />
                <span className="italic text-[var(--color-accent)]">Vargas</span>
              </h1>
              <p className="text-lg text-[var(--color-ink-muted)] leading-[1.5] max-w-[480px]">
                Senior <strong className="text-[var(--color-ink)] font-medium">Product Designer</strong> &{" "}
                <strong className="text-[var(--color-ink)] font-medium">Design Systems</strong> Architect.
                <br />
                Translating ambiguity into interfaces — now bridging classical product craft with AI-native workflows.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <InfoCard
                label="/ Contact"
                rows={[
                  { label: "Email", value: "dougvargas72@gmail.com", href: "mailto:dougvargas72@gmail.com" },
                  { label: "Phone", value: "+57 300.351.8299", href: "tel:+573003518299" },
                  { label: "Location", value: "Barranquilla, CO" },
                ]}
              />
              <InfoCard
                label="/ Online"
                rows={[
                  { label: "Portfolio", value: "douguizard.com", href: "https://douguizard.com" },
                  { label: "LinkedIn", value: "/dougvargasco", href: "https://linkedin.com/in/dougvargasco" },
                  { label: "Behance", value: "/dougvargas", href: "https://behance.net/dougvargas" },
                ]}
              />
            </div>
          </header>
        </FadeIn>

        {/* Summary */}
        <FadeIn>
          <Section num="/ 00 — Profile" title="The" titleAccent="summary">
            <p className="font-display text-[clamp(22px,2.4vw,32px)] leading-[1.35] tracking-[-0.01em] max-w-[880px]">
              Senior Product Designer with{" "}
              <span className="italic text-[var(--color-accent)]">12+ years</span> shipping digital products for banks,
              marketplaces and consumer apps across LATAM and the US. Currently{" "}
              <span className="italic text-[var(--color-accent-warm)]">Tech Lead</span> at Andes — Mercadolibre&apos;s
              design system. Specialized in{" "}
              <span className="italic text-[var(--color-accent)]">design systems at scale</span>,{" "}
              <span className="italic text-[var(--color-accent-cool)]">AI-driven interfaces</span>, and turning fuzzy
              product strategy into production-ready craft. I treat design as a system, not a screen.
            </p>
          </Section>
        </FadeIn>

        {/* Experience */}
        <Section num="/ 01 — Experience" title="Selected" titleAccent="work">
          {experiences.map((exp, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 py-8 border-b border-[var(--color-line)] transition-[padding] duration-500 hover:md:pl-4 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] pt-1.5">
                  <span className={exp.isCurrent ? "text-[var(--color-accent)] font-medium" : ""}>
                    {exp.period}
                  </span>
                </div>
                <div className="max-w-[720px]">
                  <h3 className="font-display text-3xl tracking-tight leading-[1.1] mb-1">
                    <span className="italic text-[var(--color-accent)]">{exp.company.accent}</span>{" "}
                    {exp.company.plain}
                  </h3>
                  <p className="text-[13px] text-[var(--color-ink-muted)] font-mono tracking-[0.1em] uppercase mb-4">
                    {exp.role}
                  </p>
                  <p className="text-[15px] leading-[1.65] text-[var(--color-ink)] mb-4">
                    {exp.description}
                  </p>
                  {exp.impact && (
                    <ul className="mt-4 list-none">
                      {exp.impact.map((item, j) => (
                        <li
                          key={j}
                          className="pl-5 relative mb-2 text-sm text-[var(--color-ink-muted)] leading-[1.55]"
                        >
                          <span className="absolute left-0 text-[var(--color-accent)] font-medium">
                            →
                          </span>
                          {renderImpact(item)}
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.link && (
                    <a
                      href={exp.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="inline-flex items-center gap-2 text-[var(--color-accent)] no-underline font-mono text-[11px] tracking-[0.15em] uppercase mt-4 hover:gap-3.5 transition-[gap] duration-300"
                    >
                      {exp.link.label} →
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </Section>

        {/* Capabilities */}
        <Section num="/ 02 — Capabilities" title="What I" titleAccent="do">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SkillBlock title="Product Design" items={skills.productDesign} />
              <SkillBlock title="Design Systems" items={skills.designSystems} />
              <SkillBlock title="AI × Design" items={skills.aiDesign} />
              <SkillBlock title="Platforms" items={skills.platforms} />
            </div>
          </FadeIn>
        </Section>

        {/* Tools */}
        <Section num="/ 03 — Toolkit" title="Daily" titleAccent="tools">
          <FadeIn>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-ink)] px-4.5 py-3 border border-[var(--color-line)] rounded bg-[rgba(10,8,20,0.3)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:-translate-y-0.5 transition-all duration-300"
                  style={{ padding: "12px 18px" }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </FadeIn>
        </Section>

        {/* Education */}
        <Section num="/ 04 — Education" title="Studies &" titleAccent="certs">
          {education.map((edu, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-8 py-6 border-b border-[var(--color-line)] items-baseline">
                <div className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-ink-muted)]">
                  {edu.year}
                </div>
                <div className="font-display text-[22px] tracking-tight">
                  {edu.program.order === "before" ? (
                    <>
                      <span className="italic text-[var(--color-accent)]">{edu.program.accent}</span>{" "}
                      {edu.program.plain}
                    </>
                  ) : (
                    <>
                      {edu.program.plain}{" "}
                      <span className="italic text-[var(--color-accent)]">{edu.program.accent}</span>
                    </>
                  )}
                </div>
                <div className="text-[13px] text-[var(--color-ink-muted)] md:text-right font-mono tracking-[0.1em] uppercase">
                  {edu.institution}
                </div>
              </div>
            </FadeIn>
          ))}
        </Section>

        {/* Languages */}
        <Section num="/ 05 — Languages" title="How I" titleAccent="talk">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="border border-[var(--color-line)] p-6 bg-[rgba(10,8,20,0.4)] rounded"
                >
                  <div className="font-display text-[28px] tracking-tight mb-2">
                    <span className="italic text-[var(--color-accent)]">{lang.name}</span>
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-ink-muted)] uppercase mb-4">
                    {lang.level}
                  </div>
                  <div className="h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--color-accent), var(--color-accent-cool))",
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </Section>

        {/* Footer */}
        <div className="mt-32 pt-12 border-t border-[var(--color-line)] flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-dim)]">
          <span>© 2026 Doug Vargas</span>
          <span>
            Last updated ·{" "}
            <a
              href="mailto:dougvargas72@gmail.com"
              className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)]"
              data-cursor="hover"
            >
              Get in touch
            </a>
          </span>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; cursor: auto !important; }
          .grain-overlay { display: none; }
          a { color: #5b4eff !important; }
        }
      `}</style>
    </div>
  );
}

// ===== Helper components =====

function Section({
  num,
  title,
  titleAccent,
  children,
}: {
  num: string;
  title: string;
  titleAccent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-24 relative">
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-12 items-baseline pb-6 border-b border-[var(--color-line)]">
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)]">
            {num}
          </div>
          <h2 className="font-display text-[clamp(36px,5vw,56px)] tracking-[-0.03em] leading-none">
            {title} <span className="italic text-[var(--color-accent)]">{titleAccent}</span>
          </h2>
        </div>
      </FadeIn>
      {children}
    </section>
  );
}

function InfoCard({
  label,
  rows,
}: {
  label: string;
  rows: { label: string; value: string; href?: string }[];
}) {
  return (
    <div className="border border-[var(--color-line)] p-6 bg-[rgba(10,8,20,0.4)] backdrop-blur-sm rounded">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-ink-dim)] mb-3">
        {label}
      </div>
      {rows.map((row, i) => (
        <div key={i} className="flex justify-between py-1.5 text-[13px]">
          <span className="text-[var(--color-ink-muted)]">{row.label}</span>
          {row.href ? (
            <a
              href={row.href}
              target={row.href.startsWith("http") ? "_blank" : undefined}
              rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
              data-cursor="hover"
              className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)] transition-colors"
            >
              {row.value}
            </a>
          ) : (
            <span className="text-[var(--color-ink)]">{row.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillBlock({
  title,
  items,
}: {
  title: string;
  items: { label: string; primary?: boolean; warm?: boolean }[];
}) {
  return (
    <div>
      <h4 className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--color-ink-muted)] mb-4 font-normal">
        <span className="inline-block w-3 h-px bg-[var(--color-accent)] mr-2.5 align-middle" />
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.label}
            className={[
              "text-[13px] border rounded-full transition-all duration-300 hover:border-[var(--color-ink)] hover:-translate-y-0.5",
              "px-3.5 py-2",
              item.primary
                ? "border-[rgba(139,127,255,0.3)] bg-[rgba(139,127,255,0.06)] text-[var(--color-accent)]"
                : item.warm
                  ? "border-[rgba(255,139,94,0.3)] bg-[rgba(255,139,94,0.06)] text-[var(--color-accent-warm)]"
                  : "border-[var(--color-line)] text-[var(--color-ink)]",
            ].join(" ")}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

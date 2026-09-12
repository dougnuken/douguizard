import { skills, tools } from "@/data/cv";

/**
 * A comma-joined mono line per group, not chips: thirty pills is visual noise
 * on screen and three extra centimetres on the sheet. `primary` items carry
 * full ink, the rest sit at `--ink-muted`, so the eye still gets a hierarchy.
 */
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="cv-group mb-6 break-inside-avoid">
      <p className="kicker mb-1.5">{label}</p>
      <p className="font-mono text-[12.5px] leading-[1.75] text-[var(--ink-muted)]">{children}</p>
    </div>
  );
}

function join(items: string[]) {
  return items.join(", ");
}

export default function CvSkills() {
  return (
    <div className="mt-14 flex flex-col gap-12">
      <section aria-labelledby="cv-skills">
        <h2 id="cv-skills" className="cv-h2">
          Skills
        </h2>
        <div className="cv-columns">
          {skills.map((group) => (
            <Group key={group.id} label={group.label}>
              {group.items.map((item, i) => (
                <span key={item.label}>
                  {i > 0 && ", "}
                  <span className={item.primary ? "text-[var(--ink)]" : undefined}>
                    {item.label}
                  </span>
                </span>
              ))}
            </Group>
          ))}
        </div>
      </section>

      <section aria-labelledby="cv-tools">
        <h2 id="cv-tools" className="cv-h2">
          Tools
        </h2>
        <div className="cv-columns">
          {tools.map((group) => (
            <Group key={group.id} label={group.label}>
              {join(group.items)}
            </Group>
          ))}
        </div>
      </section>
    </div>
  );
}

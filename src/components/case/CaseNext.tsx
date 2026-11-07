"use client";

import Link from "next/link";
import { getCaseMeta, type CaseStudy } from "@/data/work";
import { localePath } from "@/i18n/config";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { Band, FadeIn, SlashLabel, type BandProps } from "./primitives";

/**
 * The way onward.
 *
 * Hover changes weight and underline, never hue: in a two-colour system a
 * colour shift has nowhere to go, and the type is large enough that a change of
 * weight reads from across the room.
 */
export default function CaseNext({
  next,
  tone,
  enHoja = false,
}: {
  next: CaseStudy;
  tone?: BandProps["tone"];
  /**
   * F6 (07 §1.2): en la hoja, `<Link replace>` cambia de caso sin apilar
   * historial (Cerrar vuelve al tablero); en la página completa, `<a>`: la
   * interceptación del nivel raíz abriría una hoja encima de la página.
   */
  enHoja?: boolean;
}) {
  const t = useDict().case;
  const locale = useLocale();
  // The line over the title says who the work was for — unless that IS the
  // title ("BANCO DE OCCIDENTE" over "Banco de Occidente"), where it says
  // what kind of work it was instead, the same rule the hero's kicker keeps.
  const client = getCaseMeta(next.slug, locale).client;
  const over = client.toLowerCase() === next.project.toLowerCase() ? next.category : client;
  const cut = next.project.lastIndexOf(" ");
  const head = next.project.slice(0, cut + 1);
  const tail = next.project.slice(cut + 1);
  return (
    <Band tone={tone} rule="t">
      <FadeIn>
        <SlashLabel className="mb-8 text-[11px] text-[var(--ink-muted)]">{t.next}</SlashLabel>
      </FadeIn>

      <Destino
        href={localePath(locale, `/work/${next.slug}`)}
        enHoja={enHoja}
        className="group block text-inherit no-underline"
      >
        <FadeIn>
          <div
            className="mb-6 font-mono text-sm uppercase tracking-[0.3em] text-[var(--ink-muted)] transition-transform duration-500 group-hover:translate-x-2"
            style={{ transitionTimingFunction: "var(--ease-out)" }}
          >
            {over}
          </div>

          <h2
            className="mb-8 font-display text-[clamp(44px,11vw,160px)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--ink)] transition-[font-weight] duration-300 group-hover:font-extrabold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[12px]"
          >
            {/* The arrow is bound to the last word, so it never wraps onto a line
                of its own; it is decoration, so the heading reads as the name. */}
            {head}
            <span className="whitespace-nowrap">
              {tail}
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 group-hover:translate-x-4"
                style={{ transitionTimingFunction: "var(--ease-out)" }}
              >
                {" "}
                →
              </span>
            </span>
          </h2>

          <p className="max-w-[720px] text-lg leading-[1.5] text-[var(--ink-muted)]">
            {next.tagline}
          </p>
        </FadeIn>
      </Destino>
    </Band>
  );
}

function Destino({
  href,
  enHoja,
  className,
  children,
}: {
  href: string;
  enHoja: boolean;
  className: string;
  children: React.ReactNode;
}) {
  if (enHoja) {
    return (
      <Link href={href} replace scroll={false} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

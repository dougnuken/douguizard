"use client";

import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import RevealText from "@/components/text/RevealText";

/**
 * Container-level fade + rise, on scroll into view. For eyebrows and groups.
 * One implementation of the reveal for the whole template: `RevealText` owns
 * the observer and the transition, this only names the container case.
 */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <RevealText as="div" variant="fade" delay={delay} duration={0.9} className={className}>
      {children}
    </RevealText>
  );
}

/** `**bold**` → `<strong>`. The only markup the case copy carries. */
export function renderBold(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * El `h2` de cada bloque del caso (Urbanist 30), sin revelado propio: el bloque
 * entero entra con su `FadeIn` cuando lo pide, y en la hoja nada se revela en la
 * primera pantalla (06-CRITICA-F6 P1-4).
 */
export function EyebrowHeading({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
  sticky?: boolean;
}) {
  return (
    <div className="bloque-cab">
      <h2 id={id} className="t-bloque">
        {children}
      </h2>
    </div>
  );
}

export interface BandProps {
  children: ReactNode;
  /** Se conserva por compatibilidad: en B los bloques van sobre el vacío, sin bandas. */
  tone?: "paper" | "raised";
  rule?: "t" | "b" | "y" | "none";
  wide?: boolean;
  className?: string;
  /** Ancla del índice lateral y de «Secciones». */
  id?: string;
  labelledBy?: string;
  label?: string;
}

/**
 * Un bloque del caso (02 §5.3). En F7 deja de ser una banda a todo el ancho con
 * fondo alterno: la columna la pone `.caso-secciones` y el ritmo, `.bloque`
 * (128 entre bloques; 96 en la hoja; 64 en móvil).
 */
export function Band({ children, className, id, labelledBy, label }: BandProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={twMerge("bloque", className?.split(" ").filter((c) => !/^(md:)?py-/.test(c)).join(" "))}
    >
      {children}
    </section>
  );
}

/**
 * La cabecera de un bloque del cuerpo (F7 P1-3, `caso.html`): con titular, el
 * rótulo va de ceja y el titular es el `h2`; sin él, el rótulo solo es el
 * `h2`, como antes. No se inventa copy: el titular sale de `heads` en `work.ts`.
 */
export function CabBloque({ id, rotulo, titular }: { id?: string; rotulo: string; titular?: string }) {
  return (
    <div className="bloque-cab" data-titular={titular ? "" : undefined}>
      {titular && <p className="ceja">{rotulo}</p>}
      <h2 id={id} className="t-bloque">
        {titular ?? rotulo}
      </h2>
    </div>
  );
}

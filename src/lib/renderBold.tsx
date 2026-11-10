import type { ReactNode } from "react";

/**
 * `**bold**` → `<strong>`. The only markup the case and CV copy carries.
 *
 * Sin `"use client"`: lo usan a la vez el servidor (CV) y la plantilla del caso,
 * y una sola definición evita arrastrar el módulo de cliente a la página del CV.
 * `strongClassName` va en cada `<strong>` (el CV lo pinta más fuerte que el texto).
 */
export function renderBold(text: string, strongClassName?: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className={strongClassName}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

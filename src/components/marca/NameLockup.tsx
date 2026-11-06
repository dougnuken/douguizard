import "./marca.css";
import { lockup } from "@/app/fonts/lockup";
import { decisiones, type ConstruccionLockup } from "@/data/decisiones";
import CorteLaser from "./CorteLaser";

export type EscalaLockup = "xl" | "losa" | "movil";

/**
 * **Único lugar** donde se compone «Doug / Vargas» (07 §1.3).
 *
 * - `escala`: `xl` (acto 1, 128 px; ×0,8 con alto ≤ 800), `movil` (66 px) o
 *   `losa` (K1, 30 px). Los px salen de la opción de `app/fonts/lockup.ts`.
 * - La construcción sale de `decisiones.nombreLockup`. Con `corte` (opción 4),
 *   «Vargas» lleva dos mitades (la de abajo, copia `aria-hidden`) y una isla que
 *   mide el corte; **solo en `xl`**: en `losa` y `movil` el nombre va entero.
 * - Contrato del FLIP: se mide el elemento raíz `[data-lockup]` en el DOM (alto y
 *   ancho reales), nunca constantes.
 * - `decorativo`: el XL del acto 1 es `aria-hidden` porque el nombre real ya está
 *   en el `h1` / `sr-only`. En K1 se lee.
 */
export default function NameLockup({
  escala,
  decorativo = false,
  construccion = decisiones.nombreLockup.construccion,
  className,
}: {
  escala: EscalaLockup;
  decorativo?: boolean;
  /** Solo para el lab y las pruebas; en el sitio manda `decisiones`. */
  construccion?: ConstruccionLockup;
  className?: string;
}) {
  const conCorte = construccion === "corte" && escala === "xl";
  const estilo = {
    "--lockup-xl": `${lockup.tamanos.xl}px`,
    "--lockup-movil": `${lockup.tamanos.movil}px`,
    "--lockup-losa": `${lockup.tamanos.losa}px`,
    fontWeight: lockup.peso,
    letterSpacing: lockup.tracking,
    lineHeight: lockup.interlineado,
    fontVariationSettings: lockup.variaciones,
  } as React.CSSProperties;

  return (
    <span
      data-lockup=""
      data-escala={escala}
      data-construccion={construccion}
      className={["lockup", lockup.fuente.variable, className].filter(Boolean).join(" ")}
      style={estilo}
      aria-hidden={decorativo || undefined}
    >
      <span className="lockup-linea">Doug</span>{" "}
      <span className="lockup-linea lockup-vargas">
        {conCorte ? (
          <>
            <span className="lockup-mitad lockup-sup">Vargas</span>
            <span className="lockup-mitad lockup-inf" aria-hidden="true">
              Vargas
            </span>
            <CorteLaser />
          </>
        ) : (
          "Vargas"
        )}
      </span>
    </span>
  );
}

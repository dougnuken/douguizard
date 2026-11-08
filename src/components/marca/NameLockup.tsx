import "./marca.css";
import { lockup } from "@/app/fonts/lockup";
import { decisiones, type ConstruccionLockup } from "@/data/decisiones";
import { site } from "@/data/site";
import NameLockupCorte from "./NameLockupCorte";

export type EscalaLockup = "xl" | "losa" | "movil";

/**
 * **Único lugar** donde se compone «Doug / Vargas» (07 §1.3 y F1).
 *
 * - `escala`: `xl` (portada de `/about` a `--t-120`, ×0,8 con alto ≤ 800; el acto
 *   1 del home lo sube a 128 px con `--lockup-xl`), `losa` (K1) o `movil`.
 * - `corte`: solo con `xl` y la construcción `corte` de `decisiones`. El HTML
 *   sale **cerrado** (`--desp: 0`, sin `clip-path`, copia oculta): sin JS, con
 *   movimiento reducido o a < 1024 px el nombre es una palabra entera. La isla
 *   `NameLockupCorte` mide el corte, hace la entrada una sola vez y deja
 *   `--desp` al dueño del scroll (`fijarCorte` de `lib/corte.ts`).
 * - Accesibilidad: el nombre se lee una vez, del `sr-only`; las dos líneas
 *   visibles (y la copia) son `aria-hidden`. `decorativo` oculta todo (acto 1
 *   del home, donde el `h1` es K2).
 * - Contrato del FLIP: se mide `[data-lockup]` en el DOM, nunca constantes.
 */
export default function NameLockup({
  escala,
  corte = false,
  as: Tag = "div",
  decorativo = false,
  laser,
  entrada = true,
  construccion = decisiones.nombreLockup.construccion,
  className,
  style,
}: {
  escala: EscalaLockup;
  corte?: boolean;
  as?: "div" | "h1" | "h2" | "p";
  decorativo?: boolean;
  /** Selector del láser sobre el que se coloca el corte (lo da el dueño de la escena). */
  laser?: string;
  /** La entrada única (880 ms + 520 ms). El lab la usa; los dueños de escena deciden. */
  entrada?: boolean;
  /** Solo para el lab y las pruebas; en el sitio manda `decisiones`. */
  construccion?: ConstruccionLockup;
  className?: string;
  style?: React.CSSProperties;
}) {
  const conCorte = corte && escala === "xl" && construccion === "corte";
  const [nombre, apellido] = site.name.split(" ");
  const estilo = {
    "--lockup-xl": lockup.tamanos.xl,
    "--lockup-movil": lockup.tamanos.movil,
    "--lockup-losa": lockup.tamanos.losa,
    fontWeight: lockup.peso,
    letterSpacing: lockup.tracking,
    lineHeight: lockup.interlineado,
    fontVariationSettings: lockup.variaciones,
    ...style,
  } as React.CSSProperties;

  return (
    <Tag
      data-lockup=""
      data-escala={escala}
      data-construccion={construccion}
      data-corte={conCorte ? "cerrado" : undefined}
      data-espera-laser={conCorte && laser ? "" : undefined}
      className={["lockup", lockup.fuente.variable, className].filter(Boolean).join(" ")}
      style={estilo}
      aria-hidden={decorativo || undefined}
    >
      <span className="sr-only">{site.name}</span>
      <span className="linea l1" aria-hidden="true">
        {nombre}
      </span>
      <span className="linea l2" aria-hidden="true">
        {conCorte ? (
          <>
            <span className="m sup">{apellido}</span>
            <span className="m inf">{apellido}</span>
            <span className="hilo" />
            <NameLockupCorte laser={laser} entrada={entrada} />
          </>
        ) : (
          apellido
        )}
      </span>
    </Tag>
  );
}

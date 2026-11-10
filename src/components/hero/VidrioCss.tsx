import "./vidrio.css";

/**
 * La zona nítida del vidrio en CSS (07 §1.3; pulido I). El póster ya trae el
 * vidrio horneado, así que aquí no se repiten franjas: es la **lente**. `LenteCss`
 * le pone la foto limpia (`<b>`) y la deja ver por un disco de borde suave
 * (`<i>`) que se mueve con `transform`: el vidrio se abre y aclara igual que en
 * WebGL, sin refracción. La usa el respaldo sin WebGL2 (o con el contexto
 * perdido) y, en móvil, el barrido automático antes de la primera interacción.
 * Con RM no se activa: queda el póster solo.
 * `className`: `vidrio-llena` (cubre la caja, K1) o `poster` (sigue a la foto, `/about`).
 */
export default function VidrioCss({ className = "vidrio-llena", pos = "50% 0" }: { className?: string; pos?: string }) {
  return (
    <div
      className={`vidrio-css ${className}`}
      style={{ "--v-pos": pos } as React.CSSProperties}
      aria-hidden="true"
      data-vidrio="css"
    >
      <i>
        <b />
      </i>
    </div>
  );
}

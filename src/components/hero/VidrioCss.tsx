import "./vidrio.css";

/**
 * Respaldo del vidrio sin WebGL (07 §1.3). El póster ya trae el vidrio
 * horneado (con la cara y el láser nítidos), así que este respaldo no repite
 * franjas encima: es la **lente** en CSS. Sin WebGL2 (o con el contexto
 * perdido), `LenteCss` le pone la foto limpia de fondo y la deja ver por una
 * máscara circular bajo el cursor (o el dedo): el vidrio se abre y aclara
 * igual que en WebGL, sin refracción. Con RM no se activa: queda el póster solo.
 * `className`: `vidrio-llena` (cubre la caja, K1) o `poster` (sigue a la foto, `/about`).
 */
export default function VidrioCss({ className = "vidrio-llena", pos = "50% 0" }: { className?: string; pos?: string }) {
  return (
    <div
      className={`vidrio-css ${className}`}
      style={{ "--v-pos": pos } as React.CSSProperties}
      aria-hidden="true"
      data-vidrio="css"
    />
  );
}

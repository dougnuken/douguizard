import "./sistema.css";

export type TonoEtiqueta = "neutra" | "azul" | "magenta" | "osc";

/**
 * Etiqueta tintada (texto de 14 px en el tono de su losa) o `chip` (pastilla de
 * 32 px, p. ej. el NDA de Andes). Los tonos están medidos sobre su superficie
 * (NOTAS §3): azul sobre el aro de K4, magenta sobre la base lavanda de K10.
 */
export default function Etiqueta({
  children,
  tono = "neutra",
  forma = "texto",
  className,
}: {
  children: React.ReactNode;
  tono?: TonoEtiqueta;
  forma?: "texto" | "chip" | "chip-losa";
  className?: string;
}) {
  const base =
    forma === "texto"
      ? ["etiqueta", tono !== "neutra" && `etiqueta--${tono}`]
      : ["chip", forma === "chip-losa" && "chip--losa"];
  return <span className={[...base, className].filter(Boolean).join(" ")}>{children}</span>;
}

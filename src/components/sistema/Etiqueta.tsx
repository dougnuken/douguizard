import "./sistema.css";

/**
 * Etiqueta tintada (texto de 14 px; cada losa le pone su tono: `.losa--azul .etiqueta`,
 * etc., medidos sobre su superficie, NOTAS §3) o `chip` (pastilla de 32 px, p. ej. el
 * NDA de Andes).
 */
export default function Etiqueta({
  children,
  forma = "texto",
  className,
}: {
  children: React.ReactNode;
  forma?: "texto" | "chip" | "chip-losa";
  className?: string;
}) {
  const base = forma === "texto" ? ["etiqueta"] : ["chip", forma === "chip-losa" && "chip--losa"];
  return <span className={[...base, className].filter(Boolean).join(" ")}>{children}</span>;
}

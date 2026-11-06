/** Lo que cada opción de `B-tipo` aporta a `NameLockup`, además de la fuente. */
export interface EstiloLockup {
  /** Resultado de `next/font` (su `variable` define `--font-nombre`). */
  fuente: { variable: string; style: { fontFamily: string } };
  peso: number;
  tracking: string;
  interlineado: number;
  /** `font-variation-settings` del nombre ("normal" si no aplica). */
  variaciones: string;
  /** Tamaño en px por escala: XL del acto 1, móvil, y la losa K1. */
  tamanos: { xl: number; movil: number; losa: number };
}

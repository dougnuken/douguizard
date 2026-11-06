/**
 * Decisiones de Doug que el rediseño B necesita, con el valor que se usa hoy.
 *
 * Cada una tiene su número en `docs/rediseno-2026/07-PLAN-IMPLEMENTACION.md` §4.
 * **Cambiar una decisión = cambiar una línea aquí.** Los tipos cierran las
 * opciones válidas y `__tests__/decisiones.test.ts` vigila que cada valor esté
 * dentro de su unión. Las que viven en otro dato (orden de casos en `home.ts`,
 * imagen del héroe en `hero.ts`, titular EN en el diccionario) solo se anotan.
 */

/** D1 · Qué ofrece el punto de disponible. Lo de hoy: consultoría puntual. */
export const DISPONIBILIDADES = ["consultoria", "roles", "ambas", "no-disponible"] as const;
export type Disponibilidad = (typeof DISPONIBILIDADES)[number];

/** D3 · `/about` y `/experience` como dos páginas o una sola. */
export const RUTAS_PERFIL = ["separadas", "unidas"] as const;
export type RutasPerfil = (typeof RUTAS_PERFIL)[number];

/** D4 · Dónde sobrevive el tema claro (B es solo oscuro). */
export const TEMAS_CLARO_EN = ["solo-cv", "todas", "ninguna"] as const;
export type TemaClaroEn = (typeof TEMAS_CLARO_EN)[number];

/**
 * D6 · Lockup del nombre. `fuente` dice qué opción de `B-tipo` carga
 * `src/app/fonts/lockup.ts`; `construccion` cómo se arma:
 * - `dos-lineas`: «Doug» / «Vargas» apilados (opciones 1, 2, 5, 6);
 * - `banda`: una sola línea, paralela al láser (opción 3);
 * - `corte`: «Vargas» partido por el láser (opción 4, elegida).
 */
export const FUENTES_LOCKUP = [
  "urbanist",
  "mona-sans",
  "instrument-serif-mona",
  "big-shoulders-stencil",
  "geologica",
  "doto",
  "anybody",
] as const;
export type FuenteLockup = (typeof FUENTES_LOCKUP)[number];
export const CONSTRUCCIONES_LOCKUP = ["dos-lineas", "banda", "corte"] as const;
export type ConstruccionLockup = (typeof CONSTRUCCIONES_LOCKUP)[number];

/** D9 · Qué PDF descarga el CTA del héroe en cada idioma. */
export const PDFS = ["con-foto", "sin-foto"] as const;
export type Pdf = (typeof PDFS)[number];

/** D11 · Colofón del pie (04 §4.4): A = con agentes de IA, B = «por Doug Vargas». */
export const COLOFONES = ["A", "B"] as const;
export type Colofon = (typeof COLOFONES)[number];

/** D13 · Qué nombre muestra K1: el nombre o el wordmark. */
export const NOMBRES_K1 = ["nombre", "wordmark"] as const;
export type NombreK1 = (typeof NOMBRES_K1)[number];

export interface Decisiones {
  disponibilidad: Disponibilidad;
  /** D2 · vive en `home.ts` (`ordenCasos`). */
  ordenCasos: "home.ordenCasos";
  rutasPerfil: RutasPerfil;
  temaClaroEn: TemaClaroEn;
  /** D5 · vive en el diccionario (`home.claim` desde F3). */
  titularEn: "diccionario";
  nombreLockup: { fuente: FuenteLockup; construccion: ConstruccionLockup };
  pdfPorIdioma: { es: Pdf; en: Pdf };
  colofon: Colofon;
  /** D12 */
  telefonoEnHome: boolean;
  nombreK1: NombreK1;
  /** D10 */
  citaFrancescaEnHome: boolean;
  /** D21 */
  hojaDesdeIndices: boolean;
  /** D20 · tamaño mínimo de Doto en px. */
  dotoMinimo: number;
  /** D22 · los casos enlazados desde `/cv` abren la página completa, no la hoja. */
  casosDesdeCv: "pagina" | "hoja";
}

export const decisiones: Decisiones = {
  disponibilidad: "consultoria",
  ordenCasos: "home.ordenCasos",
  rutasPerfil: "separadas",
  temaClaroEn: "solo-cv",
  titularEn: "diccionario",
  // Doug eligió la 4 «corte láser» (ESTADO.md). Si cambia, cambiar también lockup.ts.
  nombreLockup: { fuente: "geologica", construccion: "corte" },
  pdfPorIdioma: { es: "con-foto", en: "sin-foto" },
  colofon: "A",
  telefonoEnHome: false,
  nombreK1: "nombre",
  citaFrancescaEnHome: false,
  hojaDesdeIndices: true,
  dotoMinimo: 20,
  casosDesdeCv: "pagina",
};

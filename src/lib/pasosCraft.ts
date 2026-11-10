/**
 * Coreografía de «Cómo trabajo» (G4). Pura, para poder probarla sin navegador.
 *
 * Papeles (skill `choreograph`): el láser es el protagonista, una carga que
 * viaja de nodo en nodo; cada nodo se enciende al llegar (secundario, con un
 * pulso de halo); el texto del paso es el apoyo y se revela con `soft-blur-in`
 * de `animate-text` a escala de bloque (número → título → texto, 0/70/150 ms:
 * escalón decreciente, no de metrónomo). Las paradas son secuencia (causa →
 * efecto: la carga llega y el nodo se enciende); el texto de un paso se solapa
 * con el viaje al siguiente, así que se lee como una ola y no como una cola.
 *
 * Tramos `cubic-bezier(0.65, 0, 0.35, 1)` (acelera al salir de un nodo y frena
 * al llegar al siguiente); encendido y texto con `--curva-suave` de
 * transitions.dev. Total ≈ 1,95 s con 4 pasos y láser, ≈ 1,7 s sin él
 * (pulido H, P2-4: era ≈ 2,7 s y quien bajaba rápido veía columnas vacías).
 */

export type Eje = "x" | "y" | "ninguno";

export type Coreografia = {
  /** Retardo antes del primer nodo (ms). */
  inicio: number;
  /** Momento en que se enciende cada nodo, desde `inicio` (ms). */
  encendidos: number[];
  /** El trazo del láser (WAAPI sobre `::before`), si se ve. */
  laser: { keyframes: Keyframe[]; duracion: number } | null;
  nodo: number;
  pulso: number;
  texto: number;
  /** Retardo de cada pieza del paso (número, título, texto) desde su encendido. */
  escalon: number[];
  subida: number;
  blur: number;
  curva: string;
  /** Duración total de la secuencia (ms). */
  total: number;
};

export const CURVA_SUAVE = "cubic-bezier(0.22, 1, 0.36, 1)";
export const CURVA_TRAMO = "cubic-bezier(0.65, 0, 0.35, 1)";

const INICIO = 120;
const TRAMO = 400;
const TRAMO_SIN_LASER = 320;
const COLA = 380;
const NODO = 300;
const PULSO = 560;
const TEXTO = 480;
const ESCALON = [0, 70, 150];

export function coreografiaPasos({ eje, paradas, pasos }: { eje: Eje; paradas: number[]; pasos: number }): Coreografia {
  const tramo = eje === "ninguno" ? TRAMO_SIN_LASER : TRAMO;
  const encendidos = Array.from({ length: pasos }, (_, i) => i * tramo);
  const ultimo = encendidos[encendidos.length - 1] ?? 0;
  let laser: Coreografia["laser"] = null;
  if (eje !== "ninguno" && paradas.length === pasos && pasos > 0) {
    const duracion = ultimo + COLA;
    const escala = (v: number) => {
      const n = Math.min(1, Math.max(0, v));
      return eje === "x" ? `scaleX(${n.toFixed(4)})` : `scaleY(${n.toFixed(4)})`;
    };
    const keyframes: Keyframe[] = [{ offset: 0, transform: escala(0), easing: CURVA_TRAMO }];
    paradas.forEach((p, i) => {
      if (i === 0 && encendidos[0] === 0) {
        // El primer nodo está en el origen del láser: parte de ahí.
        keyframes[0].transform = escala(p);
        return;
      }
      keyframes.push({ offset: encendidos[i] / duracion, transform: escala(p), easing: i === pasos - 1 ? CURVA_SUAVE : CURVA_TRAMO });
    });
    keyframes.push({ offset: 1, transform: escala(1) });
    laser = { keyframes, duracion };
  }
  const total = INICIO + ultimo + Math.max(ESCALON[ESCALON.length - 1] + TEXTO, PULSO, laser ? COLA : 0);
  return {
    inicio: INICIO,
    encendidos,
    laser,
    nodo: NODO,
    pulso: PULSO,
    texto: TEXTO,
    escalon: ESCALON,
    subida: 12,
    blur: 4,
    curva: CURVA_SUAVE,
    total,
  };
}

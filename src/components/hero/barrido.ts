/**
 * Barrido automático de la zona nítida del vidrio (pulido I): la lente se mueve
 * sola, «como si alguien ya estuviera limpiando el cristal». Todo puro salvo
 * `actividad` (lee el estilo en línea de un elemento). Lo consumen `useLente`
 * (el bucle), `VidrioGL` y `LenteCss` (la geometría).
 *
 * La trayectoria es cerrada y periódica (`PERIODO`), en coordenadas
 * normalizadas de la foto y relativa a la cara: nace entre los ojos, baja por
 * una mejilla, sube por la sien, cruza a la boca y repite por el otro lado (un
 * ocho con el segundo cruce más bajo). El avance no es uniforme: `ritmo` lo
 * frena hasta casi parar en los ojos y lo suelta en los tramos largos, para que
 * parezca una mano y no un metrónomo.
 */

/** Segundos de una vuelta completa. */
export const PERIODO = 30;
/** Segundos de reposo del cursor antes de que el barrido retome. */
export const REPOSO = 3;
/** Segundos que tarda en volver a su trayectoria desde donde quedó el cursor. */
export const REENTRADA = 2.4;

const TAU = Math.PI * 2;

/** Avance u ∈ ℝ (1 = una vuelta) en el segundo t: monótono, con velocidad entre 0,2× y 1,8×. */
export function ritmo(t: number): number {
  const a = (TAU * t) / PERIODO;
  return t / PERIODO - (0.5 * Math.sin(2 * a)) / (2 * TAU) - (0.3 * Math.sin(3 * a)) / (3 * TAU);
}

export interface CaraFoto {
  /** Elipse de la cara [cx, cy, rx, ry], normalizada a la foto. */
  cara: [number, number, number, number];
  /** Línea de los ojos. */
  ojo: number;
}

/** Punto del barrido en el segundo t, normalizado a la foto. */
export function trayectoria(t: number, f: CaraFoto): [number, number] {
  const th = TAU * ritmo(t);
  const [cx, , rx, ry] = f.cara;
  const x = cx + rx * (1.15 * Math.sin(th) + 0.15 * Math.sin(3 * th));
  const y = f.ojo + ry * (0.68 * Math.sin(2 * th) + 0.2 * (1 - Math.cos(th)) + 0.08 * Math.sin(3 * th));
  return [x, y];
}

/** Suavizado 0 → 1 (derivada nula en los extremos). */
export const suave = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

const tramo = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/**
 * Cuánto barrido toca ahora, 0–1 (0 = en pausa): el héroe a la vista
 * (`visible`: fracción del elemento en pantalla) y sin desplazar. En el home de
 * escritorio el ancla escribe `--vidrio-p` (0 → 1): el barrido se apaga al
 * empezar el viaje de la foto. En `/about`, `--vidrio-f` (la fuerza del vidrio
 * baja con el scroll): sin vidrio no hay nada que barrer.
 */
export function actividad(o: { visible: number; p?: number; fuerza?: number }): number {
  let a = tramo(o.visible, 0.35, 0.6);
  if (o.p !== undefined && Number.isFinite(o.p)) a *= 1 - tramo(o.p, 0.02, 0.16);
  if (o.fuerza !== undefined && Number.isFinite(o.fuerza)) a *= tramo(o.fuerza, 0.24, 0.5);
  return a;
}

/**
 * Lo que comparten las lentes de la página (la capa CSS y el WebGL del mismo
 * héroe): `t` = reloj del barrido (s) y `dueno` = quién barre ahora (si la capa
 * CSS ya venía barriendo, el WebGL sigue en el mismo punto en vez de empezar de
 * cero); `gesto` = instante del último gesto del usuario (`performance.now()`),
 * para que una lente recién montada respete el reposo en curso.
 */
export const relojBarrido: { t: number; dueno: object | null; gesto: number } = { t: 0, dueno: null, gesto: -Infinity };

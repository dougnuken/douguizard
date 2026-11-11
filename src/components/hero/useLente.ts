"use client";

import { useEffect, type RefObject } from "react";
import { REENTRADA, REPOSO, relojBarrido, suave } from "./barrido";

/**
 * Lente del cursor sobre el vidrio (07 §1.3): muelles X/Y críticamente
 * amortiguados (respuesta 0,35 s; la apertura entra con k = 7 y sale con k = 4).
 * Táctil: arrastrar en horizontal sobre la foto la mueve 1:1 (el contenedor
 * lleva `touch-action: pan-y pinch-zoom`: el arrastre vertical hace scroll y el
 * navegador cancela el puntero). El bucle rAF solo corre mientras algo se mueve:
 * en reposo, 0 cuadros. Cuenta cuadros en `data-cuadros` del elemento.
 * (`data-lente` = apertura; `data-barrido` = "x,y" del centro mientras barre sola.)
 *
 * Pulido I · barrido automático (`barrido.ts`): si se pasa `opciones.barrido`,
<<<<<<< HEAD
 * la lente se mueve sola mientras nadie la lleva. El cursor (sobre la foto) o el
 * dedo manda en cuanto se mueve; tras `REPOSO` s sin gestos el barrido retoma **desde
=======
 * la lente se mueve sola mientras nadie la lleva. El cursor (o el dedo) manda
 * en cuanto se mueve; tras `REPOSO` s sin gestos el barrido retoma **desde
>>>>>>> origin/main
 * donde quedó la lente** y vuelve a su trayectoria en `REENTRADA` s. Mientras
 * barre hay bucle; cuando `barrido()` devuelve `null` (fuera de vista, héroe
 * desplazado) la lente se cierra y el bucle se detiene: 0 cuadros.
 */
export interface EstadoLente {
  mx: number;
  my: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  abierta: number;
  objetivo: number;
  arrastre: boolean;
}

export const RESPUESTA = 0.35;

/** Avanza el muelle `dt` segundos (sub-pasos de 1/240 s: estable aunque el cuadro tarde). Puro. */
export function pasoLente(s: EstadoLente, dt: number, abrir = 7): EstadoLente {
  const n = { ...s };
  if (n.arrastre) {
    n.mx = n.tx;
    n.my = n.ty;
    n.vx = n.vy = 0;
  } else {
    const w0 = (2 * Math.PI) / RESPUESTA;
    for (let r = dt; r > 0; r -= 1 / 240) {
      const h = Math.min(r, 1 / 240);
      n.vx += (w0 * w0 * (n.tx - n.mx) - 2 * w0 * n.vx) * h;
      n.vy += (w0 * w0 * (n.ty - n.my) - 2 * w0 * n.vy) * h;
      n.mx += n.vx * h;
      n.my += n.vy * h;
    }
  }
  n.abierta += (n.objetivo - n.abierta) * (1 - Math.exp(-dt * (n.objetivo > n.abierta ? abrir : 4)));
  if (Math.abs(n.objetivo - n.abierta) < 0.002) n.abierta = n.objetivo;
  return n;
}

export const enMovimiento = (s: EstadoLente) =>
  Math.abs(s.tx - s.mx) > 0.3 || Math.abs(s.ty - s.my) > 0.3 || Math.abs(s.vx) + Math.abs(s.vy) > 1 || s.abierta !== s.objetivo;

export interface Lente {
  estado: () => EstadoLente;
  /**
   * Cuánto desplaza el cursor la fase de las estrías, 0–1: 1 cuando manda el
   * cursor, 0 mientras barre sola (el vidrio queda quieto y solo se mueve la
   * zona nítida, igual que en la capa CSS). Cambia con suavidad.
   */
  paralaje: () => number;
  /** Deja de barrer para siempre (otro vidrio sigue el barrido en el mismo punto) y cierra la zona nítida. */
  ceder: () => void;
  /** Pide un cuadro (redimensión, scroll, fuerza nueva). */
  pedir: () => void;
  destruir: () => void;
}

export interface OpcionesLente {
  /**
   * Destino del barrido en el segundo `t` de su reloj, en px de `el`, con su
   * apertura `a` ∈ (0, 1]; `null` si ahora no toca barrer.
   */
  barrido?: (t: number) => { x: number; y: number; a: number } | null;
  /** Solo barre: el cursor no la lleva (la lleva otro vidrio); un gesto la cierra hasta que vuelva el reposo. */
  soloBarrido?: boolean;
  /**
   * El barrido va a menos de ~18 cuadros/s de forma sostenida (WebGL por
   * software, GPU muy justa). Se avisa una vez; quien escucha decide (`VidrioGL`
   * cede el barrido a la capa CSS, que solo usa el compositor).
   */
  alIrLento?: () => void;
}

/** Engancha la lente a `el` (sus coordenadas son las de su caja). `pintar` se llama en cada cuadro. */
export function montarLente(el: HTMLElement, pintar: (s: EstadoLente) => void, opciones: OpcionesLente = {}): Lente {
  let s: EstadoLente = { mx: 0, my: 0, vx: 0, vy: 0, tx: 0, ty: 0, abierta: 0, objetivo: 0, arrastre: false };
  let raf = 0;
  let ultimo = 0;
  let cuadros = 0;
  // Barrido: su reloj solo avanza mientras barre.
  const yo = {};
  let tb = relojBarrido.t;
  let barriendo = false;
  let entrada = 0;
  let dx = 0;
  let dy = 0;
  let espera = 0;
  let par = 1;
  let cedido = false;
  // Vigilancia del ritmo del barrido: suma de intervalos reales y cuadros contados.
  let lentoMs = 0;
  let lentoN = 0;
  let avisado = false;
  const destino = (now: number) => (opciones.barrido && !cedido && !s.arrastre && now - relojBarrido.gesto >= REPOSO * 1000 ? opciones.barrido(tb) : null);
  const barrer = (now: number, dt: number) => {
    if (cedido) return;
    let d = destino(now);
    if (!d) {
      // El barrido se apaga solo (scroll, fuera de vista): la lente se cierra donde está.
      if (barriendo && now - relojBarrido.gesto >= REPOSO * 1000) s.objetivo = 0;
      barriendo = false;
      if (relojBarrido.dueno === yo) relojBarrido.dueno = null;
      return;
    }
    if (!barriendo) {
      barriendo = true;
      entrada = 0;
      if (relojBarrido.dueno && relojBarrido.dueno !== yo) {
        // Otro vidrio ya venía barriendo (el respaldo CSS en móvil): se sigue en su punto, ya abierto.
        tb = relojBarrido.t;
        d = opciones.barrido?.(tb) ?? d;
        Object.assign(s, { mx: d.x, my: d.y, vx: 0, vy: 0, abierta: d.a });
      } else if (s.abierta < 0.05) {
        // Cerrada: nace sobre la trayectoria; no viaja desde una esquina.
        Object.assign(s, { mx: d.x, my: d.y, vx: 0, vy: 0 });
      }
      // Retoma desde donde quedó la lente y vuelve a la trayectoria poco a poco.
      dx = s.mx - d.x;
      dy = s.my - d.y;
    }
    tb += dt;
    entrada += dt;
    relojBarrido.t = tb;
    relojBarrido.dueno = yo;
    d = opciones.barrido?.(tb) ?? d;
    const k = 1 - suave(entrada / REENTRADA);
    s.tx = d.x + dx * k;
    s.ty = d.y + dy * k;
    s.objetivo = d.a;
  };
  const tick = (now: number) => {
    raf = 0;
    const real = now - ultimo;
    // Tope de 0,1 s: a 10 cuadros/s (WebGL por software) abrir y cerrar tardan lo mismo que a 60.
    const dt = Math.max(0, Math.min(0.1, real / 1000));
    ultimo = now;
    const barria = barriendo;
    barrer(now, dt);
    if (barria && barriendo && opciones.alIrLento && !avisado && real > 0 && real < 400) {
      // Los 4 primeros cuadros no cuentan (compilación perezosa, primer fondo guardado);
      // después, ventanas de 10: más de 55 ms de media es menos de 18 cuadros/s.
      if (++lentoN > 4) lentoMs += real;
      if (lentoN >= 14) {
        if (lentoMs / 10 > 55) {
          avisado = true;
          opciones.alIrLento();
        }
        lentoN = 4;
        lentoMs = 0;
      }
    }
    s = pasoLente(s, dt, barriendo ? 2.6 : 7);
    const parA = barriendo ? 0 : 1;
    par += (parA - par) * (1 - Math.exp(-dt * 5));
    if (Math.abs(parA - par) < 0.004) par = parA;
    pintar(s);
    el.dataset.cuadros = String(++cuadros);
    el.dataset.lente = s.abierta.toFixed(2);
    // Mientras barre: marca y centro de la zona nítida (px de `el`), para CSS y pruebas.
    if (barriendo) el.dataset.barrido = `${Math.round(s.mx)},${Math.round(s.my)}`;
    else delete el.dataset.barrido;
    if ((barriendo || par !== parA || enMovimiento(s)) && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const pedir = () => {
    if (raf || document.hidden) return;
    ultimo = performance.now();
    raf = requestAnimationFrame(tick);
  };
  /** Un gesto del usuario: el barrido calla y se rearma para dentro de `REPOSO` s. */
  const mando = () => {
    if (!opciones.barrido) return;
    relojBarrido.gesto = performance.now();
    barriendo = false;
    rearmar(REPOSO * 1000);
  };
  /** Dentro de `ms`, si hay algo que barrer, se pide un cuadro (en reposo, 0 cuadros). */
  const rearmar = (ms: number) => {
    window.clearTimeout(espera);
    espera = window.setTimeout(() => {
      if (!cedido && opciones.barrido?.(tb)) pedir();
    }, ms + 30);
  };
  // Montada en pleno reposo tras un gesto (el WebGL entra con el primer toque en móvil): espera lo que falte.
  const falta = REPOSO * 1000 - (performance.now() - relojBarrido.gesto);
  if (opciones.barrido && falta > 0) rearmar(falta);
  const local = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    return { x, y, dentro: x >= 0 && y >= 0 && x <= r.width && y <= r.height };
  };
  /** Modo `soloBarrido`: un gesto la cierra donde está. */
  const callar = () => {
    mando();
    if (s.objetivo === 0) return;
    Object.assign(s, { tx: s.mx, ty: s.my, objetivo: 0 });
    pedir();
  };
  const mover = (e: PointerEvent) => {
    if (opciones.soloBarrido) {
<<<<<<< HEAD
      // Solo un cursor sobre la foto la calla: moverlo por el resto de la página no para el barrido.
      if (e.pointerType !== "touch" && local(e).dentro) callar();
=======
      if (e.pointerType !== "touch") callar();
>>>>>>> origin/main
      return;
    }
    if (e.pointerType === "touch") {
      if (!s.arrastre) return;
      mando();
      const p = local(e);
      s.tx = p.x;
      s.ty = p.y;
      pedir();
      return;
    }
    const p = local(e);
<<<<<<< HEAD
    if (!p.dentro) {
      // Pulido I (Doug: «no vi que se anime solo»): fuera de la foto el cursor no
      // manda; antes cualquier movimiento por la página paraba el barrido 3 s y en
      // escritorio casi nunca llegaba a verse. Solo si el cursor venía llevando la
      // lente, esta se cierra donde está y el barrido vuelve tras el reposo.
      if (barriendo || s.objetivo === 0) return;
      mando();
=======
    const objetivo = p.dentro ? 1 : 0;
    const barria = barriendo;
    mando();
    if (!p.dentro && s.objetivo === 0) return;
    if (!p.dentro && barria) {
      // El cursor se mueve fuera de la foto: el barrido se cierra donde está.
>>>>>>> origin/main
      Object.assign(s, { tx: s.mx, ty: s.my, objetivo: 0 });
      pedir();
      return;
    }
<<<<<<< HEAD
    mando();
=======
>>>>>>> origin/main
    s.tx = p.x;
    s.ty = p.y;
    s.objetivo = 1;
    // La lente nace bajo el cursor; no viaja desde una esquina.
    if (s.abierta < 0.05) Object.assign(s, { mx: p.x, my: p.y, vx: 0, vy: 0 });
    pedir();
  };
  const bajar = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    const p = local(e);
    if (!p.dentro) return;
    if (opciones.soloBarrido) return callar();
    mando();
    Object.assign(s, { arrastre: true, tx: p.x, ty: p.y, mx: p.x, my: p.y, vx: 0, vy: 0, objetivo: 1 });
    pedir();
  };
  const soltar = (e: PointerEvent) => {
    if (e.pointerType === "touch" && s.arrastre) {
      s.arrastre = false;
      s.objetivo = 0;
      mando();
      pedir();
    }
  };
  const salir = () => {
    if (s.objetivo === 0 || barriendo) return;
    s.objetivo = 0;
    pedir();
  };
  const vis = () => {
    if (!document.hidden) return pedir();
    cancelAnimationFrame(raf);
    raf = 0;
  };
  window.addEventListener("pointermove", mover, { passive: true });
  window.addEventListener("pointerdown", bajar, { passive: true });
  window.addEventListener("pointerup", soltar, { passive: true });
  window.addEventListener("pointercancel", soltar, { passive: true });
  document.documentElement.addEventListener("pointerleave", salir);
  window.addEventListener("blur", salir);
  document.addEventListener("visibilitychange", vis);
  return {
    estado: () => s,
    paralaje: () => par,
    ceder: () => {
      // `relojBarrido.dueno` sigue siendo esta lente: quien continúe lo lee y sigue en el mismo punto.
      cedido = true;
      barriendo = false;
      window.clearTimeout(espera);
      // Se cierra cuando el otro ya está encima (si entretanto no la tomó el cursor).
      const t = performance.now();
      espera = window.setTimeout(() => {
        if (relojBarrido.gesto > t) return;
        // De golpe: la capa que sigue el barrido ya tapa la zona (y aquí cada cuadro cuesta).
        s.objetivo = s.abierta = 0;
        pedir();
      }, 700);
    },
    pedir,
    destruir: () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(espera);
      delete el.dataset.barrido;
      if (relojBarrido.dueno === yo) relojBarrido.dueno = null;
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerdown", bajar);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", soltar);
      document.documentElement.removeEventListener("pointerleave", salir);
      window.removeEventListener("blur", salir);
      document.removeEventListener("visibilitychange", vis);
    },
  };
}

/** Hook: monta la lente sobre `ref` mientras `activa`. */
export function useLente(ref: RefObject<HTMLElement | null>, pintar: (s: EstadoLente) => void, activa = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !activa) return;
    const l = montarLente(el, pintar);
    l.pedir();
    return () => l.destruir();
  }, [ref, pintar, activa]);
}

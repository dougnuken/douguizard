import type { Disponibilidad } from "@/data/decisiones";
import type { Locale } from "./config";

/**
 * Copy del tablero del home B (04 §2.2, §2.3 y §3, K1–K17; NOTAS de B §1).
 * **Solo servidor**, como `paginas.ts`: ninguna isla lee este objeto; lo que
 * necesita una isla (reloj, carrusel, testimonios, copiar correo) le llega por
 * props. Sin roles, años, empresas ni cifras escritas: entran por argumento
 * desde `cv.ts`, `site.ts`, `work.ts` y `lib/cuentas.ts`.
 */
const es = {
  k2: {
    claim: "Dirijo el producto. Después, lo construyo.",
    sub: (paises: string) => `Hoy, Naowee. Antes, Andes: el sistema de diseño de Mercadolibre en ${paises} países.`,
    verCasos: "Ver casos",
    cv: "Descargar CV (PDF)",
    cvAria: "Descargar mi hoja de vida en PDF",
    /** El punto de disponible (04 §2.3), según `decisiones.disponibilidad` (P1). */
    estado: {
      consultoria: "Disponible para consultoría",
      roles: "Abierto a roles",
      ambas: "Abierto a roles y consultoría",
      "no-disponible": "",
    } as Record<Disponibilidad, string>,
  },
  k1: {
    enlace: (nombre: string) => `${nombre} · ver perfil`,
  },
  k5: {
    boton: "Escríbeme",
    aria: (estado: string) => `Escríbeme: ${estado.toLowerCase()}`,
    relojAria: (hora: string) => `Hora local en Barranquilla: ${hora}`,
    relojSinHora: "Hora local en Barranquilla",
    h12: false,
  },
  /** Títulos de sección: visibles solo en móvil (la app); en escritorio, `sr-only`. */
  secciones: { trabajo: "Trabajo", experiencia: "Experiencia", perfil: "Perfil", contacto: "Contacto" },
  leerCaso: ", leer el caso",
  k11: {
    ceja: "Trayectoria",
    titulo: (desde: number, rol: string) => `${desde} → hoy: de freelance a ${rol}`,
    accion: ", ver la línea de tiempo completa",
    freelance: "Gráfico e interfaces",
  },
  k12: { link: ": mi trayectoria en cifras" },
  k13: {
    ceja: "Perfil",
    titulo: "Diseñador de producto que construye.",
    accion: ": ver el perfil",
    alt: "Doug Vargas, retrato en la penumbra.",
  },
  k14: { titulo: "Cómo trabajo", accion: ", leer los cuatro pasos" },
  k15: {
    ceja: "En sus palabras",
    region: "Testimonios",
    anterior: "Testimonio anterior",
    siguiente: "Testimonio siguiente",
    marcaIdioma: "Cita original en inglés",
  },
  k16: { accion: ", ver todo el trabajo", fila: (proyecto: string, anio: string) => `${proyecto}, ${anio}, leer el caso` },
  k17: {
    h2: "Hablemos",
    lead: "Un rol, una consultoría o el caso de Andes en una llamada: escríbeme.",
    leadSinRoles: "Una consultoría o el caso de Andes en una llamada: escríbeme.",
    copiar: { reposo: "Copiar correo", hecho: "Copiado", error: "No se pudo copiar. Selecciónalo a mano." },
    carta: "Carta de presentación",
    disponibilidad: (empresa: string) => `Lidero producto en ${empresa} y tomo consultorías puntuales en paralelo.`,
  },
};

export type DictTablero = typeof es;

const en: DictTablero = {
  k2: {
    claim: "I direct the product. Then I build it.",
    sub: (paises: string) => `Now at Naowee. Before that, Andes: Mercadolibre's design system in ${paises} countries.`,
    verCasos: "See case studies",
    cv: "Download CV (PDF)",
    cvAria: "Download my CV as a PDF",
    estado: {
      consultoria: "Open to consulting",
      roles: "Open to roles",
      ambas: "Open to roles and consulting",
      "no-disponible": "",
    },
  },
  k1: {
    enlace: (nombre: string) => `${nombre} · view profile`,
  },
  k5: {
    boton: "Get in touch",
    aria: (estado: string) => `Get in touch: ${estado.toLowerCase()}`,
    relojAria: (hora: string) => `Local time in Barranquilla: ${hora}`,
    relojSinHora: "Local time in Barranquilla",
    h12: true,
  },
  secciones: { trabajo: "Work", experiencia: "Experience", perfil: "About", contacto: "Contact" },
  leerCaso: ", read the case",
  k11: {
    ceja: "Experience",
    titulo: (desde: number, rol: string) => `${desde} → now: from freelance to ${rol}`,
    accion: ", see the full timeline",
    freelance: "Graphic & UI",
  },
  k12: { link: ": my career in numbers" },
  k13: {
    ceja: "About",
    titulo: "A product designer who builds.",
    accion: ": view the profile",
    alt: "Doug Vargas, portrait in low light.",
  },
  k14: { titulo: "How I work", accion: ", read the four steps" },
  k15: {
    ceja: "In their words",
    region: "Testimonials",
    anterior: "Previous testimonial",
    siguiente: "Next testimonial",
    marcaIdioma: "",
  },
  k16: { accion: ", see all work", fila: (proyecto: string, anio: string) => `${proyecto}, ${anio}, read the case` },
  k17: {
    h2: "Let's talk",
    lead: "A role, a consulting project, or the Andes case on a call: write to me.",
    leadSinRoles: "A consulting project, or the Andes case on a call: write to me.",
    copiar: { reposo: "Copy email", hecho: "Copied", error: "Couldn't copy. Select it instead." },
    carta: "Cover letter",
    disponibilidad: (empresa: string) => `I lead product at ${empresa} and take on selected consulting alongside it.`,
  },
};

export const tableroDict: Record<Locale, DictTablero> = { es, en };

/**
 * K15 · Las citas del home: una **oración completa y literal** de cada una
 * (04 §3 K15). Se elige por un fragmento que tiene que aparecer en la cita;
 * Francesca no va en el home (`decisiones.citaFrancescaEnHome = false`, `10.7`).
 */
export const citasHome = [
  { id: "arman", fragmento: "translate complex data" },
  { id: "nicolas", fragmento: "standard of craft" },
] as const;

/** La oración de `cita` que contiene `fragmento`, tal cual (sin editar una letra). */
export function oracionDe(cita: string, fragmento: string): string {
  const oraciones = cita.match(/[^.!?]+[.!?]+["”]?/g) ?? [cita];
  const o = oraciones.find((x) => x.includes(fragmento));
  if (!o) throw new Error(`tablero.ts: «${fragmento}» no está en la cita.`);
  return o.trim();
}

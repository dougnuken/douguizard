import type { Locale } from "./config";

/**
 * Microcopy del sistema B (04 §4 y D17): cabecera, dock, idioma, pie, hoja,
 * carrusel. **Todavía no forma parte de `dictionaries.ts` a propósito:** el
 * diccionario viaja entero al navegador (`LocaleProvider`), y en F1 nadie usa
 * estas claves; añadirlas allí sumaba 0,4 KB gz al JS de las páginas actuales.
 * F3, cuando la cabecera y el dock las consuman, las pasa al diccionario
 * (`{ ...en, ...sistemaEn }`). Mismas reglas: sin roles ni años.
 */
const en = {
  sistema: {
    nav: { label: "Main", trabajo: "Work", perfil: "About", experiencia: "Experience", cv: "CV", hablemos: "Let's talk" },
    idioma: { label: "Language", leerEnOtro: "Ver en español" },
    pie: {
      lugar: (city: string, tz: string) => `${city} · ${tz}`,
      colofonA: "Designed by me; built with Next.js and AI agents I direct.",
      colofonB: "Designed and built by Doug Vargas.",
      volverArriba: "Back to top",
    },
    escena: { desliza: "Scroll" },
    disponible: "Available",
    rail: {
      label: "Quick actions",
      correo: (email: string) => `Write to me: ${email}`,
      cv: "Download my CV as a PDF",
      cvTip: "Download CV (PDF)",
      externo: (red: string) => `${red} (opens in a new tab)`,
      arriba: "Back to top",
    },
  },
  dock: { label: "Quick navigation", trabajo: "Work", perfil: "About", experiencia: "Experience", cv: "CV", contacto: "Contact", secciones: "Sections" },
  hoja: { cerrar: "Close", verCompleta: "Open as a full page", progreso: "Reading progress" },
  carrusel: {
    anterior: "Previous",
    siguiente: "Next",
    contador: (n: number, total: number) => `${n} of ${total}`,
    rol: "carousel",
  },
};

export type DictSistema = typeof en;

const es: DictSistema = {
  sistema: {
    nav: { label: "Principal", trabajo: "Trabajo", perfil: "Perfil", experiencia: "Experiencia", cv: "CV", hablemos: "Hablemos" },
    idioma: { label: "Idioma", leerEnOtro: "Read in English" },
    pie: {
      lugar: (city: string, tz: string) => `${city} · ${tz}`,
      colofonA: "Diseñado por mí; construido con Next.js y agentes de IA que dirijo.",
      colofonB: "Diseñado y construido por Doug Vargas.",
      volverArriba: "Volver arriba",
    },
    escena: { desliza: "Desliza" },
    disponible: "Disponible",
    rail: {
      label: "Acciones rápidas",
      correo: (email: string) => `Escríbeme: ${email}`,
      cv: "Descargar mi hoja de vida en PDF",
      cvTip: "Descargar CV (PDF)",
      externo: (red: string) => `${red} (se abre en otra pestaña)`,
      arriba: "Volver arriba",
    },
  },
  dock: { label: "Navegación rápida", trabajo: "Trabajo", perfil: "Perfil", experiencia: "Experiencia", cv: "CV", contacto: "Contacto", secciones: "Secciones" },
  hoja: { cerrar: "Cerrar", verCompleta: "Abrir como página completa", progreso: "Progreso de lectura" },
  carrusel: {
    anterior: "Anterior",
    siguiente: "Siguiente",
    contador: (n: number, total: number) => `${n} de ${total}`,
    rol: "carrusel",
  },
};

export const sistemaDict: Record<Locale, DictSistema> = { en, es };

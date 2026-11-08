import type { Locale } from "./config";
import { sistemaDict, type DictSistema } from "./sistema";

/**
 * Every string the interface itself says — labels, headings, buttons, the
 * accessible names nobody sees. What the site says ABOUT the work lives with
 * the work, in `src/data`, and is translated there.
 *
 * English is the shape; Spanish has to match it key for key, which the type
 * enforces, so a label added in one language cannot ship missing from the other.
 */

const SMALL_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const SMALL_ES = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce"];

/** "Seven", "dos" — numbers a sentence would spell out. Digits past twelve. */
export function numberWord(n: number, locale: Locale, { capital = false } = {}): string {
  const list = locale === "es" ? SMALL_ES : SMALL_EN;
  const word = list[n] ?? String(n);
  return capital ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

const en = {
  meta: {
    skip: "Skip to content",
    homeLabel: (brand: string) => `${brand} — home`,
  },
  header: {
    sections: "Sections",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    work: "Work",
    cv: "CV",
    email: "Email",
    language: "Language",
    /** Shown on the switch's other-language link, in that language. */
    switchTo: "Ver en español",
  },
  theme: {
    toggle: "Switch theme",
    toDark: "Switch to dark theme",
    toLight: "Switch to light theme",
    nowLight: "Light theme",
    nowDark: "Dark theme",
  },
  work: {
    vignettes: {
      olbo: {
        caption: "Say it out loud; the category is inferred.",
        label: "A captured expense: spoken text becomes an amount, a merchant and a category.",
      },
      naowee: {
        caption: "Assign a filing; the queue recounts in place.",
        label: "A work queue recounting: six pending becomes five, three assigned becomes four.",
        pending: "Pending",
        assigned: "Assigned",
      },
      andes: {
        caption: "One component, its tokens and its variants.",
        label: "The anatomy of a design-system component: tokens resolving into variants.",
      },
      banco: {
        caption: "Foundations first, then atoms, then organisms.",
        label: "A design-system grid: foundations, atoms, molecules and organisms.",
        usage: ["Text", "Body", "Meta", "Rules", "Cards", "Page"],
      },
      dc: {
        caption: "Payment, receipt, consent: the green light comes last.",
        label:
          "A patient case moving through its locks: the payment and the receipt are in, the consent arrives, the case reaches phase three and the procedure gets its green light.",
        phase: "Phase",
        checks: ["Paid in full", "Receipt", "Consent"],
        go: "Go-ahead",
      },
      makeapet: {
        caption: "Swipe right; when it is mutual, the owners chat.",
        label: "A pet card swiped to the right: it tilts, takes a LIKE stamp and leaves, with the next card waiting behind it and pass and like buttons below.",
        forYou: "For you",
      },
    },
  },
  case: {
    breadcrumb: "Breadcrumb",
    allWork: "All work",
    meta: { role: "Role", duration: "Duration", platforms: "Platforms", team: "Team", year: "Year" },
    openIt: "Open it",
    impact: "Impact",
    // A side project that never shipped has no results to report, only a
    // premise — calling that band "impact" claims an outcome that never was.
    idea: "The idea",
    context: "Problem",
    whatIDid: "My part",
    howItHappened: "Process",
    decisions: "Decisions",
    sections: "Case study sections",
    links: "Links",
    inTheirWords: "In their words",
    quoteOriginal: "",
    features: "What it can do",
    featureKind: { ai: "AI", product: "Product" },
    product: "Product",
    gallery: "In detail",
    walkthrough: "Walkthrough · no sound",
    productScreens: (project: string) => `${project} — product screens`,
    swipe: "Swipe →",
    play: "Play",
    pause: "Pause",
    nda: "Case study available on request",
    ndaBody:
      "The screens are Mercadolibre's, so they don't go on a public site. I'm happy to walk through the system, the governance model and the audit workflow directly.",
    askOn: (network: string) => `Ask on ${network}`,
    email: "Email",
    tools: "Tools & methods",
    liveLink: "Live link",
    authorship: "Authorship",
    next: "Next case study",
    nextLine: "Want the details? I'll walk you through it on a call.",
    readCase: ", read the case",
    notFound: {
      kicker: "404 · Case study not found",
      // 04 §4.5: sin el «¿Perdido en el espacio?» (ya no hay máscara ni chiste que repetir).
      title: "This case study doesn't exist, or isn't published yet.",
      back: "See all case studies",
    },
  },
  cv: {
    title: (headline: string) => `CV — ${headline}`,
    description: (p: { name: string; years: number; companies: string }) =>
      `Curriculum vitae of ${p.name}. ${p.years} years of product design and design engineering across ${p.companies}.`,
    download: "Download CV or letter",
    downloadDialog: {
      title: "Download",
      document: "Document",
      cv: "CV",
      letter: "Cover letter",
      language: "Language",
      photo: "Photo",
      withPhoto: "With photo",
      noPhoto: "Without photo",
      noPhotoHint: "Best for US companies and job portals.",
      submit: "Download",
      cancel: "Cancel",
    },
    downloadName: (name: string, photo = true) => `${name} — CV${photo ? "" : " (no photo)"}.pdf`,
    letterUpdated: (when: string) => `Updated ${when}`,
    copy: { idle: "Copy text", copied: "Copied", failed: "Couldn't copy. Try selecting it." },
    letterDownload: "Download PDF",
    letterDownloadName: (name: string) => `${name} — Cover letter.pdf`,
    experience: "Experience",
    earlier: "Earlier",
    seeCase: "See case",
    seeCaseLabel: (company: string) => `See the ${company} case study`,
    mode: { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" },
    sidebar: "Education, certifications and languages",
    education: "Education",
    certifications: "Certifications",
    languages: "Languages",
    skills: "Skills",
    tools: "Tools",
  },
  notFound: {
    kicker: "404 · Page not found",
    // 04 §4.5 con D17: el chiste de la máscara se retira porque ya no hay máscara.
    title: "Nothing here.",
    body: (domain: string) =>
      `The address you followed doesn't exist on ${domain}. It may have moved. Everything that does exist is one click away.`,
    home: "Go home",
    work: "See case studies",
    cv: "CV",
  },
  /** F8 · error de render (error.tsx): sin detalles técnicos, con salida. */
  error: {
    kicker: "Error",
    title: "Something broke on this page.",
    body: "It's on my side, not yours. Try again, or go back home.",
    retry: "Try again",
    home: "Go home",
  },
};

type DictBase = typeof en;
/** Con el microcopy del sistema B (`sistema.ts`, F3): cabecera, dock, idioma, pie, hoja, carrusel. */
export type Dict = DictBase & DictSistema;

const es: DictBase = {
  meta: {
    skip: "Ir al contenido",
    homeLabel: (brand: string) => `${brand} — inicio`,
  },
  header: {
    sections: "Secciones",
    menu: "Menú",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    work: "Trabajo",
    cv: "CV",
    email: "Correo",
    language: "Idioma",
    switchTo: "Read in English",
  },
  theme: {
    toggle: "Cambiar el tema",
    toDark: "Cambiar al tema oscuro",
    toLight: "Cambiar al tema claro",
    nowLight: "Tema claro",
    nowDark: "Tema oscuro",
  },
  work: {
    vignettes: {
      olbo: {
        caption: "Lo dices en voz alta; la categoría se infiere.",
        label: "Un gasto capturado: el texto dictado se convierte en un monto, un comercio y una categoría.",
      },
      naowee: {
        caption: "Asignas un trámite; la bandeja se recuenta en su sitio.",
        label: "Una bandeja de trabajo que se recuenta: seis pendientes pasan a cinco, tres asignados pasan a cuatro.",
        pending: "Pendientes",
        assigned: "Asignados",
      },
      andes: {
        caption: "Un componente, sus tokens y sus variantes.",
        label: "La anatomía de un componente de sistema de diseño: tokens que se resuelven en variantes.",
      },
      banco: {
        caption: "Primero los fundamentos, luego átomos, luego organismos.",
        label: "La grilla de un sistema de diseño: fundamentos, átomos, moléculas y organismos.",
        usage: ["Texto", "Cuerpo", "Meta", "Reglas", "Tarjetas", "Página"],
      },
      dc: {
        caption: "Pago, recibo, consentimiento: la luz verde llega al final.",
        label:
          "Un caso de paciente pasando por sus candados: el pago y el recibo ya están, llega el consentimiento, el caso entra a la fase tres y el procedimiento recibe su luz verde.",
        phase: "Fase",
        checks: ["Pago completo", "Recibo", "Consentimiento"],
        go: "Luz verde",
      },
      makeapet: {
        caption: "Desliza a la derecha; si es mutuo, los dueños chatean.",
        label: "Una tarjeta de mascota deslizada a la derecha: se inclina, recibe el sello LIKE y sale, con la siguiente tarjeta esperando detrás y los botones de descartar y like debajo.",
        forYou: "Para ti",
      },
    },
  },
  case: {
    breadcrumb: "Ruta de navegación",
    allWork: "Todo el trabajo",
    meta: { role: "Rol", duration: "Duración", platforms: "Plataformas", team: "Equipo", year: "Año" },
    openIt: "Ábrelo",
    impact: "Impacto",
    idea: "La idea",
    context: "Problema",
    whatIDid: "Mi parte",
    howItHappened: "Proceso",
    decisions: "Decisiones",
    sections: "Secciones del caso",
    links: "Enlaces",
    inTheirWords: "En sus palabras",
    quoteOriginal: "Cita original en inglés",
    features: "Qué puede hacer",
    featureKind: { ai: "IA", product: "Producto" },
    product: "Producto",
    gallery: "En detalle",
    walkthrough: "Recorrido · sin sonido",
    productScreens: (project: string) => `${project} — pantallas del producto`,
    swipe: "Desliza →",
    play: "Reproducir",
    pause: "Pausar",
    nda: "Caso disponible a solicitud",
    ndaBody:
      "Las pantallas son de Mercadolibre, así que no van en un sitio público. Con gusto te muestro directamente el sistema, el modelo de gobierno y el flujo de auditoría.",
    askOn: (network: string) => `Escríbeme por ${network}`,
    email: "Correo",
    tools: "Herramientas y métodos",
    liveLink: "En vivo",
    authorship: "Autoría",
    next: "Siguiente caso",
    nextLine: "¿Quieres verlo en detalle? Te lo cuento en una llamada.",
    readCase: ", leer el caso",
    notFound: {
      kicker: "404 · Caso no encontrado",
      title: "Este caso no existe, o todavía no está publicado.",
      back: "Ver todos los casos",
    },
  },  error: {
    kicker: "Error",
    title: "Algo falló en esta página.",
    body: "Es de mi lado, no del tuyo. Intenta de nuevo o vuelve al inicio.",
    retry: "Intentar de nuevo",
    home: "Ir al inicio",
  },

  cv: {
    title: (headline: string) => `Hoja de vida — ${headline}`,
    description: (p) =>
      `Hoja de vida de ${p.name}. ${p.years} años de diseño de producto e ingeniería de diseño en ${p.companies}.`,
    download: "Descargar CV o carta",
    downloadDialog: {
      title: "Descargar",
      document: "Documento",
      cv: "Hoja de vida",
      letter: "Carta",
      language: "Idioma",
      photo: "Foto",
      withPhoto: "Con foto",
      noPhoto: "Sin foto",
      noPhotoHint: "Mejor para empresas de EE. UU. y portales de empleo.",
      submit: "Descargar",
      cancel: "Cancelar",
    },
    downloadName: (name: string, photo = true) => `${name} — Hoja de vida${photo ? "" : " (sin foto)"}.pdf`,
    letterUpdated: (when: string) => `Actualizada en ${when}`,
    copy: { idle: "Copiar texto", copied: "Copiado", failed: "No se pudo copiar. Selecciónalo a mano." },
    letterDownload: "Descargar PDF",
    letterDownloadName: (name: string) => `${name} — Carta de presentación.pdf`,
    experience: "Experiencia",
    earlier: "Antes",
    seeCase: "Ver caso",
    seeCaseLabel: (company: string) => `Ver el caso de ${company}`,
    mode: { remote: "Remoto", hybrid: "Híbrido", onsite: "Presencial" },
    sidebar: "Educación, certificaciones e idiomas",
    education: "Educación",
    certifications: "Certificaciones",
    languages: "Idiomas",
    skills: "Habilidades",
    tools: "Herramientas",
  },
  notFound: {
    kicker: "404 · Página no encontrada",
    title: "Aquí no hay nada.",
    body: (domain: string) =>
      `La dirección que seguiste no existe en ${domain}. Puede que se haya movido. Todo lo que sí existe está a un clic.`,
    home: "Ir al inicio",
    work: "Ver casos",
    cv: "CV",
  },
};

export const dictionaries: Record<Locale, Dict> = {
  en: { ...en, ...sistemaDict.en },
  es: { ...es, ...sistemaDict.es },
};

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}

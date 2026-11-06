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
    meta: { role: "Role", duration: "Duration", team: "Team", year: "Year" },
    openIt: "Open it",
    impact: "The impact",
    // A side project that never shipped has no results to report, only a
    // premise — calling that band "impact" claims an outcome that never was.
    idea: "The idea",
    context: "Context",
    whatIDid: "What I did",
    howItHappened: "How it happened",
    decisions: "Key decisions",
    inTheirWords: "In their words",
    quoteOriginal: "",
    features: "What it can do",
    featureKind: { ai: "AI", product: "Product" },
    product: "The product",
    gallery: "In detail",
    walkthrough: "/ Walkthrough — no sound",
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
    notFound: {
      kicker: "404 · Case study not found",
      title: { pre: "Lost in", em: "space", post: "?" },
      body: "The case study you're looking for doesn't exist — or hasn't been published yet.",
      back: "Back to all work",
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
    title: "This one went nowhere.",
    body: (domain: string) =>
      `The address you followed doesn't exist on ${domain} — it may have moved, or it may never have been here. Everything that does exist is one click away.`,
    home: "Home",
    work: "Selected work",
    cv: "CV",
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
    meta: { role: "Rol", duration: "Duración", team: "Equipo", year: "Año" },
    openIt: "Ábrelo",
    impact: "El impacto",
    idea: "La idea",
    context: "Contexto",
    whatIDid: "Qué hice",
    howItHappened: "Cómo se hizo",
    decisions: "Decisiones clave",
    inTheirWords: "En sus palabras",
    quoteOriginal: "Cita original en inglés",
    features: "Qué puede hacer",
    featureKind: { ai: "IA", product: "Producto" },
    product: "El producto",
    gallery: "En detalle",
    walkthrough: "/ Recorrido — sin sonido",
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
    notFound: {
      kicker: "404 · Caso no encontrado",
      title: { pre: "¿Perdido en el", em: "espacio", post: "?" },
      body: "El caso que buscas no existe, o todavía no se ha publicado.",
      back: "Volver a todo el trabajo",
    },
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
    title: "Esta no llevó a ningún lado.",
    body: (domain: string) =>
      `La dirección que seguiste no existe en ${domain}: puede que se haya movido, o que nunca haya estado aquí. Todo lo que sí existe está a un clic.`,
    home: "Inicio",
    work: "Trabajo seleccionado",
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

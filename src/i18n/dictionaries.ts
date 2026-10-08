import type { Locale } from "./config";

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
  shell: {
    label: "Sections — use the arrow keys to move between panels",
  },
  index: {
    label: "Section index",
    row: (label: string, num: string) => `${label} — section ${num}`,
  },
  hero: {
    /** Three lines; `strong` is the one bold word that carries the claim. */
    title: [
      { pre: "Designing the" },
      { strong: "human", post: " side" },
      { pre: "of an AI era" },
    ] as { pre?: string; strong?: string; post?: string }[],
    focus: "Design Build Ship",
    sub: (p: { role: string; company: string; andesCompany: string; countries: string; scale: string }) =>
      `${p.role} at ${p.company}. I set direction across the platform and build the prototypes that define it. Before that, Andes at ${p.andesCompany} — the design system behind ${p.countries} countries, ${p.scale}.`,
    /** "400+ designers, 2,000+ engineers" → "400+ designers and 2,000+ engineers". */
    joinScale: (team: string) => team.replace(", ", " and "),
    seeWork: "See work",
    whereWorked: "Where I've worked",
  },
  work: {
    intro: (p: { years: number; own: number; core: number; side: number }) => ({
      lead: `${p.years} years of systems, products and teams —`,
      rest: `from LATAM's largest marketplace to national banks, cruise lines and early-stage startups, plus ${numberWord(p.own, "en")} products of my own, designed, built and shipped end to end. ${numberWord(p.core, "en", { capital: true })} that shaped how I work, and ${numberWord(p.side, "en")} I took on for the pleasure of it.`,
    }),
    read: "Read",
    nda: "Case study available on request",
    earlier: "Earlier work",
    side: "Freelance side projects",
    fullCv: "Full CV",
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
    },
  },
  craft: {
    kicker: "Craft",
    expertise: "Expertise",
    howIWork: "How I work",
  },
  about: {
    experience: "/ Experience",
    earlier: "Earlier",
    seeCase: "See case",
    education: "/ Education",
    languages: "/ Languages",
    fullCv: "Full CV",
    portraitAlt: (name: string) =>
      `${name}, photographed in black and white against a dark background.`,
    facts: {
      based: "Based",
      currently: "Currently",
      focus: "Focus",
      focusValue: "Design systems · AI-native product",
      openTo: "Open to",
      languages: "Languages",
      native: "native",
    },
  },
  contact: {
    lead: "The fastest way to reach me is LinkedIn. Email works too.",
    signal: (company: string) =>
      `I lead product at ${company} and take on selected consulting alongside it. Most interested in design systems at scale and AI-native product work.`,
    signalLabel: "/ The signal",
    direct: "/ Direct",
    elsewhere: "/ Elsewhere",
    backToTop: "Back to top",
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
    download: "Download PDF",
    downloadName: (name: string) => `${name} — CV.pdf`,
    letterUpdated: (when: string) => `Updated ${when}`,
    copy: { idle: "Copy letter", copied: "Copied", failed: "Couldn't copy" },
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

export type Dict = typeof en;

const es: Dict = {
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
  shell: {
    label: "Secciones — usa las flechas del teclado para moverte entre paneles",
  },
  index: {
    label: "Índice de secciones",
    row: (label: string, num: string) => `${label} — sección ${num}`,
  },
  hero: {
    title: [{ pre: "Diseñar lo" }, { strong: "humano", post: " en" }, { pre: "la era de la IA" }],
    focus: "Diseñar Construir Lanzar",
    sub: (p) =>
      `${p.role} en ${p.company}. Marco la dirección de la plataforma y construyo los prototipos que la definen. Antes, Andes en ${p.andesCompany}: el sistema de diseño detrás de ${p.countries} países, ${p.scale}.`,
    joinScale: (team: string) => team.replace(", ", " y "),
    seeWork: "Ver trabajo",
    whereWorked: "Dónde he trabajado",
  },
  work: {
    intro: (p) => ({
      lead: `${p.years} años de sistemas, productos y equipos:`,
      rest: `del marketplace más grande de Latinoamérica a bancos nacionales, cruceros y startups en etapa temprana, más ${numberWord(p.own, "es")} productos propios, diseñados, construidos y lanzados de punta a punta. ${numberWord(p.core, "es", { capital: true })} que definieron cómo trabajo y ${numberWord(p.side, "es")} que tomé por el gusto de hacerlos.`,
    }),
    read: "Leer",
    nda: "Caso disponible bajo solicitud",
    earlier: "Trabajo anterior",
    side: "Proyectos freelance paralelos",
    fullCv: "CV completo",
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
    },
  },
  craft: {
    kicker: "Oficio",
    expertise: "Especialidad",
    howIWork: "Cómo trabajo",
  },
  about: {
    experience: "/ Experiencia",
    earlier: "Antes",
    seeCase: "Ver caso",
    education: "/ Educación",
    languages: "/ Idiomas",
    fullCv: "CV completo",
    portraitAlt: (name: string) => `${name}, en blanco y negro sobre un fondo oscuro.`,
    facts: {
      based: "Ubicación",
      currently: "Actualmente",
      focus: "Enfoque",
      focusValue: "Sistemas de diseño · Producto nativo de IA",
      openTo: "Disponible para",
      languages: "Idiomas",
      native: "nativo",
    },
  },
  contact: {
    lead: "La forma más rápida de contactarme es LinkedIn. El correo también funciona.",
    signal: (company: string) =>
      `Lidero producto en ${company} y, en paralelo, tomo consultorías puntuales. Lo que más me interesa: sistemas de diseño a escala y producto nativo de IA.`,
    signalLabel: "/ En qué estoy",
    direct: "/ Directo",
    elsewhere: "/ En otros lugares",
    backToTop: "Volver arriba",
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
    nda: "Caso disponible bajo solicitud",
    ndaBody:
      "Las pantallas son de Mercadolibre, así que no van en un sitio público. Con gusto te muestro el sistema, el modelo de gobierno y el flujo de auditoría en persona.",
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
    download: "Descargar PDF",
    downloadName: (name: string) => `${name} — Hoja de vida.pdf`,
    letterUpdated: (when: string) => `Actualizada en ${when}`,
    copy: { idle: "Copiar carta", copied: "Copiada", failed: "No se pudo copiar" },
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

export const dictionaries: Record<Locale, Dict> = { en, es };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}

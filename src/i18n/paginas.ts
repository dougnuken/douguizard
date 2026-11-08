import type { Locale } from "./config";

/**
 * Copy de las páginas `/work`, `/about` y `/experience` (04 §3, §4.6, §6 y el
 * microcopy de NOTAS §4, D17). **Solo servidor**, como `sistema.ts`: el
 * diccionario de `dictionaries.ts` viaja entero al navegador con
 * `LocaleProvider`, y estas claves no las lee ninguna isla. Lo que necesita una
 * isla (el anuncio del filtro, «Leído») se le pasa por props.
 * Sin roles, años, empresas ni cifras escritas: entran por argumento desde
 * `cv.ts`, `work.ts` y `lib/cuentas.ts`.
 */
const es = {
  trabajo: {
    h1: "Trabajo",
    intro: (anios: number, propios: string) =>
      `${anios} años de sistemas, productos y equipos: de Mercadolibre a un banco, una naviera y startups, y ${propios} productos propios, diseñados, construidos y lanzados de punta a punta.`,
    enCifras: "En cifras",
    cifras: {
      anios: "años en producto digital",
      casos: "casos publicados",
      propios: "productos propios",
      aria: (a: number, c: number, p: number) =>
        `${a} años en producto digital, ${c} casos publicados, ${p} productos propios`,
    },
    filtro: {
      label: "Filtrar casos",
      todos: "Todos",
      escala: "Escala",
      propios: "Productos propios",
      anteriores: "Anteriores",
      anuncio: (n: number) => (n === 1 ? "1 caso" : `${n} casos`),
    },
    listaCasos: "Casos",
    leido: "Leído",
    nda: "NDA · Caso a solicitud",
    ahora: "Ahora",
    propio: "Producto propio",
    archivo: { ceja: "Archivo", titulo: "Más trabajo", leer: "Leer el caso" },
    leerElCaso: "leer el caso",
    /** Copy de cada losa (04 §3, K3–K10): ceja (resto), apoyo y etiqueta de la cifra. */
    losas: {
      "naowee-suid": { ceja: "", apoyo: "Los 30 trámites del deporte colombiano, fuera de Word.", etiquetas: ["pantallas en 8 módulos"] },
      "mercadolibre-andes": { ceja: "", apoyo: "Líder técnico del sistema de diseño de Mercadolibre.", etiquetas: ["diseñadores", "ingenieros", "países"] },
      olbo: { ceja: "Design Engineer", apoyo: "Mide tu ritmo de gasto, no tu saldo.", etiquetas: ["pruebas en verde"] },
      "banco-de-occidente": { ceja: "", apoyo: "Un portal más liviano y Velocity, su sistema de diseño.", etiquetas: ["squads en un solo sistema"] },
      "dc-medical": { ceja: "Socio y constructor", apoyo: "Una clínica en tres ciudades, desde un celular.", etiquetas: ["días del primer commit a la versión del 2 oct"] },
      makeapet: { ceja: "iOS, Android y web", apoyo: "De cinco pantallas en Figma a una app real.", etiquetas: ["pruebas automatizadas"] },
    },
    /** Línea de cada fila del archivo (04 §3, K16). */
    lineasArchivo: {
      "royal-caribbean": "Reservas y vida a bordo, con Globant.",
      qrvey: "AutomatiQ: encuestas que actúan solas.",
      ideaware: "Diseño para clientes de EE. UU. y LATAM.",
      chub: "Alquiler de carros por minuto, para iOS.",
    },
    meta: {
      titulo: "Trabajo",
      descripcion: (casos: number, propios: string) =>
        `${casos} casos de Doug Vargas: sistemas de diseño en Mercadolibre y Banco de Occidente, la plataforma del deporte en Colombia y ${propios} productos propios.`,
    },
  },
  perfil: {
    ceja: "Perfil",
    desliza: "Desliza",
    contexto: "Contexto",
    hago: "Lo que hago",
    como: "Cómo trabajo",
    datos: "Datos",
    herramientas: "Con qué trabajo",
    empresas: "Dónde he trabajado",
    citas: "Lo que dicen quienes trabajaron conmigo",
    citasMarca: "Citas originales en inglés",
    // F2 P2-3: «del Banco de Occidente», «de Qrvey» (el artículo va con el nombre común).
    leerCasoDe: (cliente: string) => `Leer el caso ${/^(Banco|Grupo)\b/.test(cliente) ? "del" : "de"} ${cliente}`,
    cierre: "Lo demás está en el trabajo.",
    verCasos: "Ver casos",
    descargarCv: "Descargar CV (PDF)",
    rotulos: {
      base: "Base",
      zona: "Zona horaria",
      actualmente: "Actualmente",
      disponible: "Disponible para",
      idiomas: "Idiomas",
    },
    zonaValor: "UTC-5, sin horario de verano",
    meta: {
      titulo: "Perfil",
      descripcion: (cargo: string, empresa: string) =>
        `Diseñador de producto que construye: ${cargo} en ${empresa}, antes Andes en Mercadolibre. Cómo trabajo, qué hago y cómo contactarme.`,
    },
  },
  trayectoria: {
    lista: "Etapas de mi trayectoria, de la más antigua a la actual",
    hoy: "Hoy",
    acumulados: {
      label: "Acumulados",
      anios: "años en producto digital",
      empresas: "empresas",
      casos: "casos publicados",
      vacio: "aún no",
    },
    verCaso: "Ver caso",
    verCasoNda: "Ver caso · NDA",
    enParalelo: "En paralelo",
    propios: "Productos propios",
    eje: "Línea de tiempo",
    descargarCv: "Descargar CV (PDF)",
    meta: {
      titulo: "Experiencia",
      descripcion: (cargo: string, empresas: string) =>
        `De freelance en Barranquilla a ${cargo}: la trayectoria de Doug Vargas, con ${empresas}.`,
    },
  },
};

export type DictPaginas = typeof es;

const en: DictPaginas = {
  trabajo: {
    h1: "Work",
    intro: (anios: number, propios: string) =>
      `${anios} years of systems, products and teams: from Mercadolibre to a bank, a cruise line and startups, plus ${propios} products of my own, designed, built and shipped end to end.`,
    enCifras: "By the numbers",
    cifras: {
      anios: "years in digital product",
      casos: "case studies",
      propios: "products of my own",
      aria: (a: number, c: number, p: number) =>
        `${a} years in digital product, ${c} case studies, ${p} products of my own`,
    },
    filtro: {
      label: "Filter case studies",
      todos: "All",
      escala: "At scale",
      propios: "Products of my own",
      anteriores: "Earlier",
      anuncio: (n: number) => (n === 1 ? "1 case study" : `${n} case studies`),
    },
    listaCasos: "Case studies",
    leido: "Read",
    nda: "NDA · Case on request",
    ahora: "Now",
    propio: "Product of my own",
    archivo: { ceja: "Archive", titulo: "More work", leer: "Read the case" },
    leerElCaso: "read the case",
    losas: {
      "naowee-suid": { ceja: "", apoyo: "Colombia's 30 sports procedures, out of Word and email.", etiquetas: ["screens across 8 modules"] },
      "mercadolibre-andes": { ceja: "", apoyo: "Tech lead on Mercadolibre's design system.", etiquetas: ["designers", "engineers", "countries"] },
      olbo: { ceja: "Design Engineer", apoyo: "Reads your spending pace, not your balance.", etiquetas: ["tests passing"] },
      "banco-de-occidente": { ceja: "", apoyo: "A lighter portal, and Velocity, its design system.", etiquetas: ["squads on one system"] },
      "dc-medical": { ceja: "Co-owner and builder", apoyo: "A three-city clinic, run from one phone.", etiquetas: ["days from first commit to the Oct 2 version"] },
      makeapet: { ceja: "iOS, Android, web", apoyo: "From five Figma screens to a real app.", etiquetas: ["automated tests"] },
    },
    lineasArchivo: {
      "royal-caribbean": "Booking and life aboard, with Globant.",
      qrvey: "AutomatiQ: surveys that act on their own.",
      ideaware: "Design for US and LATAM clients.",
      chub: "Per-minute car rental, for iOS.",
    },
    meta: {
      titulo: "Work",
      descripcion: (casos: number, propios: string) =>
        `${casos} case studies by Doug Vargas: design systems at Mercadolibre and Banco de Occidente, Colombia's sports platform and ${propios} products of my own.`,
    },
  },
  perfil: {
    ceja: "About",
    desliza: "Scroll",
    contexto: "Context",
    hago: "What I do",
    como: "How I work",
    datos: "Facts",
    herramientas: "What I work with",
    empresas: "Where I've worked",
    citas: "From people I've worked with",
    citasMarca: "",
    leerCasoDe: (cliente: string) => `Read the ${cliente} case`,
    cierre: "The rest is in the work.",
    verCasos: "See case studies",
    descargarCv: "Download CV (PDF)",
    rotulos: {
      base: "Based in",
      zona: "Time zone",
      actualmente: "Currently",
      disponible: "Open to",
      idiomas: "Languages",
    },
    zonaValor: "UTC-5, no daylight saving (same as New York in winter)",
    meta: {
      titulo: "About",
      descripcion: (cargo: string, empresa: string) =>
        `A product designer who builds: ${cargo} at ${empresa}, previously Andes at Mercadolibre. How I work, what I do and how to reach me.`,
    },
  },
  trayectoria: {
    lista: "Stages of my career, oldest to current",
    hoy: "Now",
    acumulados: {
      label: "Running totals",
      anios: "years in digital product",
      empresas: "companies",
      casos: "case studies",
      vacio: "not yet",
    },
    verCaso: "See case",
    verCasoNda: "See case · NDA",
    enParalelo: "In parallel",
    propios: "Products of my own",
    eje: "Timeline",
    descargarCv: "Download CV (PDF)",
    meta: {
      titulo: "Experience",
      descripcion: (cargo: string, empresas: string) =>
        `From freelance work in Barranquilla to ${cargo}: Doug Vargas's career, through ${empresas}.`,
    },
  },
};

export const paginasDict: Record<Locale, DictPaginas> = { es, en };

/** «tres» / «three»: números en palabras hasta nueve (04 §6.3), cifra después. */
export function enPalabras(n: number, locale: Locale): string {
  const p = {
    es: ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"],
    en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
  }[locale];
  return p[n] ?? String(n);
}

import type { CvProfile, Education, Experience, ExperienceId, Language, SkillGroup, ToolGroup } from "@/data/cv";

/**
 * The CV in Spanish: only what a reader reads. Dates, ids, locations and case
 * links are facts, not words, so they stay in `cv.ts` and are never repeated.
 *
 * Job titles stay as they were held — "Head of Product", "Senior Product
 * Designer" — because that is how they are written on the contracts and on
 * LinkedIn. The one exception is the freelance years, which never had an
 * English title to begin with.
 */
export const experiencesEs: Record<
  ExperienceId,
  Pick<Experience, "summary"> & Partial<Pick<Experience, "role" | "roleShort" | "client" | "impact">>
> = {
  naowee: {
    summary:
      "Dirección de producto de SUID, la plataforma construida para el sistema deportivo de Colombia. Marco la dirección de ocho módulos de negocio y construyo los prototipos que los definen.",
    impact: [
      "Dirijo con un equipo de 2 personas el producto de SUID, plataforma del sistema deportivo de Colombia: 8 módulos, entre ellos la inspección, vigilancia y control de ~1.200 organizaciones deportivas y sus 30 trámites regulatorios.",
      "Construí el design system del producto: 38+ componentes, un shell canónico y una receta única de asistente que mantiene 130+ pantallas en un mismo lenguaje.",
      "Modelé la jerarquía real del sector (comités, federaciones, ligas, clubes y deportistas) con aprobación en cascada, en 45+ estados y 15 roles.",
      "Reemplacé especificaciones por prototipos funcionales en código, construidos con IA, que los analistas validan historia por historia contra el producto en marcha.",
    ],
  },
  mercadolibre: {
    summary:
      "Líder técnico de Andes, el sistema de diseño detrás de los productos de comercio, fintech y envíos de Mercadolibre en 18 países.",
    impact: [
      "Lideré técnicamente Andes, el design system de los productos de comercio, fintech y envíos de Mercadolibre en 18 países.",
      "Mantuve la librería de componentes para iOS, Android y Web, usada por 400+ diseñadores y 2.000+ ingenieros.",
      "Definí los fundamentos del sistema (design tokens, espaciado, tipografía y movimiento) que gobiernan toda la suite de productos.",
      "Acordé con ingeniería APIs de componentes únicas para todas las plataformas e introduje auditorías con IA que detectan desviaciones del sistema en Figma antes de salir a producción.",
    ],
  },
  aval: {
    summary:
      "Diseñador de producto senior de la banca digital del Banco de Occidente y guardián oficial del sistema de diseño compartido por los squads de producto del banco.",
    impact: [
      "Goberné adiciones, deprecaciones y patrones del design system compartido por 12+ squads de producto del banco.",
      "Construí Velocity, el design system del banco: documentación, fundamentos y librería de componentes con diseño atómico.",
      "Rediseñé los flujos centrales de la banca digital (registro e ingreso, cuentas y tarjetas, transferencias y pagos) para escritorio, tableta y celular.",
      "Mentoré a diseñadores junior y semi senior y lideré talleres, clases y críticas de diseño.",
    ],
  },
  globant: {
    summary:
      "Diseño móvil y web para los cruceros de Royal Caribbean, desde el estudio de Globant en Medellín, con los equipos de producto e ingeniería en Estados Unidos.",
    impact: [
      "Diseñé los flujos móviles y web de reserva y experiencia a bordo: destinos, tipos de camarote y vida en el barco.",
      "Diseñé horarios, restaurantes, excursiones y saldos para funcionar con conexión intermitente en altamar.",
      "Trabajé con equipos multifuncionales de producto e ingeniería en Estados Unidos.",
    ],
  },
  qrvey: {
    client: "Plataforma de encuestas y NPS",
    summary:
      "Diseñador UI líder en Qrvey, un proyecto de Ideaware: una plataforma de encuestas y NPS, su tablero, y AutomatiQ, el constructor que convertía una respuesta en una acción.",
    impact: [
      "Promovido a liderar la UI de Qrvey, plataforma de encuestas y NPS: definí su lenguaje visual en móvil y web.",
      "Diseñé de punta a punta AutomatiQ, el constructor de automatizaciones (procesos, disparadores, condiciones y acciones), y prototipé mejoras de UX/UI que llegaron a producción.",
    ],
  },
  ideaware: {
    summary:
      "Diseño UX/UI para clientes internacionales en una agencia remota: wireframes, UI kits y prototipos para web y móvil, y después la cuenta de Qrvey, a la que me promovieron y que lideré.",
    impact: [
      "Entregué wireframes, UI kits y prototipos listos para desarrollo, en web y móvil, para clientes internacionales.",
      "Diseñé Pool Botball, app de iOS para monitorear la química de piscinas.",
    ],
  },
  smartbiz: {
    summary:
      "Primer rol de UI. Diseño de interfaces para proyectos web y móviles de clientes, y la primera vez que trabajé dentro de una librería de componentes compartida en vez de pantallas sueltas.",
  },
  freelance: {
    role: "Diseñador gráfico y de interfaces",
    summary:
      "Diseño gráfico y de interfaces independiente para clientes locales: sistemas de marca, impresos y los primeros trabajos web.",
  },
};

export const educationEs: Record<string, Pick<Education, "program">> = {
  uac: { program: "Diseñador Gráfico Profesional" },
};

/** Same ids, same order, same `primary` flags; only the words change. */
export const skillsEs: Record<SkillGroup["id"], { label: string; items: string[] }> = {
  product: {
    label: "Producto",
    items: [
      "Dirección de producto",
      "Design thinking",
      "Investigación con usuarios (user research)",
      "Customer journeys",
      "Flujos de usuario",
      "Pruebas A/B",
      "Wireframing",
      "Prototipado",
    ],
  },
  systems: {
    label: "Sistemas de diseño",
    items: [
      "Design tokens",
      "Fundamentos",
      "Librerías de componentes",
      "Gobierno (governance)",
      "Documentación",
      "Diseño atómico",
      "Paridad iOS, Android y Web",
    ],
  },
  engineering: {
    label: "Ingeniería",
    items: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Pruebas automatizadas",
      "PWA",
      "IndexedDB",
      "Content Security Policy",
      "Git",
    ],
  },
  ai: {
    label: "IA aplicada",
    items: [
      "Prototipado en código con IA",
      "UI generativa",
      "Flujos con LLM",
      "Auditorías de diseño con prompts",
      "Tool calling",
    ],
  },
  leadership: {
    label: "Liderazgo",
    items: [
      "Mentoría",
      "Talleres y críticas de diseño",
      "Equipos multifuncionales (cross-functional)",
      "Validación con stakeholders",
      "Colaboración con equipos de EE. UU.",
    ],
  },
};

export const toolLabelsEs: Record<ToolGroup["id"], string> = {
  design: "Diseño",
  code: "Código",
  ai: "IA",
  collaboration: "Colaboración",
};

export const languagesEs: Language[] = [
  { name: "Español", cefr: "Native", level: "Nativo" },
  { name: "Inglés", cefr: "B1", level: "B1 · Competencia profesional" },
];

export const profileEs: CvProfile = {
  summary: (years) =>
    `Head of Product y líder de sistemas de diseño con ${years} años en diseño de producto digital. Dirijo el producto de Naowee, la plataforma del sistema deportivo de Colombia, y construyo prototipos funcionales en código con IA. Antes fui Tech Lead de Andes, el design system de Mercadolibre en 18 países, y durante 5 años y 2 meses Design System Gatekeeper del Banco de Occidente.`,
  highlights: ["18 países", "400+ diseñadores", "2.000+ ingenieros", "12+ squads", "130+ pantallas"],
};

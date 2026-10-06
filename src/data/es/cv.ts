import type { Education, Experience, ExperienceId, Language, SkillGroup, ToolGroup } from "@/data/cv";

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
      "**Dirección de producto en 8 módulos de negocio**: inspección, vigilancia y control sobre ~1.200 organizaciones deportivas y sus 30 trámites regulatorios, además de eventos, escenarios, incentivos, convocatorias y puntuación.",
      "**Un solo sistema de diseño, y construyo en él**: más de 38 componentes, un shell canónico y una sola receta de asistente que mantiene más de 130 pantallas en un mismo lenguaje.",
      "**Modelé la jerarquía real del sector**: comités, federaciones, ligas, clubes y deportistas con aprobación en cascada, en más de 45 estados y 15 roles.",
      "**Prototipos que funcionan en vez de especificaciones**: construidos en código y recorridos historia por historia con analistas que aprueban contra el producto en marcha.",
    ],
  },
  mercadolibre: {
    summary:
      "Líder técnico de Andes, el sistema de diseño detrás de los productos de comercio, fintech y envíos de Mercadolibre en 18 países.",
    impact: [
      "**Librería de diseño mantenida para iOS, Android y Web**: la usan más de 400 diseñadores y más de 2.000 ingenieros.",
      "**Definiciones fundacionales**: tokens, espaciado, tipografía y movimiento que gobiernan la suite de productos en 18 países.",
      "**Trabajo multiplataforma con ingeniería**: APIs de componentes acordadas una vez y lanzadas igual en cada plataforma.",
      "**IA dentro de la práctica de sistemas**: auditorías guiadas por prompts que detectan desviaciones del sistema en Figma antes de que salgan.",
    ],
  },
  aval: {
    summary:
      "Diseñador de producto senior de la banca digital del Banco de Occidente y guardián oficial del sistema de diseño compartido por los squads de producto del banco.",
    impact: [
      "**Guardián del sistema de diseño**: gobierné adiciones, deprecaciones y patrones en más de 12 squads de producto.",
      "**Construí Velocity, el sistema de diseño del banco**: documentación, fundamentos, átomos, moléculas y organismos, sobre principios de diseño atómico.",
      "**Rediseñé los flujos centrales de la banca**: ingreso y registro, cuentas y tarjetas, transferencias y pagos, para escritorio, tableta y celular.",
      "**Cultura de sistema**: talleres, clases y críticas, además de mentoría a diseñadores junior y semi senior.",
    ],
  },
  globant: {
    summary:
      "Diseño móvil y web para los cruceros de Royal Caribbean, desde el estudio de Globant en Medellín, con los equipos de producto e ingeniería en Estados Unidos.",
    impact: [
      "**Reserva y experiencia a bordo**: flujos móviles para destinos, tipos de camarote y la vida en el barco.",
      "**Diseñado para una conexión intermitente**: horarios, restaurantes, excursiones y saldos que aguantan en altamar.",
      "**Colaboración entre disciplinas** con los equipos de producto e ingeniería en Estados Unidos.",
    ],
  },
  qrvey: {
    client: "Plataforma de encuestas y NPS",
    summary:
      "Diseñador UI líder en Qrvey, un proyecto de Ideaware: una plataforma de encuestas y NPS, su tablero, y AutomatiQ, el constructor que convertía una respuesta en una acción.",
    impact: [
      "**Dueño del lenguaje visual** del producto, en móvil y web.",
      "**Diseñé AutomatiQ de punta a punta**: la lista de procesos, las tarjetas de disparadores, el editor de condiciones y las acciones que ejecutan.",
      "**Prototipé mejoras de UX/UI** que llegaron a producción.",
    ],
  },
  ideaware: {
    summary:
      "Diseño UX/UI para clientes internacionales en una agencia remota: wireframes, UI kits y prototipos para web y móvil, y después la cuenta de Qrvey, a la que me promovieron y que lideré.",
    impact: [
      "**Wireframes, UI kits y prototipos** entregados listos para desarrollo, en web y móvil.",
      "**Un dominio nuevo en cada proyecto**: la soltura que después hizo natural el trabajo de sistemas.",
      "**Pool Botball**: una app de iOS para monitorear la química de una piscina, diseñada pantalla por pantalla.",
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
      "Investigación con usuarios y encuestas",
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
      "Tokens y fundamentos",
      "Librerías de componentes",
      "Gobierno",
      "Documentación",
      "UI kits",
      "Diseño atómico",
      "Paridad multiplataforma",
    ],
  },
  engineering: {
    label: "Ingeniería",
    items: [
      "TypeScript y JavaScript",
      "React y Next.js",
      "Node.js",
      "Pruebas automatizadas",
      "PWA y service workers",
      "IndexedDB",
      "Content Security Policy",
      "Git",
    ],
  },
  ai: {
    label: "IA en el proceso",
    items: [
      "Prototipado en código con IA",
      "UI generativa",
      "Flujos guiados por LLM",
      "Auditorías de diseño con prompts",
      "Llamadas a herramientas estructuradas",
      "Privacidad y procesamiento en el dispositivo",
    ],
  },
  platforms: {
    label: "Plataformas",
    items: ["iOS", "Android", "Web", "Responsive", "Interacciones web y app", "Herramientas no-code"],
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

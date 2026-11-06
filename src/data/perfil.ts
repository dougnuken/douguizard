import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { currentExperience } from "@/lib/career";
import { getSite } from "./site";
import { getCv, type ExperienceId } from "./cv";
import { getCaseStudy } from "./work";

/**
 * Perfil: el oficio, cómo trabajo, los datos de base y las eras de la
 * trayectoria. Fuente única para `/about`, `/experience`, K13 y K14 (F2/F3).
 *
 * El oficio y los pasos se movieron aquí desde `components/sections/Craft.tsx`
 * (04 §0 los cita como fuente) sin cambiar una palabra; `Craft.tsx` los lee de
 * aquí hasta que F3 lo retire.
 */

export interface Entrada {
  title: string;
  body: string;
}

/**
 * The panel's copy in each language. The figures inside it are read from the
 * data — the Andes scale from the case, the company from the CV — never
 * retyped here.
 */
export function getOficio(locale: Locale): { oficio: Entrada[]; pasos: Entrada[] } {
  const company = currentExperience().company.name;
  const andes = getCaseStudy("mercadolibre-andes", locale);
  const countries =
    getCaseStudy("mercadolibre-andes", "en")?.kpis?.find((k) => k.label === "Countries shipped to")
      ?.value ?? "";
  const scale = getDict(locale).hero.joinScale(andes?.team ?? "");

  if (locale === "es") {
    return {
      oficio: [
        {
          title: "Dirección de producto",
          body: `Decido qué debería ser un producto y después sigo respondiendo por él hasta que sale. En ${company} eso significa ocho módulos de negocio, los estados y roles que tienen debajo, y una revisión donde la versión construida tiene que coincidir con la demo.`,
        },
        {
          title: "Sistemas de diseño",
          body: `Tokens, componentes, gobierno y la documentación aburrida que hace repetible el buen diseño. Construí uno para un banco y mantuve uno que usan ${scale} en ${countries} países.`,
        },
        {
          title: "Ingeniería de diseño con IA",
          body: "Prototipo en código, con Claude Code, Cursor y Gemini cargando el peso repetitivo. Lo que sale es un producto que funciona, no un mockup, y por eso el negocio aprueba contra él y no contra un documento.",
        },
      ],
      pasos: [
        {
          title: "Leer el dominio antes de dibujar",
          body: `Antes de que exista una pantalla, mapeo cómo funciona la cosa de verdad. Para el flujo de inspección de ${company} fueron más de 45 estados y 15 roles. Los estados eran el producto; la interfaz era la parte fácil.`,
        },
        {
          title: "Construir el lenguaje, no las pantallas",
          body: "La falla típica son ocho módulos con ocho dialectos. Por eso construyo primero el sistema y hago que todos lo respeten, yo incluido. Ningún componente a la medida: si al sistema le falta algo, se extiende el sistema.",
        },
        {
          title: "El prototipo es la especificación",
          body: "Lo que el negocio firma es un prototipo que funciona, con roles y estados reales, recorrido una historia a la vez. Los desacuerdos salen cuando todavía son baratos, e ingeniería recibe algo ya resuelto.",
        },
        {
          title: "Lanzar, y después escuchar",
          body: "El uso diario muestra lo que ninguna especificación habría mostrado. olbo me lo enseñó en una semana: un error de zona horaria que dañaba el color de noche, recibos que me negué a volver a digitar. Cada cosa se volvió una decisión, una prueba y un salto de versión.",
        },
      ],
    };
  }

  return {
    oficio: [
      {
        title: "Product direction",
        body: `I decide what a product should be and then stay accountable for it shipping. At ${company} that means eight business modules, the states and roles underneath them, and a review where the built version has to match the demo.`,
      },
      {
        title: "Design systems",
        body: `Tokens, components, governance and the boring documentation that makes good design repeatable. I have built one for a bank and maintained one used by ${scale} across ${countries} countries.`,
      },
      {
        title: "Design engineering with AI",
        body: "I prototype in code, with Claude Code, Cursor and Gemini carrying the repetitive weight. The output is a running product, not a mockup, which is why business signs off against it instead of against a document.",
      },
    ],
    pasos: [
      {
        title: "Read the domain before drawing",
        // 45+ states / 15 roles are on Naowee's verified figure set (cv.ts).
        body: `Before a screen exists I map how the thing actually works. For ${company}'s inspection flow that was 45+ states and 15 roles. The states were the product; the interface was the easy part.`,
      },
      {
        title: "Build the language, not the screens",
        body: "The failure mode is eight modules with eight dialects. So I build the system first and hold everyone to it, myself included. No custom component — if the system is missing something, the system gets extended.",
      },
      {
        title: "The prototype is the spec",
        body: "What business signs is a working prototype with real roles and real states, walked through one story at a time. Disagreement surfaces while it is still cheap and engineering receives something already resolved.",
      },
      {
        title: "Ship, then listen",
        body: "Daily use surfaces what no spec would have. olbo taught me that in a week — a timezone bug that broke the colour after dark, receipts I refused to retype. Each one became a decision, a test and a version bump.",
      },
    ],
  };
}

/** Datos de base de `/about` (04 §6.1). Todo derivado de `site.ts` y `cv.ts`. */
export function getDatos(locale: Locale) {
  const s = getSite(locale);
  return {
    base: `${s.location.city}, ${s.location.country}`,
    zona: s.location.timezone,
    idiomas: getCv(locale).languages.map((l) => ({ nombre: l.name, nivel: l.level })),
  };
}

/**
 * Eras de `/experience` (04 §6.2). Los años de cada hito salen de `cv.ts` con
 * `formatPeriod()`; aquí solo el nombre de la era y su rango.
 */
export interface Era {
  id: "base" | "producto" | "sistemas" | "escala" | "direccion";
  nombre: { es: string; en: string };
  desde: number;
  /** `null` = hoy. */
  hasta: number | null;
}

export const eras: Era[] = [
  { id: "base", nombre: { es: "Base", en: "Groundwork" }, desde: 2006, hasta: 2014 },
  { id: "producto", nombre: { es: "Producto", en: "Product" }, desde: 2014, hasta: 2018 },
  { id: "sistemas", nombre: { es: "Sistemas", en: "Systems" }, desde: 2018, hasta: 2024 },
  { id: "escala", nombre: { es: "Escala", en: "Scale" }, desde: 2024, hasta: 2026 },
  { id: "direccion", nombre: { es: "Dirección", en: "Direction" }, desde: 2026, hasta: null },
];

/**
 * Bio de tres frases y dos párrafos de contexto de `/about` (04 §6.1). Cargo y
 * empresa actuales salen de `cv.ts`; el resto es copy de 04.
 */
export function getBio(locale: Locale): { bio: string; contexto: [string, string] } {
  const actual = currentExperience();
  if (locale === "es") {
    return {
      bio: `Soy diseñador de producto y construyo lo que diseño. Hoy dirijo el producto de ${actual.company.name}, la plataforma del sistema deportivo de Colombia, y hago en código los prototipos que lo definen. Antes fui líder técnico de Andes, el sistema de diseño de Mercadolibre en 18 países, y durante 5 años y 2 meses guardián del sistema de diseño del Banco de Occidente.`,
      contexto: [
        "Lo que me ha mantenido aquí no es una pantalla en particular: son los sistemas de abajo. Los tokens, el gobierno y el lenguaje compartido que permite que cientos de diseñadores y miles de ingenieros entreguen un solo producto.",
        "Hace rato dejé de separar diseñar de construir. Prototipo en código, entrego interfaces reales y dejo que el sistema y los modelos carguen el trabajo repetitivo. olbo y DC Medical son la prueba: una app de finanzas y el panel de una clínica que diseñé, construí y lancé, los dos en uso diario.",
      ],
    };
  }
  return {
    bio: `I'm a product designer who builds what he designs. Today I lead product at ${actual.company.name}, the platform for Colombia's sports system, and build the prototypes in code that define it. Before that I was tech lead on Andes, Mercadolibre's design system across 18 countries, and for 5 years and 2 months the gatekeeper of Banco de Occidente's design system.`,
    contexto: [
      "What has kept me here isn't any single screen. It's the systems underneath: the tokens, the governance and the shared language that let hundreds of designers and thousands of engineers ship one product.",
      "I stopped separating designing from building a while ago. I prototype in code, ship real interfaces and let the system and the models carry the repetitive work. olbo and DC Medical are the proof: a finance app and a clinic's operating panel I designed, built and shipped, both in daily use.",
    ],
  };
}

/**
 * Hitos de la trayectoria: cada experiencia del CV, la formación (`uac`) y el
 * proyecto paralelo `chub` (P1-4: un hito «Freelance · Chub», no un propio).
 */
export type Hito = ExperienceId | "uac" | "chub";

/**
 * Logro de cada hito (≤ 140 caracteres, 04 §6.2), condensado del `impact[]` /
 * `summary` de `cv.ts`. Fechas, cargos y empresas salen de `cv.ts`, no de aquí.
 * Chub usa la línea de su fila en el archivo (04 §3, K16).
 */
export const logros: Record<Hito, { es: string; en: string }> = {
  uac: {
    es: "Formación en diseño gráfico, en Barranquilla.",
    en: "Graphic design degree, in Barranquilla.",
  },
  freelance: {
    es: "Sistemas de marca, impresos y los primeros trabajos web para clientes locales.",
    en: "Brand systems, print and early web work for local clients.",
  },
  smartbiz: {
    es: "Primer rol de UI, y la primera vez dentro de una librería de componentes compartida.",
    en: "First UI role, and the first time inside a shared component library.",
  },
  ideaware: {
    es: "Wireframes, UI kits y prototipos para clientes internacionales; Pool Botball para iOS.",
    en: "Wireframes, UI kits and prototypes for international clients; Pool Botball for iOS.",
  },
  qrvey: {
    es: "Promovido a liderar la UI: el lenguaje visual de Qrvey y AutomatiQ, de punta a punta.",
    en: "Promoted to lead UI: Qrvey's visual language and AutomatiQ, end to end.",
  },
  globant: {
    es: "Reserva y vida a bordo en móvil y web, con producto e ingeniería en EE. UU.",
    en: "Booking and life aboard on mobile and web, with product and engineering in the US.",
  },
  aval: {
    es: "Construí Velocity y goberné el sistema de 12+ squads; rediseñé la banca digital en tres dispositivos.",
    en: "Built Velocity and governed the system for 12+ squads; redesigned digital banking on three devices.",
  },
  mercadolibre: {
    es: "Líder técnico del sistema que usan 400+ diseñadores y 2.000+ ingenieros en 18 países.",
    en: "Tech lead on the system used by 400+ designers and 2,000+ engineers in 18 countries.",
  },
  chub: {
    es: "Alquiler de carros por minuto, para iOS.",
    en: "Per-minute car rental, for iOS.",
  },
  naowee: {
    es: "Dirijo SUID: 8 módulos de negocio, ~1.200 organizaciones y 130+ pantallas en un solo sistema.",
    en: "I lead SUID: 8 business modules, ~1,200 organizations and 130+ screens on one system.",
  },
};

/**
 * Portada de `/experience` (04 §6.2). Años y empresas se pasan ya contados
 * (`lib/cuentas.ts`, F2): aquí no se cuenta nada.
 */
export function getTrayectoriaPortada(locale: Locale, cuentas: { anos: number; empresas: number }) {
  const cargo = currentExperience().role;
  const palabras = { es: ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"], en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"] }[locale];
  const empresas = palabras[cuentas.empresas] ?? String(cuentas.empresas);
  return locale === "es"
    ? {
        ceja: "Trayectoria",
        h1: `De freelance a ${cargo}`,
        intro: `${cuentas.anos} años en producto digital, ${empresas} empresas y un sistema de diseño en 18 países. Cada etapa con caso se abre.`,
      }
    : {
        ceja: "Experience",
        h1: `From freelance to ${cargo}`,
        intro: `${cuentas.anos} years in digital product, ${empresas} companies and a design system in 18 countries. Every stage with a case study opens it.`,
      };
}

/**
 * «Lo que hago» y «Cómo trabajo» de `/about`, en la versión de 04 §6.1 (cuerpo
 * ≤ 45 palabras). `getOficio()` sigue sirviendo el texto largo al panel del
 * home actual hasta que F3 lo retire (F2 no cambia el home). Empresa y cifras
 * se leen de `cv.ts` y del caso de Andes, nunca se reescriben.
 */
export function getOficioPerfil(locale: Locale): { hago: Entrada[]; pasos: Entrada[] } {
  const company = currentExperience().company.name;
  const andes = getCaseStudy("mercadolibre-andes", locale);
  const k = (i: number) => andes?.kpis?.[i]?.value ?? "";
  const [disenadores, ingenieros, paises] = [k(0), k(1), k(2)];
  if (locale === "es") {
    return {
      hago: [
        {
          title: "Dirección de producto",
          body: `Decido qué debe ser un producto y respondo por él hasta que sale. En ${company}: ocho módulos de negocio, sus estados y roles, y una revisión donde lo construido tiene que coincidir con la demo.`,
        },
        {
          title: "Sistemas de diseño",
          body: `Tokens, componentes, gobierno y la documentación aburrida que hace repetible el buen diseño. Construí uno para un banco y mantuve otro que usan ${disenadores} diseñadores y ${ingenieros} ingenieros en ${paises} países.`,
        },
        {
          title: "Ingeniería de diseño con IA",
          body: "Prototipo en código con Claude Code, Cursor y Gemini haciendo el trabajo repetitivo. Lo que entrego es un producto que funciona, no un mockup, y el negocio aprueba contra él, no contra un documento.",
        },
      ],
      pasos: [
        {
          title: "Leer el dominio antes de dibujar.",
          body: `Antes de que exista una pantalla, mapeo cómo funciona la cosa de verdad. En la inspección de ${company} fueron más de 45 estados y 15 roles: los estados eran el producto.`,
        },
        {
          title: "El lenguaje antes que las pantallas.",
          body: "La falla típica son ocho módulos con ocho dialectos. Construyo primero el sistema y hago que todos lo respeten, yo incluido: si le falta algo, se extiende el sistema.",
        },
        {
          title: "El prototipo es la especificación.",
          body: "Lo que el negocio firma es un prototipo con roles y estados reales, recorrido una historia a la vez. Los desacuerdos salen cuando todavía son baratos.",
        },
        {
          title: "Lanzar, y después escuchar.",
          body: "El uso diario muestra lo que ninguna especificación mostró. En olbo fue un error de zona horaria que dañaba el color de noche: se volvió una decisión, una prueba y una versión nueva.",
        },
      ],
    };
  }
  return {
    hago: [
      {
        title: "Product direction",
        body: `I decide what a product should be and stay accountable until it ships. At ${company}: eight business modules, their states and roles, and a review where what gets built has to match the demo.`,
      },
      {
        title: "Design systems",
        body: `Tokens, components, governance and the boring documentation that makes good design repeatable. I built one for a bank and maintained one used by ${disenadores} designers and ${ingenieros} engineers in ${paises} countries.`,
      },
      {
        title: "Design engineering with AI",
        body: "I prototype in code, with Claude Code, Cursor and Gemini doing the repetitive work. What I hand over is a running product, not a mockup, and business signs off against it, not against a document.",
      },
    ],
    pasos: [
      {
        title: "Read the domain before drawing.",
        body: `Before a screen exists, I map how the thing actually works. For ${company}'s inspection flow that was 45+ states and 15 roles: the states were the product.`,
      },
      {
        title: "The language before the screens.",
        body: "The usual failure is eight modules with eight dialects. I build the system first and hold everyone to it, me included: if something's missing, the system gets extended.",
      },
      {
        title: "The prototype is the spec.",
        body: "What business signs is a working prototype with real roles and states, walked one story at a time. Disagreement surfaces while it's still cheap.",
      },
      {
        title: "Ship, then listen.",
        body: "Daily use shows what no spec did. In olbo it was a timezone bug that broke the colour after dark: it became a decision, a test and a new version.",
      },
    ],
  };
}

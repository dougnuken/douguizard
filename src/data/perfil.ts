import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { currentExperience } from "@/lib/career";
import { getSite } from "./site";
import { getCv } from "./cv";
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

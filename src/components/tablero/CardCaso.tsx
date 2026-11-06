import Image from "next/image";
import BentoCard from "@/components/sistema/BentoCard";
import DotMatrix from "@/components/sistema/DotMatrix";
import Etiqueta from "@/components/sistema/Etiqueta";
import { MarcaLeido } from "@/components/trabajo/Leido";
import { getCv } from "@/data/cv";
import { cifrasCaso, ordenCasos } from "@/data/home";
import { getCaseStudy } from "@/data/work";
import { localePath, type Locale } from "@/i18n/config";
import { paginasDict } from "@/i18n/paginas";
import { grupoCaso } from "@/lib/cuentas";

export type VarianteCaso = "oscura-captura" | "jelly-azul-cifras" | "niebla-telefono" | "oscura" | "magenta";
type Slug = (typeof ordenCasos)[number];

/** Superficie, medio y cifra de cada losa protagonista (`work.html`, NOTAS §7). */
const DISENO: Record<Slug, { variante: VarianteCaso; clase: string; medio?: { src: string; w: number; h: number } }> = {
  "naowee-suid": {
    variante: "oscura-captura",
    clase: "c-naowee",
    medio: { src: "/work/naowee/ivc-workspace-tramite.webp", w: 2880, h: 1800 },
  },
  "mercadolibre-andes": { variante: "jelly-azul-cifras", clase: "c-andes" },
  olbo: { variante: "niebla-telefono", clase: "c-olbo", medio: { src: "/work/olbo/01-hoy-900.webp", w: 900, h: 1200 } },
  "banco-de-occidente": {
    variante: "oscura",
    clase: "c-bdo",
    medio: { src: "/work/banco-de-occidente/portal-dashboard.webp", w: 2271, h: 1715 },
  },
  "dc-medical": { variante: "oscura", clase: "c-dc" },
  makeapet: { variante: "magenta", clase: "c-mp" },
};

const SUPERFICIE = {
  "oscura-captura": "losa",
  "jelly-azul-cifras": "azul",
  "niebla-telefono": "niebla",
  oscura: "losa",
  magenta: "magenta",
} as const;

/**
 * Losa protagonista de un caso (`/work`; F3 la reutiliza en el tablero): un
 * solo protagonista por losa (captura, cifras, teléfono). `BentoCard` pone el
 * enlace a tamaño de card, nombrado por el título. Cifras por índice de KPI
 * (`home.cifrasCaso`), copy de 04 §3 (`i18n/paginas.ts`).
 */
export default function CardCaso({ slug, numero, locale }: { slug: Slug; numero: number; locale: Locale }) {
  const c = getCaseStudy(slug, locale)!;
  const t = paginasDict[locale].trabajo;
  const copy = t.losas[slug];
  const d = DISENO[slug];
  const exp = c.experienceId ? getCv(locale).experiences.find((e) => e.id === c.experienceId) : undefined;
  const resto = c.kind === "personal"
    ? `${t.propio} · ${copy.ceja}`
    : exp && !exp.end
      ? `${t.ahora} · ${exp.role}`
      : exp
        ? `${exp.company.name} · ${exp.start.year}–${exp.end?.year ?? ""}`
        : copy.ceja;
  const titulo = c.project.split(" — ")[0];
  const id = `caso-${slug}`;
  const cifras = cifrasCaso[slug].map((i, k) => ({ valor: c.kpis![i].value, etiqueta: copy.etiquetas[k] }));
  const num = `/${String(numero).padStart(2, "0")}`;

  const ceja = (
    <>
      <span className="num" data-num="" aria-hidden="true">
        {num}
      </span>
      {resto}
    </>
  );

  const cifra = (v: { valor: string; etiqueta: string }, tamano: "l" | "xl", clase?: string) => (
    <div className={["cifra", clase].filter(Boolean).join(" ")} key={v.etiqueta}>
      <DotMatrix valor={v.valor} tamano={tamano} etiqueta={`${v.valor} ${v.etiqueta}`} />
      <span className="etiqueta" aria-hidden="true">
        {v.etiqueta}
      </span>
    </div>
  );

  return (
    <li
      className={`losa-caso ${d.clase}`}
      data-grupo={grupoCaso(slug)}
      data-slug={slug}
      style={{ viewTransitionName: `caso-${slug}` }}
    >
      <BentoCard
        href={localePath(locale, `/work/${slug}`)}
        titulo={titulo}
        tituloId={id}
        ceja={ceja}
        superficie={SUPERFICIE[d.variante]}
        flecha={d.variante === "oscura-captura" || d.variante === "niebla-telefono" ? "tinta" : "blanca"}
      >
        <p className="apoyo">{copy.apoyo}</p>
        <MarcaLeido slug={slug} texto={t.leido} />
        {d.variante === "jelly-azul-cifras" ? (
          <>
            <div className="andes-cifras">
              {/* 400+ y 18 arriba, 2.000+ a lo ancho debajo (el orden de lectura sigue siendo natural). */}
              {[cifras[0], cifras[2], cifras[1]].map((v, k) => cifra(v, "l", k === 2 ? "ancho" : undefined))}
            </div>
            {c.nda && (
              <Etiqueta forma="chip" className="chip-nda">
                {t.nda}
              </Etiqueta>
            )}
          </>
        ) : (
          cifra(cifras[0], d.variante === "niebla-telefono" ? "xl" : "l")
        )}
        {d.medio && (
          <div className={d.variante === "niebla-telefono" ? "losa-media telefono" : "losa-media"} aria-hidden="true">
            <Image
              src={d.medio.src}
              alt=""
              width={d.medio.w}
              height={d.medio.h}
              sizes="(min-width: 1024px) 480px, 100vw"
              priority={d.variante === "oscura-captura"}
            />
          </div>
        )}
      </BentoCard>
    </li>
  );
}

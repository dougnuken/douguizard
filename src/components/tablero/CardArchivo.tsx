import LinkDiferido from "@/components/sistema/LinkDiferido";
import DotMatrix from "@/components/sistema/DotMatrix";
import { Icono } from "@/components/sistema/Iconos";
import Losa from "@/components/sistema/Losa";
import { archivo } from "@/data/home";
import { getCaseMeta, getCaseStudy } from "@/data/work";
import { localePath, type Locale } from "@/i18n/config";
import { paginasDict } from "@/i18n/paginas";
import { grupoCaso } from "@/lib/cuentas";

/**
 * K16 · «Más trabajo»: los casos cortos y el paralelo, en filas
 * `{número} · proyecto · cliente · año · Leer el caso`. El año es el de
 * inicio de `getCaseMeta()`. `/work` le pasa la numeración (P1-1).
 */
export default function CardArchivo({
  locale,
  numeroDesde,
  className,
}: {
  locale: Locale;
  /** Número visible de la primera fila (7 en `/work`). Sin él (tablero), sin `/NN`. */
  numeroDesde?: number;
  className?: string;
}) {
  const t = paginasDict[locale].trabajo;
  return (
    <Losa as="section" superficie="losa" className={["card-archivo", className].filter(Boolean).join(" ")} aria-labelledby="archivo-titulo" data-contenedor-filtro="">
      <div className="archivo-cab">
        <p className="ceja">{t.archivo.ceja}</p>
        <h2 id="archivo-titulo" className="t-losa">
          {t.archivo.titulo}
        </h2>
      </div>
      <ol className="filas">
        {archivo.map((slug, i) => {
          const c = getCaseStudy(slug, locale)!;
          const meta = getCaseMeta(slug, locale);
          const anio = meta.year.match(/\d{4}/)?.[0] ?? meta.year;
          return (
            <li key={slug} data-grupo={grupoCaso(slug)} data-slug={slug} style={{ viewTransitionName: `caso-${slug}` }}>
              <LinkDiferido href={localePath(locale, `/work/${slug}`)}>
                {numeroDesde !== undefined && (
                  <span className="num" data-num="">
                    /{String(numeroDesde + i).padStart(2, "0")}
                  </span>
                )}
                <b>{c.project.split(" — ")[0]}</b>
                <span className="cli">{meta.client}</span>
                <span className="anio">
                  <DotMatrix valor={anio} tamano="s" />
                </span>
                <span className="linea">{t.lineasArchivo[slug]}</span>
                <span className="accion">
                  <span>{t.archivo.leer}</span>
                  <Icono nombre="flecha" />
                </span>
              </LinkDiferido>
            </li>
          );
        })}
      </ol>
    </Losa>
  );
}

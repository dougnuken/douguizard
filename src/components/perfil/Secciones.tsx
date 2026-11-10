import Link from "next/link";
import { lockup } from "@/app/fonts/lockup";
import DotMatrix from "@/components/sistema/DotMatrix";
import Bandera from "@/components/sistema/Bandera";
import Estado from "@/components/sistema/Estado";
import Losa from "@/components/sistema/Losa";
import PasosCraft from "@/components/perfil/PasosCraft";
import MarqueeVivo from "@/components/perfil/MarqueeVivo";
import { getCv } from "@/data/cv";
import { getDatos, getMarcasPerfil, getOficioPerfil } from "@/data/perfil";
import { getSite } from "@/data/site";
import { logosMarcas } from "./logosMarcas";
import { getTestimonial, testimonials } from "@/data/testimonials";
import { getCaseMeta } from "@/data/work";
import { localePath, type Locale } from "@/i18n/config";
import { paginasDict } from "@/i18n/paginas";
import { latestExperience } from "@/lib/career";

/**
 * Las secciones de `/about` bajo la portada (07 F2, `about.html`), en orden:
 * «Lo que hago», «Cómo trabajo», «Datos» + «Con qué trabajo», «Dónde he
 * trabajado» y las citas. Todo de `perfil.ts`, `cv.ts`, `site.ts` y
 * `testimonials.ts`; el copy de los rótulos, de `i18n/paginas.ts`.
 */

const dos = (n: number) => String(n).padStart(2, "0");

/** «Lo que hago»: 3 losas, Sistemas en jelly azul (P1-13: número · 64 px · título · párrafo). */
export function LoQueHago({ locale }: { locale: Locale }) {
  const t = paginasDict[locale].perfil;
  const { hago: oficio } = getOficioPerfil(locale);
  return (
    <section className="seccion" aria-labelledby="perfil-hago">
      <div className="seccion-cab">
        <h2 id="perfil-hago" className="t-seccion">
          {t.hago}
        </h2>
      </div>
      <ul className="rejilla hago">
        {oficio.map((o, i) => (
          <Losa as="li" key={o.title} superficie={i === 1 ? "azul" : "losa"} className={i === 1 ? "hago-azul" : undefined}>
            <span aria-hidden="true">
              <DotMatrix valor={dos(i + 1)} tamano="m" />
            </span>
            <h3 className="t-losa">{o.title}</h3>
            <p className="apoyo">{o.body}</p>
          </Losa>
        ))}
      </ul>
    </section>
  );
}

/** «Cómo trabajo» (`#craft`): losa oscura, 4 nodos cosidos por el hilo; en secuencia al entrar en vista (G4, `PasosCraft`). */
export function ComoTrabajo({ locale }: { locale: Locale }) {
  const t = paginasDict[locale].perfil;
  const { pasos } = getOficioPerfil(locale);
  return (
    <Losa as="section" superficie="losa" className="seccion craft" id="craft" aria-labelledby="perfil-como">
      <h2 id="perfil-como" className="t-seccion">
        {t.como}
      </h2>
      <PasosCraft>
        {pasos.map((p, i) => (
          <li key={p.title}>
            <span className="nodo" aria-hidden="true" />
            <span aria-hidden="true">
              <DotMatrix valor={dos(i + 1)} tamano="m" />
            </span>
            <h3 className="t-losa">{p.title}</h3>
            <p className="apoyo">{p.body}</p>
          </li>
        ))}
      </PasosCraft>
    </Losa>
  );
}

/** «Datos» y «Con qué trabajo» (`getCv(locale).tools`). */
export function DatosPerfil({ locale }: { locale: Locale }) {
  const t = paginasDict[locale].perfil;
  const d = getDatos(locale);
  const s = getSite(locale);
  const actual = latestExperience();
  const filas: { dt: string; dd: React.ReactNode }[] = [
    { dt: t.rotulos.base, dd: d.base },
    { dt: t.rotulos.zona, dd: t.zonaValor },
    {
      dt: t.rotulos.ultimoRol,
      dd: (
        <>
          {actual.roleShort ?? actual.role} · <span translate="no">{actual.company.name}</span>
        </>
      ),
    },
    { dt: t.rotulos.disponible, dd: <Estado>{s.availability.note}</Estado> },
    {
      dt: t.rotulos.idiomas,
      dd: (
        <ul className="idiomas">
          {d.idiomas.map((l) => (
            <li key={l.codigo}>
              <Bandera pais={l.pais} />
              {l.nombre} ({l.nivel})
            </li>
          ))}
        </ul>
      ),
    },
  ];
  return (
    <div className="rejilla datos-fila seccion">
      <Losa as="section" superficie="losa" aria-labelledby="perfil-datos">
        <h2 id="perfil-datos" className="t-sub">
          {t.datos}
        </h2>
        <dl className="lista-datos">
          {filas.map((f) => (
            <div key={f.dt}>
              <dt>{f.dt}</dt>
              <dd>{f.dd}</dd>
            </div>
          ))}
        </dl>
      </Losa>
      <Losa as="section" superficie="losa" aria-labelledby="perfil-herramientas">
        <h2 id="perfil-herramientas" className="t-sub">
          {t.herramientas}
        </h2>
        <dl className="grupos">
          {getCv(locale).tools.map((g) => (
            <div key={g.id}>
              <dt>{g.label}</dt>
              <dd>
                <ul className="chips">
                  {g.items.map((it) => (
                    <li key={it} className="chip chip--losa">
                      {it}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Losa>
    </div>
  );
}

/**
 * «Dónde he trabajado»: carrusel marquee (solo CSS) con `getMarcasPerfil()` en
 * la voz Geologica. Dos copias de la lista para el bucle sin salto; la segunda
 * es `aria-hidden`. Con movimiento reducido queda la primera, en rejilla.
 * Cada marca es su logo SVG a una tinta (`logosMarcas.ts`, fuente de cada uno allí y en
 * INFORME-G3) con su nombre en `sr-only`; las que no tienen SVG público van como wordmark.
 */
function Marca({ nombre }: { nombre: string }) {
  const l = logosMarcas[nombre];
  if (!l) return <li>{nombre}</li>;
  return (
    <li>
      <svg className="logo-marca" viewBox={l.viewBox} aria-hidden="true" focusable="false" style={{ "--alto": `${l.alto}px` } as React.CSSProperties} fillRule={l.evenodd ? "evenodd" : undefined}>
        {l.trazos.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </svg>
      <span className="sr-only">{nombre}</span>
    </li>
  );
}

export function Marcas({ locale }: { locale: Locale }) {
  const t = paginasDict[locale].perfil;
  const marcas = getMarcasPerfil();
  return (
    <section className="empresas" aria-labelledby="perfil-empresas">
      <h2 id="perfil-empresas" className="ceja">
        {t.empresas}
      </h2>
      <MarqueeVivo className={`marquee ${lockup.fuente.variable}`} translate="no" role="group" aria-label={t.empresas} tabIndex={0}>
        <div className="marquee-pista">
          <ul className="marquee-lista marcas" role="list">
            {marcas.map((m) => (
              <Marca key={m} nombre={m} />
            ))}
          </ul>
          <ul className="marquee-lista marcas" role="list" aria-hidden="true">
            {marcas.map((m) => (
              <Marca key={m} nombre={m} />
            ))}
          </ul>
        </div>
      </MarqueeVivo>
    </section>
  );
}

/** Las tres citas, verbatim, con `lang` de origen; la del centro en magenta. */
export function Citas({ locale }: { locale: Locale }) {
  const t = paginasDict[locale].perfil;
  return (
    <section className="seccion" aria-labelledby="perfil-citas">
      <div className="seccion-cab citas-cab">
        <h2 id="perfil-citas" className="t-seccion">
          {t.citas}
        </h2>
        {t.citasMarca && <p className="etiqueta">{t.citasMarca}</p>}
      </div>
      <ul className="rejilla testimonios">
        {testimonials.map((base, i) => {
          const c = getTestimonial(base.id, locale)!;
          const cliente = c.caseSlug ? getCaseMeta(c.caseSlug, locale).client : undefined;
          return (
            <Losa as="li" key={c.id} superficie={i === 1 ? "magenta" : "clara"} data-cita={c.id}>
              <blockquote lang={c.quoteLang}>“{c.quote}”</blockquote>
              <p className="firma">
                <b>{c.author.name}</b>
                <span>
                  {c.author.role}, {c.author.company}
                </span>
                {c.caseSlug && cliente && (
                  <Link className="enlace-texto" href={localePath(locale, `/work/${c.caseSlug}`)}>
                    {t.leerCasoDe(cliente)}
                  </Link>
                )}
              </p>
            </Losa>
          );
        })}
      </ul>
    </section>
  );
}

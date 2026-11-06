import { Icono } from "@/components/sistema/Iconos";
import { eras, getTrayectoriaPortada } from "@/data/perfil";
import { localePath, type Locale } from "@/i18n/config";
import { paginasDict } from "@/i18n/paginas";
import { getCaseMeta } from "@/data/work";
import { aniosEnProducto, empresas, productosPropios } from "@/lib/cuentas";
import {
  acumuladosEn,
  eraEn,
  hitosTrayectoria,
  hoyDecimal,
  inicioEje,
  xDe,
} from "@/lib/trayectoria";
import TrayectoriaCliente from "./TrayectoriaCliente";

/**
 * Marca `html.exp-cine` antes del primer pintado (≥ 1024, sin RM, con JS): la
 * escena anclada en p = 0. Todo lo que cambia con p tiene su valor de p = 0 en
 * CSS (odómetro, tramos, era, hito activo, acumulados con guion), así que la
 * isla toma el control sin saltos.
 */
const INICIO = `try{if(matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches)document.documentElement.classList.add("exp-cine")}catch(e){}`;

const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

/**
 * `/experience` (07 F2, `experience.html`): ceja, `h1`, intro; contador
 * (odómetro Doto) y era `aria-hidden`; `<dl>` de acumulados; `<ol>` **completo**
 * con los 10 hitos de `lib/trayectoria.ts`; eje `aria-hidden` con eras, tramos
 * proporcionales, años y la pista de productos propios. El HTML es el estado
 * final (hoy): así se ve sin JS, sin GSAP, con RM.
 */
export default function Trayectoria({ locale }: { locale: Locale }) {
  const t = paginasDict[locale].trayectoria;
  const hoy = hoyDecimal();
  const hs = hitosTrayectoria(locale);
  const t0 = inicioEje(hs);
  const x = (y: number) => xDe(y, t0, hoy);
  const portada = getTrayectoriaPortada(locale, { anos: aniosEnProducto(), empresas: empresas() });
  const final = acumuladosEn(hoy, hs);
  const anioHoy = Math.floor(hoy);
  const anioIni = Math.floor(t0);
  const eraHoy = eraEn(hoy);
  const anios: number[] = [];
  for (let a = anioIni; a <= anioHoy; a += 2) anios.push(a);
  const propios = productosPropios();

  // La isla recibe solo números y rótulos cortos; los textos ya están en el HTML.
  const datos = {
    hoy,
    t0,
    hitos: hs.map((h) => ({ inicio: h.inicio, fin: h.fin, paralelo: h.paralelo })),
    acumulados: Array.from({ length: Math.ceil((hoy - t0) * 12) + 1 }, (_, k) => {
      const y = t0 + k / 12;
      const a = acumuladosEn(y, hs);
      return [a.anios, a.empresas, a.casos] as const;
    }),
    eras: eras.map((e) => e.desde),
    propios: propios.map((p) => Number.parseInt(getCaseMeta(p.slug, "en").year, 10)),
  };

  return (
    <section className="exp" aria-labelledby="exp-titulo">
      <script dangerouslySetInnerHTML={{ __html: INICIO }} />
      <div className="escena-t">
        <div className="exp-izq">
          <p className="ceja">{portada.ceja}</p>
          <h1 id="exp-titulo" className="t-seccion exp-h1">
            {portada.h1}
          </h1>
          <p className="apoyo exp-intro">{portada.intro}</p>
          <div className="contador" aria-hidden="true">
            <span className="odometro dot" data-dot="">
              {String(anioHoy)
                .split("")
                .map((d, i) => (
                  <span
                    className="col"
                    key={i}
                    style={{ "--d": d, "--d0": String(anioIni)[i] } as React.CSSProperties}
                  >
                    <span className="tira">
                      {"0123456789".split("").map((n) => (
                        <span key={n}>{n}</span>
                      ))}
                    </span>
                  </span>
                ))}
            </span>
            <span className="hoy-chip estado">{t.hoy}</span>
          </div>
          <p className="era" aria-hidden="true">
            {eras.map((e, i) => (
              <span key={e.id} data-era={i} className={i === eraHoy ? "hoy" : undefined}>
                {e.nombre[locale]}
              </span>
            ))}
          </p>
        </div>

        <div className="exp-der">
          <dl className="acumulados" aria-label={t.acumulados.label}>
            {(
              [
                ["anios", t.acumulados.anios, final.anios],
                ["empresas", t.acumulados.empresas, final.empresas],
                ["casos", t.acumulados.casos, final.casos],
              ] as const
            ).map(([k, et, v]) => (
              <div key={k} data-ac-losa={k}>
                <dt>{et}</dt>
                <dd className="dot dot--l" data-ac={k} data-dot="">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <ol className="hitos" aria-label={t.lista}>
            {hs.map((h, i) => (
              <li
                key={h.id}
                className={h.paralelo ? "hito paralelo" : "hito"}
                data-hito={h.id}
                data-i={i}
                style={{ "--dur": `${Math.max(8, Math.round((h.fin - h.inicio) * 40))}px` } as React.CSSProperties}
              >
                <span className="duracion" aria-hidden="true" />
                <p className="periodo">{h.paralelo ? `${h.periodo} · ${t.enParalelo}` : h.periodo}</p>
                <h2 className="t-losa">{h.titulo}</h2>
                <p className="rol">{h.rol}</p>
                <p className="logro">{h.logro}</p>
                {h.caso && (
                  <a className="ver-caso" href={localePath(locale, `/work/${h.caso}`)}>
                    <span>{h.nda ? t.verCasoNda : t.verCaso}</span>
                    <span className="sr-only">: {h.casoNombre}</span>
                    <Icono nombre="flecha" />
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="eje" aria-hidden="true">
          <div className="eje-pista">
            <div className="eras">
              {eras.map((e, i) => (
                <span key={e.id} data-era={i} style={{ left: pct(x(i === eras.length - 1 ? hoy : e.desde)) }}>
                  {e.nombre[locale]}
                </span>
              ))}
            </div>
            <div className="linea-eje">
              <i className="recorrido" />
              <i className="cabezal" />
            </div>
            <div className="tramos">
              {hs.map((h, i) =>
                h.paralelo ? null : (
                  <span
                    key={h.id}
                    className={x(h.fin) - x(h.inicio) < 0.045 ? "tramo corto" : "tramo"}
                    data-tramo={i}
                    style={{ left: pct(x(h.inicio)), width: pct(x(h.fin) - x(h.inicio)) }}
                  >
                    <i />
                    <b>{h.corto}</b>
                  </span>
                ),
              )}
            </div>
            <div className="anios">
              {anios.map((a) => (
                <span key={a} style={{ left: pct(x(a)) }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div className="propios">
            <span className="propios-et">
              {t.propios} · {anioHoy}
            </span>
            {propios.map((p) => (
              <span key={p.slug} className="propio" data-propio={p.slug}>
                {p.project.split(" — ")[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
      <TrayectoriaCliente datos={datos} />
    </section>
  );
}

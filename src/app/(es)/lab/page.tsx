import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "./lab.css";
import NameLockup from "@/components/marca/NameLockup";
import Wordmark from "@/components/marca/Wordmark";
import BentoCard from "@/components/sistema/BentoCard";
import Boton from "@/components/sistema/Boton";
import DotMatrix from "@/components/sistema/DotMatrix";
import Estado from "@/components/sistema/Estado";
import Etiqueta from "@/components/sistema/Etiqueta";
import Flecha from "@/components/sistema/Flecha";
import { Icono, IconosSprite, NOMBRES_ICONO } from "@/components/sistema/Iconos";
import Losa, { type Superficie } from "@/components/sistema/Losa";
import { getSite } from "@/data/site";
import { getDict } from "@/i18n/dictionaries";
import LabCorte from "./LabCorte";

/**
 * Laboratorio del sistema B (F1): catálogo de superficies, tipos, Doto,
 * botones, cards y el lockup del nombre. Interno: existe solo si el build se
 * hizo con `DG_LAB=1` (la página es estática, así que la variable se lee en el
 * build, no en `next start`). Sin ella, 404. No se indexa ni va en el sitemap.
 */
export const metadata: Metadata = {
  title: "Lab · sistema B",
  robots: { index: false, follow: false },
};

const SUPERFICIES: { s: Superficie; nombre: string }[] = [
  { s: "vacio", nombre: "vacío" },
  { s: "losa", nombre: "losa" },
  { s: "clara", nombre: "clara" },
  { s: "niebla", nombre: "niebla" },
  { s: "azul", nombre: "azul (jelly)" },
  { s: "magenta", nombre: "magenta (jelly)" },
  { s: "vidrio", nombre: "vidrio" },
];

/** Mínimo de contraste de cada texto de muestra (NOTAS §3 y 07 §0). */
const MINIMOS: Record<Superficie, { titulo: number; apoyo: number; etiqueta: number }> = {
  vacio: { titulo: 7, apoyo: 7, etiqueta: 4.5 },
  losa: { titulo: 7, apoyo: 7, etiqueta: 4.5 },
  clara: { titulo: 7, apoyo: 7, etiqueta: 4.5 },
  niebla: { titulo: 7, apoyo: 7, etiqueta: 4.5 },
  azul: { titulo: 4.5, apoyo: 4.5, etiqueta: 4 },
  magenta: { titulo: 4.5, apoyo: 4.5, etiqueta: 4.5 },
  vidrio: { titulo: 7, apoyo: 7, etiqueta: 4.5 },
};

const TIPOS = [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 120] as const;

export default function LabPage() {
  if (process.env.DG_LAB !== "1") notFound();
  const site = getSite("es");
  const t = getDict("es");

  return (
    <main id="main" className="lab">
      <IconosSprite />
      <div className="lab-ancho">
        <header className="lab-pila">
          <p className="ceja">Rediseño 2026 · F1</p>
          <h1 className="t-titular">Laboratorio del sistema B</h1>
          <p className="apoyo">
            Tokens, superficies, tipos, Doto, botones, cards y el lockup del nombre tal como los usarán F2–F7.
          </p>
        </header>

        <section className="lab-seccion" aria-labelledby="lab-nombre">
          <h2 id="lab-nombre">Nombre · «corte láser»</h2>
          <div className="lab-escena" data-lab="escena-xl">
            <div className="lab-laser" aria-hidden="true" />
            <NameLockup
              escala="xl"
              corte
              as="h2"
              laser=".lab-laser"
              className="lab-xl"
              style={{ "--lockup-xl": "clamp(48px, 14vw, var(--t-120))" } as React.CSSProperties}
            />
          </div>
          <LabCorte />
          <div className="lab-rejilla">
            <Losa superficie="vidrio" className="lab-pila">
              <p className="ceja">escala losa (K1)</p>
              <NameLockup escala="losa" decorativo />
              <p className="etiqueta">{site.rolCorto}</p>
            </Losa>
            <Losa superficie="losa" className="lab-pila">
              <p className="ceja">escala móvil</p>
              <NameLockup escala="movil" decorativo />
            </Losa>
            <Losa superficie="losa" className="lab-pila">
              <p className="ceja">wordmark de la cabecera</p>
              <div>
                <Wordmark locale="es" />
              </div>
            </Losa>
          </div>
        </section>

        <section className="lab-seccion" aria-labelledby="lab-superficies">
          <h2 id="lab-superficies">Superficies</h2>
          <div className="lab-rejilla">
            {SUPERFICIES.map(({ s, nombre }) => (
              <Losa key={s} superficie={s} className="lab-muestra" data-lab={`superficie-${s}`}>
                <p className="ceja" data-contraste-min={MINIMOS[s].etiqueta}>
                  {nombre}
                </p>
                <p className="t-losa" data-contraste-min={MINIMOS[s].titulo}>
                  Título de losa
                </p>
                <p className="apoyo" data-contraste-min={MINIMOS[s].apoyo}>
                  {s === "azul" || s === "magenta"
                    ? "Apoyo corto sobre jelly."
                    : "Un párrafo de apoyo de más de cuarenta caracteres, como los de las cards."}
                </p>
                <Etiqueta
                  tono={s === "azul" ? "azul" : s === "magenta" ? "magenta" : "neutra"}
                  className="lab-etq"
                >
                  <span data-contraste-min={MINIMOS[s].etiqueta}>Etiqueta tintada</span>
                </Etiqueta>
              </Losa>
            ))}
          </div>
          <div className="lab-rejilla">
            <Losa superficie="niebla" className="lab-muestra">
              <p className="ceja">647 de olbo</p>
              <span className="lab-verde" data-contraste-min={5}>
                <DotMatrix valor="647" tamano="l" />
              </span>
              <p className="apoyo">Pruebas en verde.</p>
            </Losa>
            <Losa superficie="azul" className="lab-muestra">
              <p className="ceja">Chip NDA</p>
              <Etiqueta forma="chip">
                <span data-contraste-min={7}>Caso NDA</span>
              </Etiqueta>
            </Losa>
            <Losa superficie="losa" className="lab-concentrico" data-lab="concentrico">
              <div aria-hidden="true" />
            </Losa>
          </div>
        </section>

        <section className="lab-seccion" aria-labelledby="lab-tipos">
          <h2 id="lab-tipos">Tipos</h2>
          <div className="lab-escala">
            {TIPOS.map((px) => (
              <div key={px}>
                <span className="micro">{px}</span>
                <span
                  style={{
                    fontSize: `var(--t-${px})`,
                    fontFamily: px >= 24 ? "var(--font-display-b)" : "var(--font-texto)",
                    fontWeight: px >= 24 ? 600 : 400,
                    letterSpacing: px >= 48 ? "-0.03em" : undefined,
                    lineHeight: 1.1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {px >= 24 ? "Dirijo el producto" : "Instrument Sans para texto y UI"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="lab-seccion" aria-labelledby="lab-doto">
          <h2 id="lab-doto">Doto · cifras y fechas (≥ 20 px)</h2>
          <div className="lab-fila">
            <DotMatrix valor="2026" tamano="s" />
            <DotMatrix valor="18" tamano="m" etiqueta="18 países" />
            <DotMatrix valor="2.000+" tamano="l" etiqueta="2.000+ ingenieros" />
            <DotMatrix valor="12" tamano="xl" etiqueta="12 años" />
          </div>
        </section>

        <section className="lab-seccion" aria-labelledby="lab-botones">
          <h2 id="lab-botones">Botones, estado, etiquetas e iconos</h2>
          <div className="lab-fila">
            <Boton href="/cv" variante="blanco" icono="flecha">
              Ver casos
            </Boton>
            <Boton href="/cv" variante="linea">
              Descargar CV (PDF)
            </Boton>
            <Boton variante="electrico">{t.sistema.nav.hablemos}</Boton>
            <Boton variante="blanco" grande>
              Botón grande
            </Boton>
          </div>
          <Losa superficie="clara" className="lab-fila">
            <Boton href="/cv" variante="tinta">
              Escríbeme
            </Boton>
            <Boton href="/cv" variante="linea-osc">
              Copiar correo
            </Boton>
            <Etiqueta tono="osc">Etiqueta sobre clara</Etiqueta>
          </Losa>
          <div className="lab-fila">
            <Estado>{t.sistema.disponible}</Estado>
            <Etiqueta forma="chip-losa">Chip sobre losa</Etiqueta>
            <Flecha />
            <Flecha variante="tinta" />
            <Flecha variante="osc" />
          </div>
          <div className="lab-fila" aria-label="Iconos del sprite">
            {NOMBRES_ICONO.map((n) => (
              <span key={n} className="lab-fila micro" style={{ gap: 6 }}>
                <Icono nombre={n} />
                {n}
              </span>
            ))}
          </div>
        </section>

        <section className="lab-seccion" aria-labelledby="lab-cards">
          <h2 id="lab-cards">Cards: reposo, hover y foco</h2>
          <div className="lab-rejilla lab-rejilla--cards">
            <BentoCard href="/work/olbo" tituloId="lab-card-1" titulo="olbo" ceja="Reposo" superficie="niebla" flecha="tinta">
              <p className="apoyo">Finanzas personales, construido con agentes que dirijo.</p>
            </BentoCard>
            <BentoCard
              href="/work/mercadolibre-andes"
              tituloId="lab-card-2"
              titulo="Andes"
              ceja="Hover (forzado)"
              superficie="azul"
              forzar="hover"
            >
              <DotMatrix valor="18" tamano="l" etiqueta="18 países" />
            </BentoCard>
            <BentoCard
              href="/work/naowee-suid"
              tituloId="lab-card-3"
              titulo="Naowee"
              ceja="Foco (forzado)"
              superficie="losa"
              forzar="foco"
            >
              <p className="apoyo">Plataforma del sector deportivo.</p>
            </BentoCard>
            <BentoCard href="/work/makeapet" tituloId="lab-card-4" titulo="MakeaPet" ceja="Magenta" superficie="magenta">
              <Etiqueta tono="magenta">App móvil</Etiqueta>
            </BentoCard>
          </div>
        </section>
      </div>
    </main>
  );
}

import "@/components/trabajo/trabajo.css";
import "./tablero.css";
import CardArchivo from "./CardArchivo";
import CardCaso from "./CardCaso";
import CardCifras from "./CardCifras";
import CardContacto from "./CardContacto";
import CardExperiencia from "./CardExperiencia";
import CardOficio from "./CardOficio";
import CardPerfil from "./CardPerfil";
import CardTestimonio from "./CardTestimonio";
import CarruselMovil from "./CarruselMovil";
import Contacto from "./Contacto";
import K1Retrato from "./K1Retrato";
import K2Claim from "./K2Claim";
import { getCaseMeta } from "@/data/work";
import { getTestimonial } from "@/data/testimonials";
import { localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { sistemaDict } from "@/i18n/sistema";
import { paginasDict } from "@/i18n/paginas";
import { citasHome, oracionDe, tableroDict } from "@/i18n/tablero";

/**
 * El OS del home B en su estado final (07 F3): el mismo que ven reduced-motion,
 * sin JS y, en F5, el final del acto 1. Orden del DOM = orden visual = Tab:
 * K2, K1, K3, K4, K5, [K7–K10], K11, K12, K13, K14, K15, K16, K17
 * (`grid-template-areas` por ancho: ≥ 1280, 1024–1279 de P0-1, < 1024 «app»).
 * Los títulos de sección (`h2`) se ven en móvil y son `sr-only` en escritorio.
 */
export function TableroArriba({ locale }: { locale: Locale }) {
  const t = tableroDict[locale];
  return (
    <div className="os os-top" id="os">
      <K2Claim locale={locale} />
      <K1Retrato locale={locale} />
      <h2 className="seccion-titulo">{t.secciones.trabajo}</h2>
      <CardCaso slug="naowee-suid" locale={locale} como="div" className="k3" seccion="work" prioridad={false} />
      {/* El chip dice lo mismo que el caso («Caso disponible a solicitud», `content 10.5`). */}
      <CardCaso slug="mercadolibre-andes" locale={locale} como="div" className="k4" chipNda={`NDA · ${getDict(locale).case.nda}`} />
      <CardContacto locale={locale} />
    </div>
  );
}

export function TableroResto({ locale }: { locale: Locale }) {
  const t = tableroDict[locale];
  const c = sistemaDict[locale].carrusel;
  const leer = paginasDict[locale].perfil.leerCasoDe;
  const carrusel = ["olbo", "banco-de-occidente", "dc-medical", "makeapet"] as const;
  const citas = citasHome.map(({ id, fragmento }) => {
    const q = getTestimonial(id, locale)!;
    const cliente = q.caseSlug ? getCaseMeta(q.caseSlug, locale).client : q.author.company;
    return {
      oracion: oracionDe(q.quote, fragmento),
      firma: `${q.author.name} · ${q.author.role}, ${q.author.company}`,
      enlace: { href: localePath(locale, `/work/${q.caseSlug}`), texto: leer(cliente) },
    };
  });
  const contador = (n: number) => Array.from({ length: n }, (_, i) => c.contador(i + 1, n));
  return (
    <div className="os os-resto" id="resto">
      <CarruselMovil
        total={carrusel.length}
        textos={{ anterior: c.anterior, siguiente: c.siguiente, contador: contador(carrusel.length), rol: c.rol, label: t.secciones.trabajo }}
      >
        {carrusel.map((slug, i) => (
          <CardCaso key={slug} slug={slug} locale={locale} como="div" className={`k${7 + i}`} />
        ))}
      </CarruselMovil>

      <h2 className="seccion-titulo">{t.secciones.experiencia}</h2>
      <CardExperiencia locale={locale} />
      <CardCifras locale={locale} className="tarjeta k12" enlace={{ href: localePath(locale, "/experience"), resto: t.k12.link }} />

      <h2 className="seccion-titulo">{t.secciones.perfil}</h2>
      <CardPerfil locale={locale} />
      <CardOficio locale={locale} />
      <CardTestimonio
        citas={citas}
        textos={{ ...t.k15, contador: contador(citas.length), rol: c.rol }}
      />
      <CardArchivo locale={locale} className="tarjeta k16" />

      <h2 className="seccion-titulo">{t.secciones.contacto}</h2>
      <Contacto locale={locale} />
    </div>
  );
}

import Link from "next/link";
import DotMatrix from "@/components/sistema/DotMatrix";
import Flecha from "@/components/sistema/Flecha";
import { nodosK11 as NODOS } from "@/data/home";
import { localePath, type Locale } from "@/i18n/config";
import { tableroDict } from "@/i18n/tablero";
import { currentExperience } from "@/lib/career";
import { hitosTrayectoria } from "@/lib/trayectoria";

/** K11 · trayectoria (8 × 2) → `/experience`. La línea es decorativa (`aria-hidden`). */
export default function CardExperiencia({ locale }: { locale: Locale }) {
  const t = tableroDict[locale].k11;
  const hitos = hitosTrayectoria(locale).filter((h) => h.id !== "uac" && !h.paralelo);
  const actual = currentExperience();
  const desde = Math.floor(hitos[0].inicio);
  return (
    <article className="losa losa--losa tarjeta k11" id="experience" data-seccion="experience">
      <div>
        <p className="ceja">{t.ceja}</p>
        <h3 className="t-losa">
          <Link href={localePath(locale, "/experience")} className="enlace-tarjeta">
            {t.titulo(desde, actual.roleShort ?? actual.role)}
            <span className="sr-only">{t.accion}</span>
          </Link>
        </h3>
      </div>
      <ol className="linea-tiempo" aria-hidden="true">
        {NODOS.map((n, i) => {
          const h = hitos.find((x) => x.id === n.ids[0])!;
          const ultimo = i === NODOS.length - 1;
          const cargo = n.ids[0] === "freelance" ? t.freelance : (n.cargo ?? h.rol);
          return (
            <li key={n.ids.join("+")} className={["nodo", n.caso && "caso", ultimo && "hoy", !n.movil && "solo-desk", n.prescindible && "prescindible"].filter(Boolean).join(" ")}>
              <DotMatrix valor={String(Math.floor(h.inicio))} tamano="s" />
              <i />
              <b>{n.empresa ?? h.corto}</b>
              <span>{cargo}</span>
            </li>
          );
        })}
      </ol>
      <Flecha />
    </article>
  );
}

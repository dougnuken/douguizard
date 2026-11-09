import Link from "next/link";
import Flecha from "@/components/sistema/Flecha";
import { getOficioPerfil } from "@/data/perfil";
import { localePath, type Locale } from "@/i18n/config";
import { tableroDict } from "@/i18n/tablero";

/** K14 · «Cómo trabajo» (4 × 3) → `/about#craft`: los cuatro pasos de `perfil.ts`. */
export default function CardOficio({ locale }: { locale: Locale }) {
  const t = tableroDict[locale].k14;
  const { pasos } = getOficioPerfil(locale);
  return (
    <article className="losa losa--losa tarjeta k14">
      <h3 className="t-losa">
        <Link href={localePath(locale, "/about#craft")} className="enlace-tarjeta">
          {t.titulo}
          <span className="sr-only">{t.accion}</span>
        </Link>
      </h3>
      <ol className="pasos">
        {pasos.map((p, i) => (
          <li key={p.title}>
            <span className="pasos-num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="pasos-titulo">{p.title.replace(/\.$/, "")}</span>
          </li>
        ))}
      </ol>
      <Flecha />
    </article>
  );
}

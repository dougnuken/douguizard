import Link from "next/link";
import "./marca.css";
import { lockup } from "@/app/fonts/lockup";
import { getSite } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

/**
 * «douguizard» de la cabecera B, en la misma voz que el nombre (TIPO.md: la
 * marca de la barra usa el lockup). Enlaza al inicio; su nombre accesible
 * empieza por el texto visible: «Douguizard — inicio» (`meta.homeLabel`).
 */
export default function Wordmark({ locale, className }: { locale: Locale; className?: string }) {
  const marca = getSite(locale).brand;
  return (
    <Link
      href={localePath(locale, "/")}
      aria-label={getDict(locale).meta.homeLabel(marca)}
      className={["wordmark", lockup.fuente.variable, className].filter(Boolean).join(" ")}
      style={{ fontVariationSettings: lockup.variaciones }}
    >
      <span className="wordmark-d" aria-hidden="true">
        d
      </span>
      <span>{marca.toLowerCase()}</span>
    </Link>
  );
}

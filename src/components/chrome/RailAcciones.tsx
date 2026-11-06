import "./chrome.css";
import { Icono } from "@/components/sistema/Iconos";
import { getSite } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { sistemaDict } from "@/i18n/sistema";
import { pdfCv } from "@/lib/cvPdf";

const SIGLA: Record<string, string> = { LinkedIn: "in", Behance: "Bē", GitHub: "gh" };

/**
 * Rail de acciones de escritorio (≥ 1024; NOTAS §1): Escríbeme · CV (PDF) ·
 * LinkedIn · Behance · GitHub · Volver arriba, en gris salvo el correo. Lo
 * montan el home y las páginas B (no `/cv` ni los casos).
 *
 * Es de servidor en F3: sin escena (F5) nunca está inerte, así que no necesita
 * JS. F5 lo vuelve isla para ponerle `inert` mientras p < 0,5 del ancla (P0-3).
 */
export default function RailAcciones({ locale }: { locale: Locale }) {
  const s = getSite(locale);
  const t = sistemaDict[locale].sistema.rail;
  return (
    <nav className="rail-acciones" aria-label={t.label}>
      <a className="rail-accion" href={`mailto:${s.email}`} data-tip={s.email} aria-label={t.correo(s.email)}>
        <Icono nombre="correo" />
      </a>
      <span className="rail-sep" aria-hidden="true" />
      <a href={pdfCv(locale)} download data-tip={t.cvTip} aria-label={t.cv}>
        <Icono nombre="bajar" />
      </a>
      {s.social.map((r) => (
        <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer" data-tip={`${r.label} ↗`} aria-label={t.externo(r.label)}>
          <span aria-hidden="true">{SIGLA[r.label] ?? r.label.slice(0, 2)}</span>
        </a>
      ))}
      <span className="rail-sep" aria-hidden="true" />
      <a href="#main" data-tip={t.arriba} aria-label={t.arriba}>
        <Icono nombre="arriba" />
      </a>
    </nav>
  );
}

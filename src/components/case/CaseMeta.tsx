import type { CaseMeta as CaseMetaType } from "@/data/work";
import type { Dict } from "@/i18n/dictionaries";

/**
 * La ficha de la portada (P1-5): `<dl>` de 2 columnas sin cajas, cada celda con
 * su filete superior. Orden Rol · Duración · Plataformas · Equipo, con Equipo a
 * todo el ancho y al final; las ausentes no se pintan y nada se desplaza en
 * escalera. «Año» sale de la ficha: Duración ya lo lleva (y, si la duración es
 * solo el año, la celda muestra el año, como antes).
 *
 * Rol, duración y equipo vienen de `getCaseMeta` (derivados de `cv.ts`);
 * Plataformas, del campo opcional `platforms` del caso.
 */
export default function CaseMeta({
  meta,
  platforms,
  t,
}: {
  meta: CaseMetaType;
  platforms?: string[];
  t: Dict["case"]["meta"];
}) {
  const celdas = [
    { clave: "rol", dt: t.role, dd: meta.role.replace(/ · /g, " · ") },
    { clave: "duracion", dt: t.duration, dd: meta.duration.trim() || meta.year },
    platforms?.length ? { clave: "plataformas", dt: t.platforms, dd: platforms.join(" · ") } : null,
    meta.team.trim() ? { clave: "equipo", dt: t.team, dd: meta.team } : null,
  ].filter((c): c is { clave: string; dt: string; dd: string } => c !== null);

  return (
    <dl className="ficha" data-ficha="">
      {celdas.map((c) => (
        <div key={c.clave} data-celda={c.clave} className={c.clave === "equipo" ? "ancho" : undefined}>
          <dt>{c.dt}</dt>
          <dd>{c.dd}</dd>
        </div>
      ))}
    </dl>
  );
}

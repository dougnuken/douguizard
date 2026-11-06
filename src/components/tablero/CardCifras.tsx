import DotMatrix from "@/components/sistema/DotMatrix";
import Losa from "@/components/sistema/Losa";
import { aniosEnProducto, casosPublicados, productosPropios } from "@/lib/cuentas";
import type { Locale } from "@/i18n/config";
import { paginasDict } from "@/i18n/paginas";

/**
 * «En cifras» (K12 del home, cabecera de `/work`): las tres cifras de
 * `lib/cuentas.ts`, en Doto, sobre la losa clara. Una lista de definición:
 * el lector oye «años en producto digital, 12».
 */
export default function CardCifras({ locale, className }: { locale: Locale; className?: string }) {
  const t = paginasDict[locale].trabajo;
  const cifras = [
    { k: "anios", v: aniosEnProducto(), et: t.cifras.anios },
    { k: "casos", v: casosPublicados(), et: t.cifras.casos },
    { k: "propios", v: productosPropios().length, et: t.cifras.propios },
  ];
  return (
    <Losa superficie="clara" className={["card-cifras", className].filter(Boolean).join(" ")}>
      <p className="ceja" aria-hidden="true">
        {t.enCifras}
      </p>
      <dl className="card-cifras-fila" aria-label={t.enCifras}>
        {cifras.map((c) => (
          <div key={c.k} className="cifra">
            <dt className="etiqueta">{c.et}</dt>
            <dd data-cifra={c.k}>
              <DotMatrix valor={String(c.v)} tamano="l" />
            </dd>
          </div>
        ))}
      </dl>
    </Losa>
  );
}

import "./paginas-b.css";
import { localePath, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import Boton from "@/components/sistema/Boton";

/**
 * El 404 de un caso que no existe (04 §4.5), en B. Se retira el «¿Perdido en
 * el espacio?»: era el mismo chiste en dos sitios y no ayudaba a seguir.
 */
export default function CaseNotFound({ locale }: { locale: Locale }) {
  const t = getDict(locale).case.notFound;
  return (
    <div className="pagina-b min-h-svh" data-404="caso">
      <div className="resplandor" aria-hidden="true" />
      <div className="pagina">
        <div className="contenido flex min-h-[calc(100svh-var(--cabecera)-96px)] max-w-[900px] flex-col justify-center">
          <p className="ceja">{t.kicker}</p>
          <h1 className="t-seccion mt-4">{t.title}</h1>
          <div className="mt-10">
            <Boton variante="blanco" href={localePath(locale, "/work")}>
              {t.back}
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
}

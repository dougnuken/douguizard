import { TableroArriba } from "@/components/tablero/Tablero";
import type { Locale } from "@/i18n/config";

/**
 * Contenedor del acto 1 + OS del home (07 §1.3). En F3 solo existe el estado
 * OS (el final, el que ven RM y sin JS): K1 lleva la foto y el vidrio CSS. F5
 * le suma el velo, el láser de escena, el `NameLockup` XL y «Desliza», y la isla
 * `EscenaCliente` que liga todo al scroll.
 */
export default function Escena({ locale }: { locale: Locale }) {
  return (
    <section className="escena" data-escena="os">
      <TableroArriba locale={locale} />
    </section>
  );
}

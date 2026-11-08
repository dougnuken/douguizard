import "./escena.css";
import NameLockup from "@/components/marca/NameLockup";
import { TableroArriba } from "@/components/tablero/Tablero";
import type { Locale } from "@/i18n/config";
import { sistemaDict } from "@/i18n/sistema";
import EscenaCliente from "./EscenaCliente";
import { SCENE_INIT } from "./sceneInit";

/**
 * Contenedor del acto 1 + OS del home (07 §1.3, F5).
 *
 * - Estado final (el de F3): el OS armado. Es lo que ven móvil, RM y sin JS.
 * - Acto 1 «cine» (≥ 1024 sin RM): el script en línea marca `html.cine` antes
 *   del primer pintado y el CSS pinta p = 0 sin JS de escena: la foto de K1 a
 *   pantalla completa con su vidrio, K2 de vidrio oscuro abajo a la izquierda,
 *   el `NameLockup` XL (decorativo: el `h1` es K2) con el corte sobre el láser,
 *   el velo y «Desliza». La pista (`.escena-pista`) suma 1 viewport de recorrido
 *   y la escena se queda pegada (`sticky`) mientras dura; `EscenaCliente` liga
 *   todo al scroll con GSAP (`import()` tras el `load`).
 */
export default function Escena({ locale }: { locale: Locale }) {
  return (
    <div className="escena-pista" data-escena-pista="">
      <script dangerouslySetInnerHTML={{ __html: SCENE_INIT }} />
      <section className="escena" data-escena="os">
        <TableroArriba locale={locale} />
        <NameLockup
          escala="xl"
          corte
          decorativo
          className="escena-nombre"
          style={{ "--lockup-xl": "var(--t-120)" } as React.CSSProperties}
        />
        <div className="escena-indicador" aria-hidden="true">
          <i />
          <span>{sistemaDict[locale].sistema.escena.desliza}</span>
        </div>
      </section>
      <EscenaCliente />
    </div>
  );
}

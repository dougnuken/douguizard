import type { CaseCopy } from "@/data/work";

/**
 * Every case, in Spanish.
 *
 * Only words live here. Slugs, numbers, media paths, links and KPI figures
 * stay in `work.ts` and are never repeated; lists that pair up with media or
 * figures — gallery, KPIs, process, features, links — are matched by position,
 * and `work.i18n.test.ts` fails if a list here and its English twin ever
 * disagree in length.
 *
 * Spanish figures use the Spanish separator (2.000, not 2,000), so a KPI value
 * is overridden only where its digits are written differently.
 */
export const workEs: Record<string, CaseCopy> = {
  olbo: {
    category: "Producto propio × Ingeniería de diseño",
    roleOverride: "Design Engineer — de punta a punta",
    duration: "Semanas, y sigue en marcha",
    team: "Doug, dirigiendo agentes de IA especializados",
    tagline:
      "Una app de finanzas personales que lee tu ritmo de gasto, no tu saldo. La versión 2.0 cambia una interfaz oscura y pesada por vidrio claro y en calma.",
    impact:
      "La 1.0 funcionaba y se había vuelto pesada. La 2.0 es marca e interfaz nuevas, en claro, con tinta y un solo acento lila, rehechas sin tocar la matemática: 647 pruebas en verde.",
    context:
      "Las apps de presupuesto responden «cuánto te queda», la pregunta que angustia. olbo es una PWA local-first en pesos colombianos cuyo semáforo compara el ritmo de gasto con el calendario. Funcionaba, pero la interfaz oscura y multicolor se había vuelto ruidosa. Así que rediseñé la marca y la UI, y conservé el producto.",
    contributions: [
      "**Marca 2.0**: claro en vez de oscuro, tinta y un solo acento lila, Urbanist y Manrope, y el Anillo Partido convertido en «Anillo y centro».",
      "**Interfaz 2.0**: vidrio sobre aurora con grano, un bento casi sin espacios, líneas vivas y el FAB como esfera IA, en las 24 vistas.",
      "**Dirigí la construcción**: agentes especializados en branding, UI, ejecución y QA, en sesiones encadenadas que se pasan el relevo con dos archivos.",
    ],
    kpis: [
      { label: "Pruebas que pasan", delta: "matemática del presupuesto intacta" },
      { label: "Dependencias", delta: "sin bundler, sin framework" },
      { label: "Sesiones encadenadas", delta: "cada fase cerrada por QA" },
      { label: "Color de acento", delta: "lila, con avaricia" },
    ],
    cover: {
      alt: "olbo 2.0 en un iPhone sostenido por una mano oscura sobre un fondo gris neutro: la pantalla Hoy, con la card de vidrio lila Tu dinero, la regla del mes y las losas lila y negra de Disponible y Gastado.",
    },
    film: {
      label:
        "Recorrido de olbo 2.0: Hoy con su card de vidrio y sus losas, la pestaña Análisis con el medidor del semáforo, el FAB abriéndose en Gasto e Ingreso, un gasto de 48.500 pesos digitado en el teclado, categorizado y guardado, Movimientos y el asesor.",
      caption:
        "Unos 34 segundos en la app real, servida en local con datos de demo neutros, a tamaño de iPhone. El círculo gris marca cada toque.",
    },
    story: [
      {
        title: "El problema",
        intro: "olbo 1.0 cumplía. El uso diario mostró que la interfaz le estorbaba.",
        sections: [
          {
            title: "Una 1.0 que funcionaba",
            body: [
              "Cada app que probé contaba centavos en la moneda de otro y respondía «cuánto te queda». olbo responde si el mes va a buen ritmo: el gasto frente a la parte del mes que ya pasó, verde hasta 1, ámbar hasta 1,25 y rojo por encima. Gastar el 90 % el día 28 está bien; el 80 % el día 10, no.",
              "Es una PWA instalable y sin conexión: módulos ES nativos, sin paso de build, los datos en IndexedDB dentro del celular. Nada sale del dispositivo salvo las llamadas a la IA, y una CSP estricta lo demuestra.",
            ],
          },
          {
            title: "Se quedó pesado",
            body: [
              "La 1.0 era morado oscuro, con un mesh multicolor y mucho glow. Cada pieza tenía su razón; juntas gritaban. El único color que importa, el del semáforo, competía con el gradiente firma del botón, del FAB y del orbe del asesor.",
              "El encargo que me puse para la 2.0 fue marca e interfaz, no funciones ni flujos: conservar todo lo que funciona y volverlo calmado.",
            ],
            figures: [
              {
                alt: "Dos iPhone lado a lado sobre gris con la misma pantalla Hoy y los mismos datos de demo: a la izquierda olbo 1.0, morado oscuro con un botón multicolor; a la derecha olbo 2.0, clara, con una card de vidrio lila y losas negra y lila.",
                caption: "Los mismos datos, antes y después: la 1.0 a la izquierda, la 2.0 a la derecha.",
              },
            ],
          },
          {
            title: "Referentes",
            points: [
              "**Bento casi sin espacios**: losas contiguas a 4–8 px, radios grandes y radio hijo = padre − espacio.",
              "**Minimalismo radical de color**: base neutra clara, negro casi puro para el contraste y un solo acento saturado, usado con avaricia.",
              "**Tipografía delgada y elegante**: cifras display enormes en peso 300 con tracking negativo.",
              "**Vidrio de verdad**: blanco translúcido sobre gradientes suaves, para que el desenfoque tenga algo que leer.",
            ],
          },
        ],
      },
      {
        title: "Marca 2.0",
        intro: "Papel perla, tinta negra y un solo punto lila: la plata ordenada se ve en calma.",
        sections: [
          {
            title: "Claro, no oscuro",
            body: [
              "Las referencias son claras, y la calma se lee mejor sobre papel que sobre neón. olbo 2.0 tiene un solo tema: base perla (#F0EFF2), tinta para el texto y el contraste (#1D1D1F) y el negro como segundo protagonista en las losas, el botón principal y el ítem activo del dock. El texto nunca va directo sobre el degradado; siempre tiene vidrio, papel o negro debajo.",
            ],
          },
          {
            title: "Lila, con avaricia",
            body: [
              "El verde, el ámbar y el rojo ya significan estado. Un acento lima se lee como «vas bien» y uno naranja como «cuidado», así que las únicas familias que no chocan con el semáforo son la azul y la violeta. El azul es el color de todos los bancos; el violeta ya era de olbo.",
              "En Colombia, Nu tiene el morado profundo y Nequi el magenta sobre berenjena. Un lila claro (#B49CFF) con tinta encima no es de nadie. Aparece una vez por pantalla, nunca como texto sobre claro (2,01:1 no pasa) y siempre con tinta encima (7,33:1).",
            ],
            figures: [
              {
                alt: "La card Tu dinero de olbo sobre una aurora lila y menta con grano: 9.680.700 pesos en tipografía delgada, los movimientos de hoy y la regla del mes con el chip negro de hoy.",
                caption: "Tu dinero: la card héroe, la única aurora de la app.",
              },
            ],
          },
          {
            title: "Urbanist y Manrope",
            body: [
              "Dos familias variables OFL, alojadas en la propia app. Urbanist en peso 300 compone las cifras display y el wordmark: geométrica, con las «o» redondas de verdad. Manrope compone la interfaz y todas las cifras que se alinean o cambian, siempre con números tabulares. El énfasis lo da el peso, nunca el color, y no hay itálicas.",
            ],
          },
          {
            title: "Anillo y centro",
            body: [
              "El Anillo Partido conserva su geometría, dos arcos de 140° que se deslizan uno junto al otro, y pierde las losas violetas y el halo. El trazo se adelgaza para conversar con la tipografía y aparece un punto lila en el medio: los arcos son la plata que entra y sale, y el punto eres tú, quieto en el centro. Es el único color de la marca.",
            ],
            figures: [
              {
                alt: "El ícono de olbo sobre gris: un cuadrado redondeado negro con dos arcos blancos y un punto lila en el centro, y el wordmark olbo debajo.",
                caption: "El ícono: losa negra, arcos blancos y el punto lila.",
              },
            ],
          },
        ],
      },
      {
        title: "Interfaz 2.0",
        intro: "Las mismas 24 vistas y los mismos flujos, redibujados en el nuevo lenguaje desde los tokens.",
        sections: [
          {
            title: "Vidrio sobre aurora, con grano",
            body: [
              "El fondo de la app es un degradado suave de perla a lavanda y menta, y las losas son vidrio blanco encima. La card Tu dinero es el único lugar donde la aurora se intensifica, con un grano fino para que el degradado se lea como material y no como efecto de pantalla.",
            ],
            figures: [
              {
                alt: "Una mano oscura sostiene un iPhone con la pantalla Hoy de olbo: Hola, Ana. Así va tu octubre, la card Tu dinero, Mi cartera, las pestañas Resumen y Análisis y las losas Disponible y Gastado sobre el dock grafito.",
                caption: "Hoy: una aurora, una losa lila, una losa negra.",
              },
            ],
          },
          {
            title: "Bento y contraste por bloques",
            body: [
              "Lo que queda por gastar va en la única losa lila de la pantalla, con tinta encima; lo gastado va en una losa negra con una barra fina por cada uno de los últimos diez días. Son contiguas, como en las referencias, y el contraste entre ellas hace el trabajo que antes hacía el color.",
            ],
            figures: [
              {
                alt: "Las dos losas de olbo flotando sobre una aurora suave: Disponible en lila con 6.855.700 pesos y 1.142.617 por día, y Gastado en negro con 1.924.300 y barras finas de los últimos días.",
                caption: "Disponible en lila, Gastado en negro.",
              },
            ],
          },
          {
            title: "Líneas vivas",
            body: [
              "Las gráficas son trazos finos de 1–2 px: una regla de marcas para el mes con un chip negro en hoy y barras por día en Movimientos en escala de raíz cuadrada, para que el arriendo no aplaste todo lo demás. Se dibujan al aparecer, solo con transform y opacity, y se quedan quietas con Reducir movimiento.",
            ],
            figures: [
              {
                alt: "Una mano sostiene un iPhone con Movimientos de olbo: búsqueda, filtros por mes, una losa de octubre de 2026 con 3.919.300 pesos y una barra fina por día, y los gastos del día debajo.",
                caption: "Movimientos: una barra fina por cada día del mes.",
              },
            ],
          },
          {
            title: "El FAB, una esfera IA",
            body: [
              "El gradiente firma sobrevive en un solo lugar: el FAB, ahora una pequeña esfera al final del dock grafito. Se abre en Gasto e Ingreso sobre papel, y es el único color en movimiento de una pantalla en calma.",
            ],
            figures: [
              {
                alt: "Plano detalle de la parte inferior de un iPhone: el dock grafito con Hoy activo y la esfera del FAB abierta en las píldoras Gasto e Ingreso, con poca profundidad de campo.",
                caption: "La esfera se abre en Gasto e Ingreso.",
              },
            ],
          },
          {
            title: "La captura sigue primero",
            body: [
              "La captura es donde mueren las apps de finanzas: si registrar cuesta esfuerzo, nadie registra. El rediseño conservó todas las entradas y le dio al teclado una cifra delgada en Urbanist con cursor, teclas hundidas y la categoría como píldora lila.",
            ],
            points: [
              "**Fotografía el recibo**: Claude lee total, comercio y categoría en una tarjeta que confirmas.",
              "**Di el gasto en voz alta**: una llamada a herramienta forzada, marcada para revisión si la confianza baja de 0,7.",
              "**Pega el mensaje del banco**: a propósito, sin modelo; un parser exacto que no puede inventarse un monto.",
              "**Lee el extracto de la tarjeta**: un PDF se vuelve fechas, tasa y cada compra a cuotas.",
            ],
            figures: [
              {
                alt: "Una mano oscura sostiene un iPhone con la hoja Nuevo gasto de olbo: 128.500 pesos en tipografía delgada, el teclado, píldoras de categoría con Supermercado elegida en lila y un botón negro Guardar gasto.",
                caption: "Nuevo gasto: la cifra, el teclado y una sola píldora lila.",
              },
              {
                alt: "Plano detalle de la parte inferior de un iPhone: la píldora lila de la categoría Supermercado y el botón negro Guardar gasto, con el altavoz y el puerto USB-C del teléfono enfocados debajo.",
                caption: "Guardar es negro y la categoría lila; nada más tiene color.",
              },
            ],
          },
          {
            title: "El semáforo conservó su significado",
            body: [
              "El verde, el ámbar y el rojo se re-tonaron para fondo claro y solo aparecen en el medidor, en el chip de estado y en la cifra del ritmo. Ingresos y gastos se distinguen por el signo y el ícono, no por el color, así que un rojo siempre es una advertencia y nunca una simple compra.",
            ],
            figures: [
              {
                alt: "Una mano sostiene un iPhone con la pestaña Análisis de olbo: un medidor punteado con un arco verde en el 14 % del sueldo y la frase Vas al ritmo del mes.",
                caption: "Análisis: el medidor es el único lugar donde aparece el verde.",
              },
              {
                alt: "Una mano sostiene un iPhone con la pantalla Personas de olbo: lo que cuesta cada persona este mes frente a un tope sano del ingreso neto, cada una con un chip verde Vas bien.",
                caption: "Personas: cada tope leído contra el mismo ritmo.",
              },
            ],
          },
          {
            title: "Asesor y onboarding",
            body: [
              "El orbe del asesor pasó a ser el símbolo de la marca, y sus respuestas van en burbujas de tinta y de vidrio. El onboarding perdió los renders 3D naranjas: cada paso es un titular delgado en Urbanist, una losa de vidrio con una pieza real de la app y una losa negra con el botón. Los puntos de progreso van en tinta y el actual en lila.",
            ],
            figures: [
              {
                alt: "Una mano oscura sostiene un iPhone con el asesor de olbo, Tu conciencia: el símbolo Anillo y centro, la frase Sin filtro. Te digo la verdad de tus números para que reacciones, tres preguntas sugeridas y el campo de texto.",
                caption: "El asesor: el símbolo es el orbe.",
              },
              {
                alt: "Una mano sostiene un iPhone con el primer paso del onboarding: Que no se te escape ni un peso, una losa de vidrio con un medidor en el 62 % del sueldo y un chip Vas bien, un gasto de ejemplo en café y un botón negro Continuar.",
                caption: "Onboarding: una pieza real de la app en cada paso.",
              },
            ],
          },
        ],
      },
      {
        title: "Cómo se construyó",
        intro: "Yo diseñé la dirección y la aprobé; agentes especializados la ejecutaron fase por fase.",
        sections: [
          {
            title: "Agentes especializados",
            points: [
              "**Branding**: los fundamentos de marca, la paleta con cada par de contraste calculado, la tipografía y el símbolo.",
              "**UI lead**: el sistema de UI y un tablero con cada pantalla y componente, aprobado antes de tocar código.",
              "**Ejecutores**: una fase cada uno; primero los tokens, luego el shell y después las vistas.",
              "**QA**: pruebas, CSP, contraste AA, objetivos de 44 pt y desborde a 390 px, cerrando cada fase.",
              "**Orquestador**: auditaba cada sesión, llevaba el estado y arrancaba la siguiente.",
            ],
          },
          {
            title: "Sesiones encadenadas",
            body: [
              "Cinco sesiones, una o dos fases cada una: tokens y shell, Hoy y captura, el resto de vistas, íconos y limpieza con un QA final, y estos mockups. Ninguna sesión releyó el historial: lo necesario vivía en un brief corto y en un archivo de estado vivo, que cada una actualizaba antes de pasar el relevo.",
              "Las reglas viajaban con ellas: cero hex fuera de los tokens, animación solo con transform y opacity, salto de versión con cada cambio de CSS o JS, y la confirmación de Doug antes de que algo llegue a main.",
            ],
          },
          {
            title: "Lo que no cambió",
            points: [
              "**La matemática del semáforo**: el módulo del presupuesto quedó vedado y sus pruebas siguieron en verde todo el tiempo.",
              "**Local-first**: los datos en IndexedDB dentro del celular; solo salen las llamadas a la IA.",
              "**Una CSP estricta**: cero estilos o scripts en línea, incluso dentro de los SVG.",
              "**Cero dependencias**: módulos ES nativos en 63 archivos y sin paso de build.",
            ],
          },
        ],
      },
      {
        title: "Resultados y aprendizajes",
        intro: "Qué se entregó y qué enseñó esta forma de trabajar.",
        sections: [
          {
            title: "Resultados",
            points: [
              "**Una marca nueva**: paleta, tipografía, Anillo y centro, el ícono de la app y el splash, todo documentado.",
              "**Las 24 vistas redibujadas** en vidrio claro, sin los fondos oscuros, los glows ni los renders 3D de antes.",
              "**647 pruebas en verde**, la matemática del presupuesto intacta y contraste AA en los estados y en la losa lila.",
              "**Capturas a 3x de la app real** con datos de demo, las mismas que usa cada imagen de este caso.",
            ],
          },
          {
            title: "Aprendizajes",
            points: [
              "**Un rediseño también resta.** Casi toda la 2.0 es lo que se fue: el fondo oscuro, los glows, el multicolor y tres tipografías.",
              "**Un solo acento solo funciona con reglas.** «Una vez por pantalla, nunca como texto sobre claro» es algo que un agente puede verificar.",
              "**Dos archivos le ganan a una memoria larga.** Un brief y un estado vivo dejan que cada sesión empiece limpia sin perder una decisión.",
              "**Protege la matemática, cambia la piel.** Dejar vedada la lógica del presupuesto es lo que permitió cambiar tanto la interfaz.",
            ],
          },
        ],
      },
    ],
    links: [{ label: "App en vivo" }, { label: "Código fuente" }],
    externalLink: { label: "App en vivo" },
    credits:
      "Marca, interfaz y dirección de producto de Doug Vargas; ingeniería de la 1.0 de punta a punta. La versión 2.0 la ejecutaron agentes de IA especializados, dirigidos y revisados fase por fase. Las escenas de los mockups se generaron con Higgsfield; cada pantalla en ellas es una captura o grabación real de la app.",
    technologies: [
      "Vanilla JS (módulos ES)",
      "PWA y Service Worker",
      "IndexedDB",
      "node --test",
      "CSP estricta",
      "Claude API",
      "Agentes de IA",
    ],
  },

  "naowee-suid": {
    project: "Naowee — Plataforma del sector deportivo",
    category: "GovTech × Deporte × Nativo de IA",
    duration: "En curso",
    team: "Producto, diseño e ingeniería",
    tagline:
      "Digitalizar cómo Colombia gestiona su deporte: más de 130 pantallas en 8 módulos, diseñadas y construidas con IA.",
    impact:
      "Una sola plataforma reemplaza hoy una pila de herramientas desconectadas, prototipada en código con IA.",
    context:
      "El sector deportivo colombiano funcionaba con papel, hojas de cálculo y sistemas aislados. Como Head of Product marco la dirección y construyo en código los prototipos que definen la plataforma: un solo sistema de diseño, con la IA en el proceso.",
    contributions: [
      "**Un solo sistema de diseño**: más de 38 componentes compartidos y un solo patrón de formulario por pasos mantienen coherente cada pantalla.",
      "**La jerarquía real del sector**: comités → federaciones → ligas → clubes → deportistas, modelada con aprobación en cascada.",
      "**Prototipos, no especificaciones**: construidos con Claude Code, Cursor y Gemini; los analistas aprueban el producto ya en marcha.",
    ],
    kpis: [
      { label: "Trámites digitalizados", delta: "antes en Word y correo" },
      { value: "~1.200", label: "Organizaciones deportivas en alcance" },
      { label: "Pantallas entregadas", delta: "en 8 de 13 módulos" },
      { label: "Componentes compartidos", delta: "un solo sistema de diseño" },
    ],
    process: [
      {
        title: "El sector funcionaba con archivos",
        body: "Los 30 trámites se movían por Word, correo y un gestor documental, GESDOC. Antes de dibujar una pantalla mapeé más de 45 estados y 15 roles: los estados eran el producto.",
      },
      {
        title: "Deportistas y eventos, modelados construyéndolos",
        body: "Un deportista aprobado hereda la liga y la federación de su club. Eventos, resultados y rankings entran por plantilla .xlsx en 83 deportes: las filas válidas cargan y las que fallan vuelven con su número de fila.",
      },
      {
        title: "Lo que se firma es el prototipo",
        body: "Cada módulo empieza como un prototipo clicable con roles y estados reales, revisado historia por historia en un recorrido guiado. El sistema de diseño es el contrato; la demo, la firma.",
      },
    ],
    decisions: [
      {
        title: "Un sistema, u ocho dialectos",
        body: "Ocho módulos, ocho fechas, ocho tentaciones de bifurcar. La regla: nada a la medida; se extienden los más de 38 componentes compartidos. Lo que se ve mal en revisión es un error, no una preferencia.",
      },
      {
        title: "La demo es el requisito, no el documento",
        body: "Cada quien lee distinto una especificación. Un prototipo que funciona saca los desacuerdos cuando son baratos y le entrega a ingeniería un objetivo resuelto. Funciona porque lo construyo yo.",
      },
      {
        title: "La jerarquía es el producto, no una tabla de consulta",
        body: "Una tabla plana de deportistas habría salido meses antes. Pero las aprobaciones bajan en cascada del Ministerio al club, y las medallas por liga solo significan algo si los vínculos son reales.",
      },
    ],
    video: {
      label: "IVC: una coordinadora asigna un trámite vencido a un profesional",
      caption:
        "Una coordinadora despeja un trámite vencido. El selector marca quién está sobrecargado; los contadores se recalculan en su sitio, de 6 pendientes a 5.",
    },
    // Paired by index with work.ts: venues, investment calls, then IVC.
    gallery: [
      {
        alt: "El espacio de trabajo del profesional en el trámite IVC-2026-005: 18 días de plazo junto a una lista de 7 documentos, cada uno citando el artículo del Decreto 1387/1970 al que responde, con validar, rechazar u observar por documento.",
        caption: "Cada documento revisado contra el artículo al que responde.",
      },
      {
        alt: "El registro georreferenciado de escenarios deportivos: un mapa coroplético de Colombia sombreado por departamento, con filtros de región, tipo de escenario, estado y CAR, junto a un ranking de departamentos y una leyenda de intensidad.",
        caption: "Los escenarios deportivos del país, departamento por departamento.",
      },
      {
        alt: "El perfil del escenario Centro deportivo Norte, con una insignia CAR: un carrusel de fotos sobre pestañas de información general, documentación e historial, con departamento, municipio, ficha catastral y coordenadas.",
        caption: "Un escenario: fotos, documentos y coordenadas.",
      },
      {
        alt: "El panel de administración de convocatorias: 1 de 7 convocatorias abierta, 33 postulaciones, 10 en etapa documental y 30,5 millones de pesos en inversión activa, sobre listas de postulaciones recientes y convocatorias activas.",
        caption: "Convocatorias de inversión, postulaciones y etapas en un solo panel.",
      },
      {
        alt: "Revisión del área técnica de la postulación RAD-2026-003: un aviso de área asignada con su SLA, una lista de chequeo arquitectónica donde cada ítem cita su artículo de la Resolución 933 y se marca como cumple o sin verificar, un avance de 4 de 6 y un panel con los documentos cargados.",
        caption: "Una de ocho áreas técnicas, revisada artículo por artículo.",
      },
    ],
    links: [{ label: "Sistema de diseño" }, { label: "Hub de demos" }],
    credits:
      "Head of Product en Naowee: marco la dirección de los módulos de negocio y construyo los prototipos que los definen, junto a analistas de negocio, un diseñador que lidero y los equipos de ingeniería.",
    technologies: [
      "Estrategia de producto",
      "Sistemas de diseño",
      "Claude Code",
      "Cursor",
      "Gemini",
      "UI generativa",
    ],
  },

  "mercadolibre-andes": {
    category: "Sistemas de diseño × E-commerce",
    duration: "~2 años",
    team: "400+ diseñadores, 2.000+ ingenieros",
    tagline:
      "Líder técnico del sistema de diseño detrás de Mercadolibre: 18 países, tres plataformas, una sola librería.",
    impact:
      "Los productos de comercio, fintech y envíos de Mercadolibre se construyen con una sola librería.",
    context:
      "Andes es la fuente de verdad de Mercadolibre. Estuve a cargo de sus fundamentos y de la definición de sus componentes, y llevé la IA a sus propias auditorías.",
    contributions: [
      "**Fundamentos**: tokens, espaciado, tipografía y movimiento, acordados una vez para regir toda la suite de productos.",
      "**Paridad multiplataforma**: una sola API por componente, acordada con ingeniería y lanzada idéntica en iOS, Android y Web.",
      "**Mantenimiento a escala**: adiciones, deprecaciones y migraciones en una librería que cientos de diseñadores abren a diario.",
      "**IA en la práctica de sistemas**: auditorías guiadas por prompts que detectan desviaciones en Figma antes de que salgan.",
    ],
    kpis: [
      { label: "Diseñadores en el sistema" },
      { value: "2.000+", label: "Ingenieros en el sistema" },
      { label: "Países" },
      { label: "Plataformas en paridad", delta: "iOS, Android, Web" },
    ],
    credits:
      "Líder técnico de Andes, trabajando con las organizaciones de diseño e ingeniería que construyen sobre él.",
    technologies: ["Figma", "Design Tokens", "Storybook", "Paridad multiplataforma", "Flujos con IA"],
    externalLink: { label: "Visitar ux.mercadolibre.com" },
  },

  "banco-de-occidente": {
    category: "Banca × Sistemas de diseño",
    duration: "5 años y 2 meses",
    team: "Equipos del banco y de Aval Digital Labs",
    tagline:
      "Uno de los bancos más grandes de Colombia: su portal rediseñado y Velocity, el sistema de diseño que compartían más de 12 squads.",
    impact:
      "Un portal denso, reconstruido como un solo producto liviano, sobre un sistema de diseño que hizo cada pantalla nueva más barata que la anterior.",
    context:
      "El portal era denso y difícil de recorrer, y cada squad resolvía los mismos problemas a su manera. Lo rediseñé y construí Velocity para resolver ambas cosas.",
    contributions: [
      "**Rediseñé el portal transaccional**: ingreso, cuentas, tarjetas, transferencias, pagos y bloqueo de productos, idéntico en escritorio, tableta y celular.",
      "**Construí Velocity, el sistema de diseño del banco**: de fundamentos a organismos, con diseño atómico para que el front end lo refleje.",
      "**Guardián del sistema de diseño**: aprobé adiciones, deprecaciones y patrones en los squads del banco, y dirigí los talleres y las críticas.",
    ],
    kpis: [
      { label: "Squads de producto alineados", delta: "un solo sistema" },
      { label: "Íconos ilustrados", delta: "dibujados para el sistema" },
      { label: "Áreas del sistema documentadas", delta: "de fundamentos a organismos" },
      { label: "Dispositivos, un solo portal", delta: "escritorio, tableta, celular" },
    ],
    process: [
      {
        title: "Investigación, después flujos",
        body: "Primero, descubrimiento e investigación competitiva y con usuarios. Después, seis flujos mapeados con sus excepciones antes de cualquier pantalla: en la banca, la excepción es el producto.",
      },
      {
        title: "Prototipos probados con personas",
        body: "Cada etapa se volvió un prototipo interactivo que los usuarios probaron antes de cualquier desarrollo; el registro pasó por varias rondas.",
      },
    ],
    decisions: [
      {
        title: "Dos capas de navegación, y no más",
        body: "El portal anterior enterraba a la gente en páginas anidadas. Un sistema de popups reemplazó la profundidad de navegación, y dos capas alcanzan para cada tarea bancaria.",
      },
      {
        title: "Idéntico entre dispositivos, no solo parecido",
        body: "El brief pedía una experiencia similar; la hicimos idéntica. Cada capacidad del escritorio llega al celular con los mismos nombres, en el mismo orden: nada que volver a aprender en el bus.",
      },
    ],
    // Paired by position with `work.ts`, which sets the order (cover first).
    gallery: [
      {
        alt: "El portal transaccional del Banco de Occidente en una tableta: una barra lateral con el nombre del cliente y su nivel de beneficios, tarjetas de una Mastercard y de una cuenta de ahorros con sus saldos, una fila de transacciones favoritas, un calendario del mes y un gráfico de gastos.",
        caption: "El inicio del portal: productos, transacciones favoritas y el mes de un vistazo.",
      },
      {
        alt: "Dos pantallas de iPhone lado a lado: el detalle de una Mastercard Black con pago mínimo, pago total y fecha límite sobre un botón de Pagar, y la pestaña de movimientos con compras con tarjeta, fechas, número de cuotas y montos.",
        caption: "En el celular: cada capacidad del escritorio, en el mismo orden.",
      },
      {
        alt: "La sección de cuentas del portal en una tableta: una tarjeta de cuenta de ahorros con saldo disponible, canjeable y actual, una tabla filtrable de movimientos con compras y transferencias y sus montos, y un aviso de éxito que confirma el bloqueo de una chequera.",
        caption: "Saldos, movimientos y la prueba de que el bloqueo funcionó.",
      },
      {
        alt: "La pantalla de ingreso del portal en una tableta: un aviso de cookies arriba, un panel promocional a la izquierda y una tarjeta de ingreso que pide tipo de documento, número de documento y contraseña, con enlaces para recuperar la contraseña y para registrarse.",
        caption: "Ingreso: tipo de documento, número de documento y contraseña.",
      },
      {
        alt: "Tableros de fundamentos del sistema dispuestos en perspectiva: una escala de color de azul claro a oscuro con secundarios neutros y dorados, una escala tipográfica del hero al caption, una escala de espaciado y hojas con los estados de botones y campos de formulario.",
        caption: "Fundamentos: color, tipografía, espaciado y cada estado de cada control.",
      },
      {
        alt: "El índice del sistema de diseño Velocity, de cinco columnas: Documentación, Fundamentos, Átomos, Moléculas y Organismos, con conceptos básicos, reglas de nombres, principios de escritura, grillas, espaciado, colores, tipografía, botones, inputs, controles, íconos, campos, desplegables, listas, tablas, encabezados, formularios, modales, selector de fecha y navegación por pestañas.",
        caption: "Velocity, indexado como se construye el front end.",
      },
      {
        alt: "Quince íconos ilustrados en línea azul y verde: un extracto, un puntaje de crédito, un certificado, un documento programado, un pin de ubicación, monedas apiladas, una alcancía, un pago con el celular, un mensaje en el celular, un celular con un más, un celular protegido, un celular con huella, una transacción fallida, una casa y una ventana de navegador.",
        caption: "Quince íconos dibujados para el sistema, no licenciados.",
      },
      {
        alt: "El sistema de popups dibujado como cuatro planos apilados en perspectiva, rotulados desde el fondo: la página, un fondo desenfocado, el componente y el popup.",
        caption: "Profundidad en vez de anidación: dos capas para cualquier tarea.",
      },
      {
        alt: "El flujo de registro y clave de un solo uso diagramado en cajas y flechas: registrarse, ingresar tipo y número de documento, enviar una clave de un solo uso, ingresarla o pedir otra por SMS, aceptar el tratamiento de datos y luego un ingreso exitoso o una falla de validación.",
        caption: "El registro, mapeado con sus excepciones antes de cualquier pantalla.",
      },
    ],
    links: [{ label: "Prototipo interactivo (Figma)" }, { label: "Caso en Behance" }],
    credits:
      "Sistema de diseño, dirección de arte y diseño UI: míos. La dirección de producto y la investigación UX estuvieron a cargo de los equipos del banco y del laboratorio. Publicado por **Aval Digital Labs**, Colombia, 2022.",
    technologies: ["Figma", "Sketch", "Diseño atómico", "Design tokens", "InVision", "Prototipado"],
  },

  "dc-medical": {
    category: "Operación clínica × Ingeniería de diseño",
    roleOverride: "Diseñador de producto e ingeniero de diseño — de punta a punta",
    duration: "En vivo desde el 21 sep 2026, en desarrollo activo",
    team: "Solo — producto, diseño, código",
    tagline:
      "El panel que maneja una clínica desde el celular de la secretaria. Ningún procedimiento empieza sin estar pagado.",
    impact:
      "Saber cuánto debía una paciente tomaba diez minutos abriendo archivos; ahora cada caso lo muestra junto al siguiente paso.",
    context:
      "La clínica de medicina estética de la que soy socio, en Barranquilla, funcionaba con WhatsApp, Google Calendar y un Drive compartido: todo escrito, nada conectado. Construí un panel encima de esas herramientas, no en su lugar.",
    contributions: [
      "**Tres fases con candado**: valoración, pago, procedimiento; la luz verde del procedimiento exige el pago completo, su recibo y el consentimiento firmado.",
      "**Despliegue seguro**: una versión de solo lectura desde el primer día; la edición llegó después, con acceso por persona y tras una auditoría de seguridad.",
      "**Reglas como funciones con pruebas**: saldos, comisiones de tarjeta, fechas y el cruce de nombres, cubiertos por 12 suites de pruebas.",
    ],
    kpis: [
      { label: "Días, del primer commit a la versión de hoy", delta: "19 sep → 2 oct 2026" },
      { label: "Fases con candado", delta: "valoración, pago, procedimiento" },
      { label: "Bases de datos nuevas", delta: "Drive y Calendar siguen siendo la fuente de verdad" },
      { label: "Suites de pruebas", delta: "dominio, contabilidad, worker, navegador" },
    ],
    cover: {
      alt: "El panel de DC Medical en un iMac plateado sobre un fondo gris neutro: el tablero de seguimiento, con la barra lateral, los contadores de valoraciones y procedimientos, los filtros por ciudad y la lista de controles por agendar.",
    },
    film: {
      label:
        "En el celular: una nota de voz llena el formulario de paciente nueva, la valoración toma una hora libre del calendario de la clínica y, al guardar, se abre el caso en la fase uno.",
      caption:
        "Unos 20 segundos en el panel real, a tamaño de iPhone. La nota de voz se escribe aquí para la grabación; datos de prueba, y reglas fijas hacen el papel de la IA.",
    },
    story: [
      {
        title: "El problema",
        intro: "Una clínica en tres ciudades, manejada desde WhatsApp, Google Calendar y un Drive compartido: todo escrito, nada conectado.",
        sections: [
          {
            title: "Todo escrito, nada conectado",
            body: [
              "Las pacientes llegan por WhatsApp, las citas viven en el calendario de la clínica y los pagos, consentimientos y controles en hojas de Drive llevadas a mano. Para saber cuánto debía una paciente, la secretaria abría archivo tras archivo: unos diez minutos por pregunta.",
              "Soy socio de la clínica, así que el encargo lo puse yo: un panel encima de esas herramientas, no en su lugar, igual de útil en recepción que en el celular.",
            ],
            figures: [
              {
                alt: "Un iMac plateado sobre gris con el tablero de seguimiento de DC Medical: la barra lateral con Seguimiento seleccionado, contadores de valoraciones, procedimientos y controles por reagendar, filtros por ciudad y la lista de controles con los días que le faltan a cada paciente.",
                caption: "Seguimiento: el día de la clínica en una pantalla.",
              },
            ],
          },
          {
            title: "Para quién es",
            points: [
              "**La secretaria** agenda, asesora y vende. No es técnica y muchas veces trabaja desde un carro, así que todo lo que ve está a un toque de WhatsApp, la historia clínica, el consentimiento o la hoja en Drive.",
              "**El médico** trabaja en Barranquilla, Bogotá y Medellín. Lee el día; no lo edita.",
              "**Los socios** revisan contabilidad e inventario, y necesitan cifras que cuadren con las hojas al peso.",
            ],
          },
          {
            title: "Primero se atacó el plan",
            body: [
              "Mapeé cómo funcionaba de verdad la clínica y luego sometí el plan a una revisión adversarial en datos, seguridad y factibilidad. Encontró las trampas que esconden las hojas, como un archivo con el nombre de una paciente y los datos de otra. Solo la tercera versión llegó al código.",
            ],
          },
        ],
      },
      {
        title: "Diseño",
        intro: "Un solo tablero con el día de la clínica: en un portátil en recepción o en un celular dentro de un carro.",
        sections: [
          {
            title: "El seguimiento, contado",
            body: [
              "La primera pantalla responde una pregunta: a quién le toca, quién no tiene fecha y quién se quedó atrás. Contadores arriba, una pestaña por tipo de trabajo, un filtro por ciudad y cada fila con los días que faltan, su estado y un botón de WhatsApp que abre la conversación.",
            ],
            figures: [
              {
                alt: "Un primer plano del borde inferior de la pantalla de un iMac, con poca profundidad de campo: filas de pacientes con control pendiente, su procedimiento, la fecha, una etiqueta de estado y los botones verdes de WhatsApp e Historia.",
                caption: "Cada fila termina en la acción que necesita.",
              },
              {
                alt: "La tarjeta de controles por gestionar en vidrio blanco sobre una aurora pastel menta, lila, rosa y cian: tres pacientes con su procedimiento, una etiqueta Reagendar, Mañana o En 2 días y un botón redondo verde de WhatsApp, y tres contadores de vidrio debajo.",
                caption: "La lista que la secretaria trabaja cada mañana.",
              },
            ],
          },
          {
            title: "Tres fases con candado",
            body: [
              "El trabajo de cada paciente es un caso en tres fases: valoración, pago y procedimiento. Cada fase lista lo que falta y lleva al formulario que lo resuelve, y el procedimiento solo se pone en verde con el pago completo, su recibo y el consentimiento firmado.",
              "El pie siempre nombra el siguiente paso, así que nadie tiene que acordarse de dónde quedó un caso.",
            ],
            figures: [
              {
                alt: "Un iMac sobre gris con un caso abierto en un panel lateral: el caso C-2026-0001, los tres pasos valoración, pago y procedimiento, el precio de la valoración y el formulario para registrar su pago con método, fecha y recibo.",
                caption: "Un caso, abierto en su primera fase.",
              },
              {
                alt: "Una tarjeta de vidrio sobre una aurora pastel: el caso C-2026-0001, el nombre de la paciente y su procedimiento, un chulo verde en Valoración, el paso 2 Pago resaltado en índigo, la valoración de 300.000 pesos pagada y el primer pago pendiente, y un deslizador de vidrio para registrar el primer pago.",
                caption: "Los tres pasos, y la única acción que hace avanzar el caso.",
              },
            ],
          },
          {
            title: "El celular reescribió la interfaz",
            body: [
              "La secretaria maneja la clínica desde un iPhone, muchas veces desde el carro. Por eso el panel se instala como app, las tablas se vuelven tarjetas, cada zona táctil mide al menos 44 píxeles y una nota de voz llena el formulario de paciente nueva.",
            ],
            figures: [
              {
                alt: "Una mano oscura sostiene un iPhone con el tablero de seguimiento en el celular: contadores como tarjetas pastel de valoraciones, procedimientos, controles por reagendar y esta semana, y debajo las pestañas y los filtros por ciudad.",
                caption: "El seguimiento en el celular: el mismo tablero, en tarjetas.",
              },
              {
                alt: "Una mano sostiene un iPhone con un caso abierto como hoja: el caso C-2026-0001, los tres pasos, el procedimiento y la fecha de valoración, y un botón índigo para registrar el pago de la valoración.",
                caption: "Un caso en el celular, con el siguiente paso como botón.",
              },
            ],
          },
          {
            title: "La marca, llevada al panel",
            body: [
              "La marca de la clínica es un monograma grafito y un logotipo delgado. El panel conserva los dos y suma una aurora pastel de menta, lila, rosa y cian, los mismos tonos de los contadores, sobre un tema claro que nunca cambia. La letra es Inter con cifras tabulares; el color se reserva para el significado.",
            ],
            figures: [
              {
                alt: "El monograma DC en un ícono de app grafito que flota sobre una aurora pastel y, debajo, una tarjeta de vidrio con el logotipo de DC Medical, la frase El panel de la clínica, en un solo lugar y etiquetas de Agenda, Pacientes, Contabilidad e Inventario.",
                caption: "El monograma grafito, y la aurora del panel.",
              },
            ],
          },
        ],
      },
      {
        title: "Construcción",
        intro: "Una primera versión de solo lectura, las reglas de la plata como funciones con pruebas, e IA solo donde ahorra digitar.",
        sections: [
          {
            title: "Primero leer, después escribir",
            body: [
              "La primera versión fue un artefacto de Claude de solo lectura, seguro para ponerlo frente a la clínica desde el primer día. La edición llegó después, con un usuario por persona y por rol, tras una auditoría de seguridad; en vivo desde el 21 de septiembre.",
            ],
            figures: [
              {
                alt: "Un iMac plateado con su pie sobre gris muestra la página de acceso del panel: el logotipo de DC Medical en un panel pastel con la frase El panel de la clínica, en un solo lugar, y el formulario Acceso al panel con usuario, contraseña y un botón índigo Entrar.",
                caption: "El acceso: un usuario por persona, permisos por área.",
              },
            ],
          },
          {
            title: "Plata real, y después pedidos reales",
            body: [
              "Los pagos reales trajeron reglas que ningún plan tenía: una tarjeta de crédito entra al 95\u00a0%, porque la clínica le traslada la comisión a la paciente. Los ingresos son caja por fecha de pago, y el mes muestra lo que entró, lo que salió y lo que aún se debe.",
              "Después la clínica empezó a pedir: cupos, agenda por ciudad, permisos. La mayoría salió en menos de un día.",
            ],
            figures: [
              {
                alt: "Un iMac sobre gris con la contabilidad de septiembre de 2026: contadores de neto, por pagar y por cobrar, los movimientos del mes y una columna de Atención con las cuentas vencidas y las pacientes que aún deben.",
                caption: "El mes en contabilidad: lo que entró, lo que vence y quién debe.",
              },
            ],
          },
          {
            title: "Una lista, un siguiente paso",
            body: [
              "La lista de casos pone a cada paciente en una línea: la fase, lo pagado frente al precio y el siguiente paso escrito, como cobrar la valoración o recibir el primer pago. Las mismas hojas alimentan todas las vistas, así que las cifras nunca se contradicen.",
            ],
            figures: [
              {
                alt: "Un iMac sobre gris con la lista de casos: la barra lateral con Casos seleccionado, contadores por fase y cada paciente con su procedimiento, un indicador de tres pasos y la fase en la que está.",
                caption: "Casos: cada paciente, su fase y lo que sigue.",
              },
            ],
          },
          {
            title: "IA donde ahorra digitar",
            points: [
              "**Una nota de voz que llena el formulario**: di quién llegó, para qué y qué pagó. El modelo llena el formulario y no guarda nada hasta que una persona lo revisa.",
              "**Recibos y facturas leídos por IA**: fotografía un recibo, una factura de proveedor o gastos de viaje, y los valores vuelven llenos para revisar y luego van al inventario o a la contabilidad del mes.",
              "**Los cupos del médico, listos para enviar**: el documento que la secretaria ya lleva se vuelve una semana de cupos en rojo y verde, avisa los días que caen en dos ciudades y se copia a WhatsApp.",
            ],
          },
        ],
      },
    ],
    decisions: [
      {
        title: "La hoja de cálculo sigue siendo la fuente de verdad",
        body: "Lo obvio era una base de datos real. Pero quien lleva la contabilidad trabaja en Drive todos los días, y la clínica no debía depender de mí. Si el panel se apaga mañana, no se pierde nada.",
      },
      {
        title: "Los saldos se leen, no se suman",
        body: "Cada fila de ingresos lleva el saldo que queda después de ese pago, así que sumar cuenta la deuda otra vez con cada abono. Una versión temprana reportó un saldo fantasma de treinta y ocho millones de pesos. Ahora manda la fila más reciente.",
      },
      {
        title: "Un color por ciudad, nunca solo",
        body: "El médico trabaja en tres ciudades: naranja para Barranquilla, azul para Bogotá, verde azulado para Medellín, validados para daltonismo. El nombre siempre va junto a su punto, así que nadie tiene que distinguir el verde azulado del azul.",
      },
    ],
    externalLink: { label: "Panel en vivo — acceso del personal" },
    technologies: [
      "Estrategia de producto",
      "HTML y Vanilla JS",
      "Tailwind CSS",
      "Cloudflare Workers",
      "Google Apps Script",
      "Google Drive y Calendar",
      "Claude (API y MCP)",
      "PWA",
      "Playwright",
      "node --test",
    ],
    credits:
      "Soy socio de la clínica junto al médico y construí el panel de punta a punta. El protocolo médico es suyo; el uso diario de la secretaria moldeó los flujos. Los mockups son el panel real compuesto sobre escenas de estudio generadas con IA; los nombres de pacientes que aparecen son ficticios.",
  },

  "royal-caribbean": {
    category: "Viajes × Móvil",
    duration: "1 año",
    team: "Equipo multifuncional EE. UU. + LATAM",
    tagline:
      "Reservas móviles y experiencias a bordo para huéspedes de crucero en rutas por el Caribe y el Mediterráneo.",
    impact:
      "Un solo recorrido móvil que acompaña al huésped desde la reserva hasta el desembarque, hecho para aguantar en altamar.",
    context:
      "Huéspedes de todas las edades, unos más cómodos con la tecnología que otros, pasan una semana a bordo con una conexión irregular. Diseñé la reserva y la experiencia a bordo para que les sirvieran a todos.",
    contributions: [
      "**Reservas móviles**: flujos para distintos destinos y tipos de camarote.",
      "**Experiencia a bordo**: horarios, restaurantes, excursiones y saldos que funcionan con un Wi-Fi intermitente.",
      "**Colaboración remota**: con producto e ingeniería en la sede de Royal Caribbean en Estados Unidos.",
    ],
    technologies: ["Sketch", "iOS", "Android", "Prototipado", "Colaboración intercultural"],
  },

  qrvey: {
    category: "SaaS × Encuestas y NPS × Automatización",
    duration: "11 meses",
    team: "Producto e ingeniería",
    tagline:
      "Un constructor de automatizaciones para encuestas —disparador, condición, acción— para personas que nunca habían dibujado un diagrama de flujo.",
    impact:
      "Una respuesta negativa podía disparar su propio seguimiento —una nueva encuesta una semana después y los resultados por correo al equipo— sin nadie pendiente de ello.",
    context:
      "Qrvey era una plataforma de encuestas y NPS, pero alguien todavía tenía que hacer algo con las respuestas. Como diseñador UI principal, diseñé AutomatiQ, el constructor que se encargaba de eso.",
    contributions: [
      "**Una lista que informa sobre sí misma**: cada proceso muestra su estado, las encuestas que cubre, el tiempo promedio de ciclo y los ciclos que ha ejecutado.",
      "**Tarjetas, no un lienzo**: disparadores y condiciones se abren en su sitio, con las palabras del producto; sin conectores que dibujar.",
      "**El seguimiento es la siguiente encuesta**: los correos llevan los resultados y un enlace activo a una encuesta en el cuerpo.",
    ],
    // Paired by position with `work.ts`, which sets the order (cover first).
    gallery: [
      {
        alt: "La pestaña de Automatización de Qrvey: un botón de Crear proceso sobre una lista de tarjetas de procesos, cada una con una barra de estado de color que dice En ejecución o En pausa, su nombre y fecha de creación, y tres cifras: encuestas cubiertas, tiempo promedio y ciclos ejecutados. Una barra lateral ofrece encuestas de ejemplo y consejos.",
        caption: "Cada proceso: en ejecución o en pausa, y lo que ha hecho.",
      },
      {
        alt: "Una condición bajo un disparador de Respuesta nueva: dos pastillas, Si la respuesta es y Número de respuestas, sobre un panel con una pregunta y sus filas de respuestas con botones para agregar o quitar cada una, y una fila de Seleccionar acción esperando debajo.",
        caption: "Condiciones con las palabras del producto: «If Answer Is», «# of Responses».",
      },
      {
        alt: "Una tarjeta de disparador de Programación expandida: frecuencia de repetición, un intervalo en días y una hora del día, una fecha de inicio y un final que es un número de ejecuciones o una fecha específica.",
        caption: "Programación, con las dos formas en que puede terminar.",
      },
      {
        alt: "Un disparador de Respuesta nueva con su selector de encuestas abierto: una lista buscable de encuestas, cada fila con una insignia de Activa o Borrador y la fecha en que se activó.",
        caption: "Elegir la encuesta cuyas respuestas inician el proceso.",
      },
      {
        alt: "La acción Enviar correo abierta: chips de destinatarios, un asunto con el conteo de caracteres restantes, un mensaje de texto enriquecido con botones para adjuntar resultados o insertar una encuesta, un enlace a una encuesta insertado en el cuerpo y un bloque de adjunto con la encuesta elegida.",
        caption: "Correo: resultados adjuntos y una encuesta en el cuerpo.",
      },
      {
        alt: "Un proceso completo armado a partir de un escenario escrito en lenguaje simple arriba: un disparador de respuesta nueva, una condición sobre la respuesta dada y dos acciones de correo —una a quien respondió con una encuesta de seguimiento y otra al equipo con los resultados— sobre un botón de Guardar cambios que advierte que guardar reinicia el proceso.",
        caption: "Un escenario: disparador, condición y dos acciones.",
      },
    ],
    technologies: ["Sketch", "Sistemas de diseño", "Diseño de interacción", "Visualización de datos"],
    externalLink: { label: "Visitar qrvey.com" },
  },

  ideaware: {
    project: "Diseño UX multicliente",
    category: "Agencia × Multicliente",
    duration: "1 año",
    team: "Agencia distribuida",
    tagline:
      "Wireframes, UI kits y prototipos para clientes de Estados Unidos y Latinoamérica, en web y móvil.",
    impact:
      "Diseño listo para desarrollo en fintech, marketplaces y B2B: la soltura entre dominios que después hizo natural el trabajo en sistemas de diseño.",
    context:
      "Una agencia remota, donde el trabajo era aprender rápido el dominio de cada cliente y entregar un diseño limpio.",
    contributions: [
      "**Wireframes y UI kits**: para productos fintech, de consumo y B2B.",
      "**Prototipos de alta fidelidad**: para validar con stakeholders y entregar a desarrollo.",
      "**Patrones reutilizables**: aplicados entre clientes y ajustados a cada uno.",
    ],
    technologies: ["Sketch", "InVision", "Wireframing", "Prototipado"],
  },

  chub: {
    category: "iOS × Movilidad",
    clientOverride: "Proyecto freelance paralelo",
    roleOverride: "Diseñador de producto — de punta a punta",
    team: "Diseño en solitario, entregado a un equipo de desarrollo",
    tagline:
      "Reserva un carro por minuto, conoce el costo de antemano y después controla la cabina.",
    impact:
      "Un flujo de reserva que responde lo que las apps de alquiler suelen esconder —qué carro es y cuánto cuesta el viaje— antes de que te comprometas.",
    context:
      "Chub reserva un carro, no un viaje: eliges un vehículo, ves su autonomía y su tarifa por minuto, y cuando arranca el viaje la app se convierte en los controles de la cabina.",
    contributions: [
      "**La decisión en una sola tarjeta**: autonomía, aceleración, puestos y la tarifa por minuto, encima del botón.",
      "**Una ruta con precio**: recogida, destino, tiempo estimado y un rango de tarifa, para que la última pantalla no traiga sorpresas.",
      "**Una sola app, de la reserva a la cabina**: en pleno viaje controla el aire acondicionado y los asientos ventilados, y muestra la temperatura y la velocidad.",
    ],
    // Paired by position with `work.ts`, which sets the order (cover first).
    gallery: [
      {
        alt: "La ficha de un vehículo sobre el mapa: el modelo con su calificación, una fila de especificaciones con aceleración, autonomía y puestos, su dirección de recogida y distancia, la tarjeta guardada, un precio por minuto y un botón de Book Car.",
        caption: "Autonomía, tarifa y distancia antes del botón.",
      },
      {
        alt: "La ruta dibujada sobre un mapa oscuro con un marcador de distancia, y un panel debajo con la recogida y el destino, la clase de servicio, un rango de tarifa, el tiempo estimado de viaje, la tarjeta guardada y un botón de Need Assistance.",
        caption: "Con precio y tiempo antes de empezar.",
      },
      {
        alt: "El panel dentro del carro: chips para el aire acondicionado y los asientos ventilados, temperatura interior y exterior, un indicador circular en 65 km/h con el selector de cambios alrededor y una línea que dice que el aire acondicionado está encendido.",
        caption: "En marcha, la app es la cabina.",
      },
      {
        alt: "La primera pantalla de Chub: el logotipo sobre un carro dibujado en un anillo luminoso, la frase «Choose a Vehicle and trip with style» y un botón de Get started sobre un enlace de Skip.",
        caption: "Primer uso: el producto en una pantalla.",
      },
    ],
    technologies: ["Sketch", "iOS", "Prototipado", "Entrega a desarrollo"],
    credits:
      "Diseño de producto de punta a punta, entregado al equipo de desarrollo que lo construyó. Nunca se lanzó.",
  },

  makeapet: {
    category: "Producto propio × iOS, Android y PWA",
    roleOverride: "Diseño UX/UI y dirección de producto",
    duration: "Octubre de 2026",
    team: "Doug, dirigiendo un equipo de 10 agentes de IA",
    tagline:
      "Tinder para mascotas: de cinco pantallas en Figma a una app real para iOS, Android y web.",
    impact:
      "Cinco pantallas de Figma se convirtieron en una app completa: un solo código para iOS, Android y PWA, más de 680 tests en verde y contraste AA en todas las pantallas.",
    context:
      "Encontrar compañeros de juego para tu perro o tu gato depende del parque al que vas y de la suerte. MakeaPet lleva la mecánica que todo el mundo ya entiende, deslizar a la derecha si te gusta, al mundo de las mascotas: descubres perros y gatos cerca, haces swipe y, si el interés es mutuo, chateas con el dueño para quedar.",
    contributions: [
      "**Investigación y UX**: el problema, los usuarios, la arquitectura de información y todos los flujos más allá de las cinco pantallas originales.",
      "**Sistema de diseño**: tokens, movimiento físico, una capa de vidrio y accesibilidad AA, escritos como reglas que un agente puede verificar.",
      "**Dirigí la construcción**: un equipo de 10 agentes de IA con roles separados, y cada fase cerrada con revisión de diseño, código y seguridad.",
    ],
    kpis: [
      { label: "Tests automatizados", delta: "60 suites, en verde" },
      { label: "Agentes de IA dirigidos", delta: "un rol cada uno" },
      { label: "Código", delta: "iOS, Android y PWA" },
      { label: "Contraste en cada pantalla", delta: "corregido en los tokens" },
    ],
    links: [{ label: "Demo en vivo" }],
    cover: {
      alt: "MakeaPet en un iPhone sostenido por una mano oscura sobre un fondo gris neutro: la pantalla de swipe, con una akita llamada Candy en una tarjeta rosa y el sello LIKE.",
    },
    film: {
      label:
        "Recorrido de MakeaPet: inicio, un swipe a la derecha con el sello LIKE, It's a Match, Say woof, el primer mensaje escrito, una pata como reacción en una burbuja, el mapa Nearby y un perfil con varias mascotas.",
      caption:
        "Unos 38 segundos en la app real: la PWA de producción en modo demo, a tamaño de iPhone. El círculo gris marca cada toque.",
    },
    story: [
      {
        title: "Investigación",
        intro:
          "Antes de cualquier pantalla: qué problema, para quién, frente a qué referentes y qué apuestas tenía que hacer el producto.",
        sections: [
          {
            title: "El problema",
            body: [
              "Los dueños que buscan compañía para su mascota dependen del azar: el mismo parque, las mismas horas, quien coincida. No hay una forma simple de ver quién está cerca y si se llevarían bien.",
              "El reto no era solo la idea. Era convertir un diseño de cinco pantallas en Figma en una app completa, idéntica en iOS y Android, con un movimiento que se sintiera físico y sin perder fidelidad al diseño original.",
            ],
            figures: [
              {
                alt: "Una mano oscura sostiene un iPhone con la pantalla de swipe: una akita llamada Candy, 2, en una tarjeta rosa a mitad de arrastre con el sello LIKE, otra tarjeta detrás y los botones de descartar y like.",
                caption: "El swipe con el sello LIKE: la pantalla de la que cuelga todo el producto.",
              },
            ],
          },
          {
            title: "Para quién es",
            points: [
              "**Dueños de perros o gatos** que buscan compañía de juego o de paseo para su mascota, cerca de casa.",
              "**Dueños con varias mascotas**, por ejemplo un perro y un gato. Cada mascota tiene sus propios matches, así que necesitan elegir con cuál hacen swipe.",
            ],
          },
          {
            title: "Referentes",
            body: [
              "El referente fue un patrón, no otra app de mascotas. Las apps de citas ya enseñaron a millones de personas la gramática: deslizar a la derecha, match mutuo y luego chat. MakeaPet conserva la gramática y cambia el tema.",
              "Las guías de interfaz de Apple y su material Liquid Glass pusieron el listón de navegación y profundidad. El de fidelidad lo puso el propio Figma de Doug: cinco pantallas, medidas valor por valor.",
            ],
          },
          {
            title: "Hipótesis",
            points: [
              "**Un gesto aprendido no necesita tutorial.** Si el swipe se comporta como enseñaron las apps de citas, la gente lo usa desde la primera tarjeta.",
              "**En una app de swipe, la foto es el producto.** Una mascota sin foto no debería existir.",
              "**Nadie comparte dónde vive por un juego.** Los dueños solo aparecerán en un mapa si este nunca delata su ubicación.",
              "**Los matches son de la mascota; el chat, de los dueños.** Dos mascotas, dos identidades, una sola cuenta.",
            ],
          },
        ],
      },
      {
        title: "Diseño",
        intro:
          "Figma como fuente de verdad, todo lo nuevo en el mismo lenguaje y cada valor convertido en token.",
        sections: [
          {
            title: "Arquitectura de información",
            body: [
              "Cuatro pestañas: Home, Match, Chats y Profile. El mapa no es una pestaña propia. Figma ya tenía el control For you / Nearby en Match, así que Nearby pasó a ser el mapa: dos vistas de los mismos candidatos, que es justo para lo que sirve un control segmentado.",
              "Home se queda como un feed para explorar sin decidir; Match es donde se decide. El ícono de Profile es la foto de la mascota activa, para que siempre sepas con quién estás haciendo swipe.",
            ],
            figures: [
              {
                alt: "Una mano sostiene un iPhone con la pantalla de inicio: ubicación, búsqueda, un banner morado Pet lover? con botón Donate, las categorías Cats y Dogs y tarjetas de mascotas cercanas.",
                caption: "Inicio: la pantalla original de Figma, recreada con los valores medidos.",
              },
              {
                alt: "Una mano sostiene un iPhone con la ficha de Candy: una foto a sangre, su nombre y distancia, recuadros de edad, raza, sexo y peso, una sección About y un botón Bark me!.",
                caption: "La ficha de la mascota: lo que una foto no puede contar.",
              },
            ],
          },
          {
            title: "Flujos",
            points: [
              "**Primera apertura**: entrar con Apple, Google o email, luego el dueño y después la mascota en cinco pasos.",
              "**Swipe → match → Say woof!** → el chat se abre con una primera frase sugerida.",
              "**Nearby**: el mapa, la tarjeta de una mascota y su ficha completa.",
              "**Perfil**: mis mascotas, cambiar la mascota activa, editar, ajustes y textos legales.",
            ],
            figures: [
              {
                alt: "Una mano sostiene un iPhone con la pantalla de registro: un collage de fotos de mascotas, el título Let's get started y botones para continuar con Apple, Google o email.",
                caption: "Registro: Apple, Google o email, y luego una mascota en cinco pasos.",
              },
            ],
          },
          {
            title: "Un sistema de diseño con tokens",
            body: [
              "Nada de valores sueltos. Colores, espaciado en escala de 4 pt, radios concéntricos, sombras, tipografía y duraciones de animación viven como tokens. Una sola fuente incrustada, Inter, para que iOS y Android dibujen las mismas letras.",
              "Un color o un número escrito a mano en un componente se trata como un defecto, y un agente auditor de diseño los busca al cerrar cada fase.",
            ],
          },
          {
            title: "Movimiento físico",
            points: [
              "**Swipe**: la tarjeta sigue al dedo con rotación, aparecen los sellos LIKE y NOPE y sale con la velocidad del gesto. Los botones ✕ y ♥ hacen el mismo movimiento.",
              "**Match**: las dos fotos entran, el corazón late y los emojis flotan con resorte.",
              "**Bienvenida**: el collage entra escalonado y luego se desplaza despacio, en parallax.",
              "Todas las animaciones corren en el hilo de interfaz (worklets de Reanimated) y respetan **Reducir movimiento**.",
            ],
            figures: [
              {
                alt: "Plano detalle de la parte inferior de un iPhone: los botones de descartar y like sobre el final de una tarjeta y la barra de pestañas, con poca profundidad de campo.",
                caption: "Descartar y like: los botones mueven la tarjeta igual que el dedo.",
              },
              {
                alt: "Una mano sostiene un iPhone con la pantalla It's a Match: Congratulations, dos fotos de mascotas inclinadas a cada lado de un corazón, corazones y emojis flotando y un botón Say woof!.",
                caption: "It's a Match: fotos, corazón y emojis con resorte.",
              },
            ],
          },
          {
            title: "La capa de vidrio",
            body: [
              "Con la base resuelta, encima llegó una capa de vidrio: un componente GlassSurface con niveles definidos, una barra de pestañas tipo Liquid Glass con una gota que se estira entre pestañas, el selector de mascota y las hojas. Las huellas de vidrio se volvieron un recurso gráfico de la marca.",
              "La tarjeta del swipe se quedó sin vidrio, como en Figma: la foto tiene que mandar.",
            ],
            figures: [
              {
                alt: "Primer plano en blanco y negro de un perro, con un aviso de match en vidrio encima: It's a Match, Rocky and Candy liked each other, y un botón morado Say woof!.",
                caption: "El aviso de match, en vidrio.",
              },
              {
                alt: "Una hoja de vidrio sobre un degradado morado con huellas de vidrio: Swipe as…, con Rocky, el akita, seleccionado, Kira, la British Shorthair, y una fila Add a pet.",
                caption: "Swipe as…: una píldora abre el selector entre mascotas.",
              },
            ],
          },
          {
            title: "Accesibilidad AA",
            body: [
              "Dos colores del diseño no pasaban AA. El gris secundario se oscureció (#978DAD → #766B8F) y el texto sobre los botones naranja pasó de blanco a un marrón oscuro (#4A1D06). El degradado naranja de Figma no se tocó.",
              "En el chat, la burbuja propia es morado sólido porque el degradado no llegaba a AA. Los toques miden 44 pt como mínimo, cada botón de ícono tiene etiqueta, cada gesto tiene un botón o una acción de lector de pantalla como alternativa y el texto escala hasta el 200 %.",
            ],
            figures: [
              {
                alt: "Una mano sostiene un iPhone con una conversación entre dos dueños: burbujas moradas sólidas a la derecha, blancas a la izquierda y el campo para escribir.",
                caption: "Tus burbujas son morado sólido: el degradado no llegaba a AA.",
              },
            ],
          },
          {
            title: "Decisiones clave y sus porqués",
            points: [
              "**Foto obligatoria.** Una mascota no se puede registrar sin al menos una. En una app de swipe la foto es el producto, y exigirla elimina todos los estados «sin foto» del selector, los avatares y el mazo.",
              "**Mapa con privacidad.** Nunca muestra la ubicación exacta: cada dueño se ajusta a una rejilla de unos 400 m y, en la base de datos, la coordenada exacta solo la lee su dueño. El mapa es monocromo para que el color lo pongan las fotos.",
              "**Varias mascotas, un swipe claro.** Una píldora de vidrio con la mascota activa abre Swipe as…, con los matches nuevos de cada una. Si el dueño tiene una sola mascota, la píldora no aparece.",
              "**Paridad iOS / Android.** La misma fuente incrustada, íconos SVG propios, una sola implementación de sombras y el mismo motor y estilo de mapa en las dos.",
            ],
            figures: [
              {
                alt: "Una mano sostiene un iPhone con el mapa Nearby: un mapa monocromo en rejilla con un radio morado, marcadores con fotos de mascotas, un filtro Within 2 km y la tarjeta de Bruno, un bulldog francés, con botones View profile y like.",
                caption: "Nearby: un mapa monocromo, aproximado a propósito.",
              },
              {
                alt: "Una mano sostiene un iPhone con el perfil del dueño: Daniel, una zona aproximada y My pets con Rocky marcado como Active y Kira al lado, más el número de mascotas, matches y chats.",
                caption: "Un dueño, varias mascotas, una activa a la vez.",
              },
            ],
          },
        ],
      },
      {
        title: "Desarrollo",
        intro:
          "Doug no escribió el código: su trabajo fue dirigir al equipo que lo hizo y escribir las reglas que tenía que cumplir.",
        sections: [
          {
            title: "Dirigir un equipo de 10 agentes de IA",
            body: [
              "Cada agente tenía un rol: arquitecto, UX, UI, Figma, planificador, ejecutor, QA, auditor de diseño, revisor de código y seguridad. Cada fase se planificó, se construyó y se revisó en diseño, código y seguridad antes de cerrarse: 58 commits pequeños, uno o varios por fase.",
              "Un archivo de traspaso guardaba el estado, las decisiones y el siguiente paso entre sesiones, así que ningún agente empezaba de cero.",
            ],
          },
          {
            title: "Un solo código: iOS, Android y PWA",
            body: [
              "Expo y React Native con rutas por archivo. Gestos y animación en el hilo de interfaz con Reanimated; MapLibre con el mismo estilo monocromo en las dos plataformas; las mismas sombras en todas partes. La PWA es el mismo código, desplegado en Vercel desde la rama principal.",
            ],
            film: {
              label:
                "El mismo recorrido en un iPhone sostenido por una mano oscura: swipe, match, chat, mapa y perfil.",
              caption: "La misma grabación, en la mano.",
            },
          },
          {
            title: "Modo demo sin backend",
            body: [
              "La app entera funciona con datos locales, así que el QA y este portafolio nunca dependen de credenciales. Supabase (autenticación, Postgres con PostGIS, tiempo real y almacenamiento) va detrás de las mismas interfaces de repositorio, y una única batería de tests de contrato corre contra los dos.",
            ],
          },
          {
            title: "Calidad automatizada",
            points: [
              "**Más de 680 tests** en 60 suites, en verde.",
              "**QA visual con Playwright** a 390 × 844: cada pantalla en cada estado, carga, vacío, error, sin conexión y texto grande.",
              "**Revisión en cada fase**: reglas de diseño, código y seguridad, cada una con su propio agente.",
            ],
          },
        ],
      },
      {
        title: "Resultados y aprendizajes",
        intro: "Qué salió, y qué enseñó esta forma de trabajar.",
        sections: [
          {
            title: "Resultados",
            points: [
              "**Las cinco pantallas de Figma recreadas** y ampliadas a una app completa: bienvenida, registro, alta de mascota en cinco pasos, inicio, swipe con filtros, mapa, ficha, match, chats, conversación, perfil, mis mascotas, edición, ajustes y textos legales.",
              "**Más de 680 tests automatizados** y capturas de QA de cada pantalla y estado.",
              "**PWA publicada en Vercel**, que se despliega sola desde la rama principal.",
              "**58 commits pequeños**, con cada fase cerrada por una revisión de diseño, código y seguridad.",
            ],
            figures: [
              {
                alt: "Plano detalle de la pantalla de un iPhone al empezar un chat: las mascotas del match, respuestas sugeridas Woof! y What's Toby's favorite toy?, y un primer mensaje ya escrito.",
                caption: "Una primera frase sugerida, para que el match se vuelva conversación.",
              },
            ],
          },
          {
            title: "Aprendizajes",
            points: [
              "**Dirigir agentes también es diseñar.** La calidad salió de reglas escritas (tokens, toques de 44 pt, contraste AA, Reducir movimiento) y de roles separados que revisan cada fase, no de pedir que quede bonito.",
              "**Si el diseño no pasa AA, se ajusta el token, no la pantalla.** Corregir dos tokens arregló todas las pantallas a la vez y dejó el cambio documentado.",
              "**El modo demo paga dos veces.** Sirve para el QA automatizado y para el portafolio: cada pantalla de este caso es la app real, sin backend.",
              "**Primero la base, después el vidrio.** El vidrio funcionó porque llegó sobre una base sólida, no en lugar de ella.",
            ],
            figures: [
              {
                alt: "El ícono de MakeaPet, una huella blanca con un corazón sobre un degradado de morado a rosa, rodeado de huellas de vidrio flotando sobre un fondo gris.",
                caption: "El ícono, con las huellas de vidrio.",
              },
            ],
          },
        ],
      },
    ],
    technologies: [
      "Figma",
      "Expo + React Native",
      "Reanimated",
      "MapLibre",
      "Supabase",
      "Playwright",
      "Agentes de IA",
    ],
    credits:
      "Investigación, diseño UX/UI y dirección de producto de Doug Vargas. El código lo escribió un equipo de agentes de IA, dirigido y revisado por Doug fase por fase. Las escenas de los mockups se generaron con Higgsfield; cada pantalla que aparece en ellas es una captura o grabación real de la app.",
  },
};

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
    team: "Solo — diseño, ingeniería, lanzamiento",
    tagline:
      "Una PWA de finanzas personales que te dice si vas a buen ritmo, no cuánto te queda: cero dependencias, 634 pruebas, en producción.",
    impact:
      "Una PWA de finanzas en vivo e instalable, con 634 pruebas que pasan en 292 ms y cero dependencias: diseñada e implementada de punta a punta, con la IA en el proceso, sin nada desechable.",
    context:
      "Las apps de presupuesto responden «cuánto te queda», la pregunta ansiosa. Construí olbo para mi propio hogar: una PWA local-first en pesos colombianos cuyo centro es un semáforo que lee el ritmo de gasto contra el día del mes.",
    contributions: [
      "**Dirección de producto e interfaz**: 24 vistas, desde el tablero del semáforo hasta la captura con IA que lee un recibo fotografiado, una frase dicha en voz alta o un extracto en PDF.",
      "**Capa de dominio pura**: la matemática del presupuesto no tiene DOM, ni base de datos, ni reloj propio; 634 pruebas corren en Node en 292 ms.",
      "**Cero dependencias**: módulos ES nativos que el navegador ejecuta tal como están escritos; sin bundler, sin framework, sin paso de build.",
      "**Privacidad verificable**: una CSP estricta limita la app a sí misma más api.anthropic.com, así que la promesa local-first se puede leer en el encabezado.",
    ],
    kpis: [
      { label: "Pruebas que pasan", delta: "en 292 ms" },
      { label: "Dependencias", delta: "sin bundler, sin framework" },
      { label: "Módulos JS", delta: "en 24 vistas" },
      { label: "Relación pruebas-código", delta: "6.400 líneas de pruebas" },
    ],
    process: [
      {
        title: "El problema era mío",
        body: "Construí olbo porque lo necesitaba. Cada app de presupuesto que probé respondía la pregunta equivocada —cuánto queda— y la respondía en la moneda de otro, con centavos, para el mes de otro. En Colombia llega el sueldo, los gastos fijos muerden y lo que queda tiene que estirarse. Yo quería pesos enteros, un español que sonara a casa y mis datos quedándose en mi propio teléfono. Así que lo planteé primero como producto: una pantalla que me diga si voy bien y una captura que tome segundos.",
      },
      {
        title: "Ritmo en vez de saldo",
        body: "La decisión central fue dejar de medir el saldo y empezar a medir el ritmo. El avance es el día sobre los días del mes; el ritmo es el gasto variable sobre el bolsillo variable; la razón entre los dos elige el color. Verde hasta uno, ámbar hasta 1,25, rojo por encima. Gastar el 90 % del bolsillo el día 28 está bien; el 80 % el día 10, no. El mismo gasto cambia de color con el calendario, así que la app dejó de castigar el consumo y empezó a coreografiar el tiempo.",
      },
      {
        title: "Hecho con IA, con disciplina de producción",
        body: "Trabajé con Claude como pareja y me negué a que el resultado fuera desechable. Sin dependencias, sin paso de build. La capa de dominio se mantiene pura —sin DOM, sin IndexedDB, sin window— y «hoy» siempre se inyecta, nunca un Date.now() dentro de la matemática. Esa sola restricción es la que permite que 634 pruebas corran en Node en 292 ms sin ningún navegador. La IA escribía rápido; las pruebas decidían qué sobrevivía. Cada commit está en español, con voz de producto, y describe comportamiento, no código.",
      },
      {
        title: "Lanzar, y después escuchar",
        body: "Después lo lancé: una PWA en GitHub Pages, instalable, sin conexión, con el service worker ya en la v150. El uso diario mostró lo que ninguna especificación habría mostrado: un error de zona horaria que dañaba el color de noche al oeste de Greenwich, recibos y extractos que me negué a volver a digitar, una interfaz que pasé a oscuro cuando la vi en la mano después del atardecer. Cada cosa se volvió una decisión, una prueba y un salto de versión. La app sigue moviéndose porque la uso todos los días y me avisa cuando se equivoca.",
      },
    ],
    decisions: [
      {
        title: "El semáforo lee ritmo, no saldo",
        body: "El saldo responde una pregunta ansiosa. El ritmo responde una que se puede accionar. El color compara tu ritmo de gasto con cuánto ha avanzado el mes: una razón de hasta 1 es verde, hasta 1,25 ámbar y por encima, rojo. Es una decisión de producto, no técnica: implica aceptar que el mismo monto puede ser tranquilo o alarmante según la fecha, y confiar en el calendario para decir cuál.",
      },
      {
        title: "Las facturas variables nunca reservan plata",
        body: "Los gastos fijos de monto variable —luz, agua, gasolina— no reservan su estimado. Reservar parece prudente, y esa es la trampa: reservar de más produce un rojo que no es cierto, y un solo rojo falso basta para dejar de creerle al color. Así que una factura variable solo pesa cuando registras lo que de verdad costó. La credibilidad del semáforo está por encima de su cautela.",
      },
      {
        title: "Privacidad que se puede comprobar, no solo leer",
        body: "Local-first es una promesa que todos hacen. Yo hice esta verificable: una Content-Security-Policy estricta permite scripts y estilos solo de la propia app y limita connect-src a 'self' más api.anthropic.com. Nada más puede salir del dispositivo, y cualquiera puede leer el encabezado para confirmarlo. Me costó todos los estilos en línea, incluso dentro de los SVG, y fue el precio correcto.",
      },
    ],
    featuresIntro:
      "La captura es donde mueren las apps de finanzas. Si registrar un gasto cuesta esfuerzo nadie lo registra, y sin datos no hay ritmo que leer ni semáforo; por eso olbo toma el gasto como llegue: una foto, una frase en voz alta, un mensaje del banco, un extracto completo.",
    features: [
      {
        title: "Fotografía el recibo",
        body: "Apunta la cámara a un recibo y Claude te devuelve el total en pesos enteros, el comercio y una categoría tomada de tu propia lista, en una tarjeta de revisión que confirmas antes de guardar nada. Funciona con tu propia clave de Anthropic, guardada en el dispositivo, mostrada enmascarada y excluida de los respaldos.",
      },
      {
        title: "Di el gasto en voz alta",
        body: "Mantén el micrófono y habla: «cincuenta mil en el mercado». Reconocimiento de español colombiano en el dispositivo y luego Claude con la llamada a herramienta forzada, así que la respuesta siempre es un movimiento estructurado —monto, tipo, comercio, categoría, cuenta— y no prosa libre. Reporta su propia confianza; por debajo de 0,7 la tarjeta se marca para revisión.",
      },
      {
        title: "Pega el mensaje del banco",
        body: "Las alertas del banco siguen una plantilla, así que esta función no usa ningún modelo, a propósito: un parser exacto lee los dos formatos del banco —uno escribe 50,000.00 y el otro $100.000— sin conexión, al instante, gratis y sin forma de inventarse un monto. Un atajo de iOS le pasa el mensaje directo a la app.",
      },
      {
        title: "Lee el extracto completo de la tarjeta",
        body: "Dale un extracto en PDF y vuelve como datos estructurados: fechas de corte y de pago, la tasa convertida de anual a mensual, total, saldo y cada compra a cuotas con su plazo restante. El archivo se descifra y se renderiza en el teléfono, y la CSP no permite otro destino que api.anthropic.com.",
      },
      {
        title: "Una conciencia que responde",
        body: "El asesor ve tus números reales y responde en español colombiano sin rodeos: un comentario corto por cada gasto que registras y una sala a pantalla completa donde puedes preguntar. Recibe los factores de cuotas de cada producto, así que calcula lo que de verdad cuesta una compra en intereses, y lo dice cuando falta una tasa.",
      },
      {
        title: "La billetera: lo que debes, lo que te deben",
        body: "Tarjetas, créditos y servicios en un solo portafolio, ordenable por lo que vence primero y no por nombre. Los préstamos entre personas van en las dos direcciones —plata que prestaste y plata que debes—, con abonos registrados contra el saldo, una barra de avance e intereses estimados por mes y por año.",
      },
    ],
    video: {
      label:
        "Grabación de olbo: un gasto de 120.000 pesos digitado en el teclado propio de la app, categorizado y guardado; luego el tablero y la lista de movimientos se recalculan.",
      caption:
        "El piso al que llega toda captura: 120.000 pesos en cuatro toques, el saldo descontándose y el ritmo recalculado antes de que la hoja termine de cerrarse.",
    },
    gallery: [
      {
        alt: "Tablero de olbo con el semáforo en verde: el ritmo de gasto está en o por debajo de la parte del mes que ya pasó.",
        caption: "Verde: el ritmo coincide con el calendario.",
      },
      {
        alt: "Tablero de olbo con el semáforo en alerta: el mismo bolsillo leído en un día más temprano del mes cambia el color a advertencia.",
        caption: "El mismo monto, más temprano en el mes, se lee como alerta.",
      },
      {
        alt: "Pantalla de captura de olbo: un movimiento registrado en pesos colombianos enteros en pocos toques.",
        caption: "Captura en pesos enteros, en segundos.",
      },
      {
        alt: "Lista de movimientos de olbo: gastos registrados, agrupados y categorizados, guardados localmente en IndexedDB.",
        caption: "Movimientos, categorizados y guardados en el dispositivo.",
      },
    ],
    links: [{ label: "App en vivo" }, { label: "Código fuente" }],
    externalLink: { label: "App en vivo" },
    credits:
      "Diseño e ingeniería de punta a punta: dirección de producto, interfaz, lógica de dominio, pruebas y despliegue, todo mío. Claude trabajó como colaborador dentro del build y dentro del propio producto, pero las decisiones —y las pruebas que las hacen cumplir— son mías.",
    technologies: [
      "Vanilla JS (módulos ES)",
      "PWA y Service Worker",
      "IndexedDB",
      "node --test",
      "CSP estricta",
      "Claude API",
    ],
  },

  "naowee-suid": {
    project: "Naowee — Plataforma del sector deportivo",
    category: "GovTech × Deporte × Nativo de IA",
    duration: "En curso",
    team: "Producto, diseño e ingeniería",
    tagline:
      "Digitalizar cómo un país gestiona su deporte: una plataforma modular construida diseñando e implementando en un solo movimiento, con la IA en el proceso de punta a punta.",
    impact:
      "Una sola plataforma nativa de IA reemplaza hoy una pila de herramientas desconectadas, y sale a un ritmo que la entrega clásica de diseño a desarrollo no alcanza.",
    context:
      "El sector deportivo colombiano funcionaba con papel, hojas de cálculo y sistemas aislados. Como Head of Product marqué la dirección y construí SUID de punta a punta: un solo sistema de diseño, la IA en el proceso y operadores reales en mente.",
    contributions: [
      "**Dirección de producto en 8 módulos de negocio**: inspección, vigilancia y control sobre ~1.200 organizaciones deportivas y sus 30 trámites regulatorios, además de eventos, escenarios, incentivos, convocatorias y puntuación en vivo.",
      "**Un solo sistema de diseño, y construyo en él**: más de 38 componentes naowee-*, un shell canónico y una sola receta de asistente que mantiene más de 130 pantallas en un mismo lenguaje.",
      "**Modelé la jerarquía real del sector**: comités → federaciones → ligas → clubes → deportistas, con aprobación en cascada y la doble validación de la federación; los eventos entran por plantilla .xlsx, con carga parcial y errores numerados por fila.",
      "**Prototipos que funcionan en vez de especificaciones**: construidos en código con Claude Code, Cursor y Gemini, y recorridos historia por historia con tours guiados para que los analistas aprueben contra el producto en marcha.",
    ],
    kpis: [
      { label: "Trámites digitalizados", delta: "antes en Word, correo y GESDOC" },
      { value: "~1.200", label: "Organizaciones deportivas en alcance" },
      { label: "Pantallas entregadas", delta: "en 8 módulos de negocio" },
      { label: "Módulos de negocio", delta: "de 13 en total" },
    ],
    process: [
      {
        title: "El sector funcionaba con archivos, no con sistemas",
        body: "Entré como diseñador de producto y pasé las primeras semanas leyendo cómo funciona de verdad el sector. El Ministerio del Deporte vigila cerca de 1.200 organizaciones deportivas a través de 30 trámites regulatorios —reconocimiento, inspección, sanciones— y cada uno se movía por una plantilla de Word, un hilo de correos y un gestor documental llamado GESDOC. Los eventos se manejaban en hojas de cálculo sueltas que pasaban de mano en mano. Nada era un sistema; todo era un archivo. Antes de dibujar una sola pantalla mapeé más de 45 estados y 15 roles en el flujo de inspección, porque los estados eran el producto. La interfaz iba a ser la parte fácil.",
      },
      {
        title: "El problema no eran las pantallas",
        body: "Cuando los módulos empezaron a multiplicarse apareció la falla real: ocho módulos de negocio, cada uno con sus botones, sus tablas y su propia idea de un asistente. Los analistas no sabían si algo era una regla o un accidente de diseño. Así que dejé de dibujar pantallas y construí el lenguaje: un sistema de diseño, más de 38 componentes, un shell canónico, una receta de asistente y un mapa de semántica de etiquetas. La regla que me exijo a mí y a todos: nunca un componente a la medida; si al sistema le falta algo, se extiende el sistema. Más de 130 pantallas después, eso es lo que mantiene ocho módulos leyéndose como un solo producto.",
      },
      {
        title: "Deportistas y eventos, modelados construyéndolos",
        body: "Los dos dominios que parecían más simples eran los más difíciles. La inscripción de deportistas no es un formulario: el deporte colombiano es una cadena —comités, federaciones, ligas, clubes, deportistas— donde cada nivel aprueba al de abajo, una federación necesita la aprobación del Ministerio y de su comité, y un deportista aprobado hereda la liga y la federación de su club. Los eventos tampoco son un formulario. Todo entra por plantilla: descargas el .xlsx, lo llenas y lo subes; las filas válidas cargan aunque otras fallen, y las fallas vuelven listadas por número de fila. Resultados, medalleros y rankings llegan igual, en 83 deportes parametrizados. Diseñé ambos construyéndolos: prototipos en código, con la IA en el proceso.",
      },
      {
        title: "Lo que se firma es el prototipo",
        body: "Hoy marco la dirección del producto y construyo. Un módulo empieza como un prototipo que funciona, no como un documento: roles reales, estados reales, clicable. Encima entrego un tour guiado que lleva a un analista por una historia de usuario a la vez —la tarea, por qué existe y un foco sobre dónde hacer clic— entre pantallas y entre roles. El negocio aprueba contra el producto funcionando, no contra una especificación que cada quien leerá distinto en dos meses. Ingeniería recibe algo ya resuelto, y mi revisión de aceptación es si lo construido es idéntico a la demo. El sistema de diseño es el contrato; la demo es como lo firmamos.",
      },
    ],
    decisions: [
      {
        title: "Un sistema, u ocho dialectos",
        body: "Ocho módulos de negocio, cada uno con su fecha y su presión para salir ya. Podía dejar que cada uno construyera sus componentes y reconciliar después. En cambio, cada módulo construye con los mismos 38+ componentes y los extiende con un patrón de override en lugar de bifurcarlos. Cuesta tiempo al inicio de cada módulo y se paga en cada revisión: cuando algo se ve mal, es un error, no una preferencia.",
      },
      {
        title: "La demo es el requisito, no el documento",
        body: "Las especificaciones se aprueban y después cada quien las lee distinto. Por eso lo que el negocio firma es un prototipo que funciona, con roles y estados reales, recorrido una historia de usuario a la vez. Los desacuerdos salen cuando todavía son baratos, e ingeniería recibe un objetivo resuelto en lugar de una interpretación. Solo funciona porque el prototipo lo construyo yo: una cadena de documento a mockup a desarrollo es demasiado lenta para discutir con ella.",
      },
      {
        title: "La jerarquía es el producto, no una tabla de consulta",
        body: "Una tabla plana de deportistas habría salido meses antes. Pero el deporte colombiano es una cadena de aprobaciones: una federación necesita al Ministerio y a su comité, una liga a su federación, un club a su liga, un deportista a un club, y nadie puede aprobar mientras su propio estado siga pendiente. Modelé la cadena, incluido el deportista sin club, porque reportar medallas por liga solo significa algo si los vínculos son reales.",
      },
    ],
    video: {
      label: "IVC: una coordinadora asigna un trámite vencido a un profesional",
      caption:
        "Una coordinadora despeja un trámite vencido: elige al profesional —el selector marca quién ya está sobrecargado—, confirma, y los contadores de la bandeja se recalculan en su sitio: de 6 pendientes a 5, de 3 asignados a 4.",
    },
    gallery: [
      {
        alt: "La bandeja de asignación de la coordinadora de IVC: contadores con 6 en remisión, 3 asignados y 3 en validación, sobre una tabla de 25 trámites con número de radicado, la organización deportiva y su NIT, días restantes, estado y profesional asignado.",
        caption: "La bandeja de la coordinadora: cada trámite con un plazo y un responsable.",
      },
      {
        alt: "El espacio de trabajo del profesional en el trámite IVC-2026-005: 18 días de plazo junto a una lista de 7 documentos, cada uno citando el artículo del Decreto 1387/1970 al que responde, con validar, rechazar u observar por documento.",
        caption: "Cada documento revisado contra el artículo al que tiene que responder.",
      },
      {
        alt: "El panel de administración de convocatorias: 1 de 7 convocatorias abierta, 33 postulaciones, 10 en etapa documental y 30,5 millones de pesos en inversión activa, sobre listas de postulaciones recientes y convocatorias activas.",
        caption: "Convocatorias de inversión, postulaciones y etapas en un solo panel.",
      },
      {
        alt: "Revisión del área técnica de la postulación RAD-2026-003: un aviso de área asignada con su SLA, una lista de chequeo arquitectónica donde cada ítem cita su artículo de la Resolución 933 y se marca como cumple o sin verificar, un avance de 4 de 6 y un panel con los documentos cargados.",
        caption: "Una de ocho áreas técnicas, revisada artículo por artículo.",
      },
      {
        alt: "El registro georreferenciado de escenarios deportivos: un mapa coroplético de Colombia sombreado por departamento, con filtros de región, tipo de escenario, estado y CAR, junto a un ranking de departamentos y una leyenda de intensidad.",
        caption: "Los escenarios deportivos del país, departamento por departamento.",
      },
      {
        alt: "El perfil del escenario Centro deportivo Norte, con una insignia CAR: un carrusel de fotos sobre pestañas de información general, documentación e historial, con departamento, municipio, ficha catastral y coordenadas.",
        caption: "Un escenario: fotos, documentos y coordenadas.",
      },
    ],
    links: [{ label: "Sistema de diseño" }, { label: "Hub de demos" }],
    credits:
      "Head of Product en Naowee: marco la dirección de los módulos de negocio de la plataforma y construyo los prototipos que los definen: decisiones de producto, sistema de diseño y código que funciona. Trabajo junto a analistas de negocio, un diseñador que lidero y los equipos de ingeniería que llevan cada módulo a producción.",
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
    tagline: "Líder técnico del sistema de diseño detrás de Mercadolibre, en 18 países.",
    impact:
      "Una sola librería, mantenida para iOS, Android y Web, con la que más de 400 diseñadores y más de 2.000 ingenieros construyen el mismo producto.",
    context:
      "Andes es la fuente de verdad de los productos de comercio, fintech y envíos de Mercadolibre. Fui dueño de los fundamentos y de las definiciones de componentes, mantuve las tres plataformas en paridad y llevé la IA a la forma en que el sistema se audita a sí mismo.",
    contributions: [
      "**Definiciones fundacionales**: tokens, espaciado, tipografía y movimiento, acordados una vez y gobernando la suite de productos.",
      "**Paridad multiplataforma**: una sola API de componente, lanzada igual en iOS, Android y Web, trabajada directamente con los equipos de ingeniería que la construyen.",
      "**Mantenimiento de componentes a escala**: adiciones, deprecaciones y migraciones en una librería que cientos de diseñadores abren todos los días.",
      "**IA dentro de la práctica de sistemas**: auditorías guiadas por prompts que detectan desviaciones en Figma antes de que lleguen a un release.",
    ],
    kpis: [
      { label: "Diseñadores en el sistema" },
      { label: "Ingenieros en el sistema" },
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
    duration: "6 años",
    team: "12+ squads de producto",
    tagline:
      "El portal transaccional de uno de los bancos más grandes de Colombia, y Velocity: el sistema de diseño que lo mantuvo consistente en doce squads.",
    impact:
      "Un portal bancario anticuado y sobrecargado, reconstruido como un solo producto liviano y legible, y un sistema de diseño documentado que hizo que la siguiente pantalla costara menos que la anterior.",
    context:
      "La banca digital del Banco de Occidente era visualmente densa y difícil de recorrer, y cada squad resolvía los mismos problemas de forma distinta. Rediseñé el portal transaccional y construí Velocity, el sistema de diseño del banco, como guardián oficial de lo que entraba en él.",
    contributions: [
      "**Rediseñé el portal transaccional**: ingreso y registro, cuentas y tarjetas, transferencias, pagos y bloqueo de productos, para escritorio, tableta y celular.",
      "**Construí Velocity, el sistema de diseño del banco**: documentación, fundamentos, átomos, moléculas y organismos, con principios de diseño atómico para que el front end pudiera reflejar la misma estructura.",
      "**Guardián del sistema de diseño**: aprobé adiciones, deprecaciones y patrones en más de 12 squads de producto, y dirigí los talleres y las críticas que enseñaban el sistema.",
      "**Dibujé el set de íconos ilustrados**: 15 mini ilustraciones que le dan a todo el producto un carácter reconocible en lugar de una librería de glifos genérica.",
    ],
    kpis: [
      { label: "Squads de producto alineados", delta: "un solo sistema" },
      { value: "6 años", label: "Como guardián del sistema de diseño" },
      { label: "Áreas del sistema documentadas", delta: "de fundamentos a organismos" },
      { label: "Íconos ilustrados", delta: "dibujados para el sistema" },
    ],
    process: [
      {
        title: "Descubrimiento, después investigación",
        body: "Para construir algo primero hay que entender el negocio. Hicimos descubrimiento con el cliente y los stakeholders, y después investigación competitiva y con usuarios: días dedicados al modelo de negocio, los requisitos y a quién iba a usar esto de verdad.",
      },
      {
        title: "Flujos antes que pantallas",
        body: "Mapeamos el comportamiento del sistema para cada caso de uso antes de dibujar nada: ingreso y registro, pagos, activar y desactivar servicios, transferencias, enviar y solicitar, bloquear un producto. Seis flujos, con sus excepciones y sus estados de error, porque en la banca la excepción es el producto.",
      },
      {
        title: "Wireframes interactivos, probados con personas",
        body: "Cada etapa pasó por un prototipo interactivo antes del diseño visual. Eso le permitió al equipo y al cliente ver cómo funcionaría el producto de verdad, y nos dejó hacer pruebas con usuarios sin pagar antes un desarrollo completo. El flujo de registro pasó por varias rondas a partir de esa retroalimentación.",
      },
      {
        title: "Un sistema, no un conjunto de pantallas",
        body: "Los productos grandes no escalan sin uno. Velocity documenta fundamentos, átomos, moléculas y organismos para que los diseñadores de productos digitales, mercadeo e ingeniería estén sincronizados. Seguí el diseño atómico a propósito, porque la misma estructura sobrevive a la entrega al front end.",
      },
    ],
    decisions: [
      {
        title: "Diseño atómico, porque el front end también piensa así",
        body: "Un sistema de diseño se puede organizar de muchas maneras. Elegí átomos, moléculas y organismos porque esa estructura sobrevive al paso al código: ingeniería construía componentes con la misma granularidad, así que la documentación y la implementación podían compartir un vocabulario en lugar de traducirse.",
      },
      {
        title: "Dos capas de navegación, y no más",
        body: "El portal anterior enterraba a la gente en árboles de páginas anidadas. Reemplacé la profundidad de navegación por un sistema de popups: la página, luego un fondo desenfocado, luego el componente, luego el popup. Dos capas alcanzan para cada tarea bancaria del producto, y nadie se pierde en algo de dos capas de profundidad.",
      },
      {
        title: "Idéntico entre dispositivos, no solo parecido",
        body: "El brief pedía una experiencia similar en escritorio, tableta y celular. Apuntamos a idéntica. Cada capacidad del escritorio llega al teléfono con los mismos nombres y en el mismo orden, porque un cliente que aprende el portal en un portátil no debería tener que volver a aprenderlo en el bus.",
      },
    ],
    gallery: [
      {
        alt: "El portal transaccional del Banco de Occidente en una tableta: una barra lateral con el nombre del cliente y su nivel de beneficios, tarjetas de una Mastercard y de una cuenta de ahorros con sus saldos, una fila de transacciones favoritas, un calendario del mes y un gráfico de gastos.",
        caption: "El inicio del portal: productos, transacciones favoritas y el mes de un vistazo.",
      },
      {
        alt: "La pantalla de ingreso del portal en una tableta: un aviso de cookies arriba, un panel promocional a la izquierda y una tarjeta de ingreso que pide tipo de documento, número de documento y contraseña, con enlaces para recuperar la contraseña y para registrarse.",
        caption: "Ingreso y registro, sin nada que distraiga a mitad de la tarea.",
      },
      {
        alt: "El flujo de registro y clave de un solo uso diagramado en cajas y flechas: registrarse, ingresar tipo y número de documento, enviar una clave de un solo uso, ingresarla o pedir otra por SMS, aceptar el tratamiento de datos y luego un ingreso exitoso o una falla de validación.",
        caption: "Uno de seis flujos mapeados antes de que existiera cualquier pantalla, excepciones incluidas.",
      },
      {
        alt: "El índice del sistema de diseño Velocity, de cinco columnas: Documentación, Fundamentos, Átomos, Moléculas y Organismos, con conceptos básicos, reglas de nombres, principios de escritura, grillas, espaciado, colores, tipografía, botones, inputs, controles, íconos, campos, desplegables, listas, tablas, encabezados, formularios, modales, selector de fecha y navegación por pestañas.",
        caption: "Velocity, indexado como se construye el front end.",
      },
      {
        alt: "Tableros de fundamentos del sistema dispuestos en perspectiva: una escala de color de azul claro a oscuro con secundarios neutros y dorados, una escala tipográfica del hero al caption, una escala de espaciado y hojas con los estados de botones y campos de formulario.",
        caption: "Fundamentos: color, tipografía, espaciado y cada estado de cada control.",
      },
      {
        alt: "Quince íconos ilustrados en línea azul y verde: un extracto, un puntaje de crédito, un certificado, un documento programado, un pin de ubicación, monedas apiladas, una alcancía, un pago con el celular, un mensaje en el celular, un celular con un más, un celular protegido, un celular con huella, una transacción fallida, una casa y una ventana de navegador.",
        caption: "Quince íconos dibujados para el sistema, no licenciados.",
      },
      {
        alt: "La sección de cuentas del portal en una tableta: una tarjeta de cuenta de ahorros con saldo disponible, canjeable y actual, una tabla filtrable de movimientos con compras y transferencias y sus montos, y un aviso de éxito que confirma el bloqueo de una chequera.",
        caption: "Cuentas y tarjetas: saldos, movimientos y la confirmación de que el bloqueo funcionó.",
      },
      {
        alt: "El sistema de popups dibujado como cuatro planos apilados en perspectiva, rotulados desde el fondo: la página, un fondo desenfocado, el componente y el popup.",
        caption: "Profundidad en vez de anidación: dos capas cubren cada tarea del producto.",
      },
      {
        alt: "Dos pantallas de iPhone lado a lado: el detalle de una Mastercard Black con pago mínimo, pago total y fecha límite sobre un botón de Pagar, y la pestaña de movimientos con compras con tarjeta, fechas, número de cuotas y montos.",
        caption: "El mismo portal en un celular: cada capacidad del escritorio, en el mismo orden.",
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
    duration: "En vivo desde el 21 sep 2026 — sigue saliendo",
    team: "Solo — producto, diseño, código",
    tagline:
      "Una clínica que vivía en WhatsApp, un calendario y un Drive, hoy manejada desde un panel en el celular de la secretaria; ningún procedimiento empieza sin estar pagado.",
    impact:
      "Dos semanas del primer commit a la versión que la clínica usa hoy: un solo panel donde cada paciente tiene una fase, un saldo y un siguiente paso, construido sobre el Drive y el Calendar de la propia clínica; y un procedimiento solo recibe su luz verde cuando el pago, el recibo y el consentimiento firmado están completos.",
    context:
      "Una clínica de medicina estética en Barranquilla cuyo médico también atiende en consultorios alquilados en Bogotá y Medellín. Una secretaria que agenda, asesora y vende por WhatsApp, un Google Calendar y un Drive compartido donde viven la plata, los consentimientos y las historias clínicas. Todo ya estaba escrito; nada estaba conectado, y menos que nada lo que una paciente todavía debía.",
    contributions: [
      "**Un plan atacado antes de construirse**: el primer plan pasó por una revisión adversarial en tres frentes —datos, seguridad y factibilidad— y solo su tercera versión llegó al código.",
      "**El caso de la paciente en tres fases con candado**: valoración, pago, procedimiento. Cada una desbloquea la siguiente, y la luz verde del procedimiento solo aparece cuando están el pago completo, su recibo y el consentimiento firmado.",
      "**Un archivo, dos entornos y una app en el celular**: el mismo tablero corre como artifact de Claude de solo lectura y como panel web detrás de un Cloudflare Worker con un usuario por persona, y se instala como app en el iPhone de la secretaria.",
      "**Reglas como funciones con pruebas**: saldos, comisiones de tarjeta, fechas y el emparejado de nombres que reconcilia a una paciente escrita de tres formas, cubiertos por doce suites de pruebas, desde funciones puras hasta un navegador real al ancho de un celular.",
    ],
    kpis: [
      { label: "Días, del primer commit a la versión de hoy", delta: "19 sep → 2 oct 2026" },
      { label: "Fases con candado", delta: "valoración, pago, procedimiento" },
      { label: "Bases de datos nuevas", delta: "Drive y Calendar siguen siendo la fuente de verdad" },
      { label: "Suites de pruebas", delta: "dominio, contabilidad, worker, navegador" },
    ],
    process: [
      {
        title: "La clínica ya tenía un sistema; solo que no era software",
        body: "Antes de escribir nada mapeé lo que pasa de verdad. Una paciente escribe por WhatsApp; la secretaria agenda la valoración en Google Calendar; el médico pone el precio después de verla; el abono va a una hoja de contabilidad; el consentimiento es un documento en una carpeta de Drive; el control es 45 días después del procedimiento. Nada de eso estaba mal. Estaba repartido en cuatro herramientas que nunca hablaban entre sí, así que la pregunta que mueve la clínica —¿cuánto debe esta paciente y qué falta antes del jueves?— tomaba diez minutos abriendo archivos.",
      },
      {
        title: "Un plan que primero tuvo que sobrevivir a un ataque",
        body: "El primer plan no se construyó: se atacó. Una revisión en tres frentes —datos, seguridad y factibilidad— encontró las trampas que esconden las hojas: una fila por pago, así que sumar la columna de pendiente cuenta la deuda otra vez con cada abono; carpetas de pacientes escritas de dos formas; fórmulas ya puestas en filas que el panel nunca debe sobrescribir. La tercera versión es la que llegó al código, con las decisiones del negocio escritas adentro: un usuario por persona, un abono mínimo de la mitad del precio y una excepción hasta el treinta por ciento solo con autorización del médico, registrada donde él la puede leer.",
      },
      {
        title: "Primero leer, después escribir",
        body: "La primera versión no podía escribir nada. Corría como un artifact de Claude que leía Drive y Calendar por conectores, y eso la hizo segura para ponerla frente a la clínica desde el primer día. La segunda es el mismo archivo detrás de un Cloudflare Worker, con un usuario por persona y un Google Apps Script que guarda las únicas credenciales que tocan las hojas reales. Antes de salir en vivo el 21 de septiembre, la contabilidad de junio a septiembre se cuadró contra el archivo anual y las tres capas pasaron por una auditoría de seguridad.",
      },
      {
        title: "El celular reescribió la interfaz",
        body: "Después el panel conoció a su usuaria real. La secretaria maneja la clínica desde un iPhone, muchas veces desde el carro, así que la segunda semana fue para el celular: el panel se instala como app, las tablas se vuelven tarjetas, la ficha de la paciente sube desde abajo, cada zona táctil mide al menos 44 píxeles y ningún campo hace zoom en la página. La nota de voz salió de esa misma semana: ella cuenta lo que pasó, el modelo llena el formulario de paciente nueva y nada se guarda hasta que ella lo revisa.",
      },
      {
        title: "La plata real trajo sus propias reglas",
        body: "Una semana de pagos reales produjo reglas que ningún plan tenía. Una tarjeta de crédito entra al 95 %, porque la clínica le traslada la comisión a la paciente. La valoración cuenta dentro del precio. Un pago se puede registrar antes de que exista su recibo, y queda marcado hasta que el recibo se sube. Un caso cuya fecha de procedimiento ya pasó con plata pendiente sigue abierto y lo dice. Cada una salió de pagos reales y se volvió una regla que el panel hace cumplir.",
      },
      {
        title: "La clínica empezó a pedir cosas",
        body: "Para la segunda semana los pedidos llegaban de la clínica. La disponibilidad del médico ahora se lee del documento que la secretaria ya escribe, como una semana de cupos en rojo y verde que ella copia directo a WhatsApp. La agenda muestra cada día por ciudad, porque el médico trabaja en tres. Un control se puede mover cuando el médico lo adelanta por un tema médico, con el motivo en el registro. Cada persona tiene sus propios permisos, área por área. La mayoría de los pedidos salió en menos de un día; la agenda por ciudad, el más reciente, se publicó el 2 de octubre.",
      },
    ],
    decisions: [
      {
        title: "La hoja de cálculo sigue siendo la fuente de verdad",
        body: "Lo obvio era una base de datos con un esquema real. No lo hice. La persona que lleva la contabilidad trabaja en Drive todos los días y habría tenido que abandonar su herramienta por la mía, y la clínica habría quedado dependiendo de mí para mantener todo encendido. Leer las hojas, en cambio, significa que el panel se puede apagar mañana y la clínica no pierde nada: sigue teniendo cada número, en los archivos que ya conoce.",
      },
      {
        title: "Los saldos se leen, no se suman",
        body: "Cada fila de ingresos es un pago, y lleva el saldo que queda después de él; sumar la columna de pendiente cuenta la misma deuda otra vez con cada abono. Una versión temprana hizo exactamente eso y reportó un saldo fantasma de treinta y ocho millones de pesos. El arreglo es una línea: el saldo de una paciente es el de su fila más reciente. La prueba que lo demuestra es la que conservaría si tuviera que borrar todas las demás del repositorio.",
      },
      {
        title: "Nada se escribe sin que una persona lo confirme",
        body: "Una nota de voz, un recibo fotografiado, la factura de un proveedor: el modelo lee todo eso, y nada se escribe hasta que una persona revisa el formulario que llenó. Cuesta un clic. También es la razón por la que la IA sirve: un modelo que categoriza mal un gasto en silencio es peor que digitarlo, porque el error ahora es invisible.",
      },
      {
        title: "Un solo acento, y solo para lo que se puede tocar",
        body: "Después de una semana de uso diario la interfaz se rediseñó: Inter en todo, un lienzo más claro, tarjetas blancas sin borde y un único índigo reservado para lo accionable: el botón principal, la pestaña activa, el filtro activo. Los colores de estado nunca se suman encima, y ningún texto baja de 4,5:1. En una pantalla donde compiten pagos, alertas y ciudades, el único color que significa «toca aquí» tiene que significar solo eso.",
      },
      {
        title: "Un color por ciudad, nunca solo",
        body: "El médico trabaja en tres ciudades, así que la agenda le da un color a cada una —naranja para Barranquilla, azul para Bogotá, verde azulado para Medellín—, validados para daltonismo con todas las parejas lado a lado. Y el color nunca carga la ciudad solo: el nombre siempre va junto a su punto, y los chips de filtro hacen de leyenda, así que nadie tiene que distinguir el verde azulado del azul para saber dónde está el médico.",
      },
    ],
    featuresIntro:
      "El panel es un solo tablero con el día de la clínica: en un portátil en recepción o en un celular dentro de un carro. Estas son las piezas que más peso cargan.",
    features: [
      {
        title: "Una nota de voz que llena el formulario",
        body: "Di quién llegó, de dónde, para qué, qué pagó y cuándo es la cita. El modelo llena el formulario de paciente nueva, lista lo que no pudo ubicar y deja los pagos como recordatorios en el caso; nada se guarda hasta que una persona lo revisa.",
      },
      {
        title: "Fases con candado",
        body: "Cada fase lista lo que falta y lleva directo al formulario que lo resuelve. El pie siempre nombra el siguiente paso, así que el panel responde «¿qué hago ahora?» sin que nadie tenga que recordar el protocolo.",
      },
      {
        title: "La agenda, por ciudad",
        body: "Vistas de lista, día y mes del Google Calendar de la clínica, cada cita con el color de la ciudad donde ocurre —escrita en la cita, tomada de la ficha de la paciente o inferida de dónde está el médico ese día—, y cada una dice de dónde salió.",
      },
      {
        title: "Los cupos del médico, listos para enviar",
        body: "La disponibilidad que la secretaria lleva en un documento se vuelve una semana de cupos en rojo y verde, con un aviso para cualquier día que caiga en dos ciudades a la vez, y se copia a WhatsApp como el mensaje que ella ya manda.",
      },
      {
        title: "Recibos y facturas leídos por IA",
        body: "Fotografía un recibo de pago, una factura de proveedor o una pila de gastos de viaje y los valores vuelven llenos para revisar: los insumos van al inventario y los gastos a la contabilidad del mes.",
      },
      {
        title: "Quién puede hacer qué",
        body: "Usuarios y permisos por área —agenda, pacientes, pagos, contabilidad, inventario—, que deciden, área por área, qué puede ver cada persona y qué puede cambiar. La secretaria maneja el día, el médico lo lee, y todo lo que se escribe queda en un registro de actividad con quién lo hizo.",
      },
    ],
    video: {
      label:
        "En el celular: una nota de voz llena el formulario de paciente nueva, la valoración toma una hora libre del calendario de la clínica y, al guardar, se abre el caso en la fase uno",
      caption:
        "Desde el celular de la secretaria: una nota describe a una paciente nueva y el formulario vuelve lleno —nombre, WhatsApp, ciudad, procedimiento y la valoración ya pagada—. La hora sale del calendario de la clínica, y al guardar se abre el caso en la fase uno con el pago dictado esperando su recibo. Grabado contra la demo local, que reemplaza al modelo con reglas simples, sobre datos de prueba; la nota se escribe para la grabación, mientras que en su celular se dicta.",
    },
    gallery: [
      {
        alt: "La agenda en vista de mes: septiembre de 2026 de lunes a domingo, con las citas de cada día como líneas cortas del color de su ciudad —naranja para Barranquilla, azul para Bogotá, verde azulado para Medellín—, una franja de color sobre los días que el médico pasa en cada ciudad y un conteo de citas por ciudad encima de la grilla.",
        caption: "Un mes de citas, cada una con el color de la ciudad donde ocurre.",
      },
      {
        alt: "La ficha del caso de una paciente abierta sobre la lista de casos: un indicador de tres pasos con valoración y pago completos y el procedimiento en curso, el procedimiento definido en cuatro viales para rostro y cuello, la fecha del procedimiento agendada, una barra de pagos en 5,3 de 9,8 millones de pesos, los pagos del caso del más reciente al más antiguo y un pie que nombra el siguiente paso: registrar el pago final.",
        caption: "El caso: qué está pagado, qué falta y la única acción que sigue.",
      },
      {
        alt: "El tablero de seguimiento: contadores de valoraciones, procedimientos, controles por reagendar, esta semana, los próximos 30 días y controles sin fecha; pestañas de valoraciones, procedimientos, controles, agenda, cupos y por cobrar; filtros por ciudad; y una tabla de controles a los 45 días, cada uno con los días que faltan, su estado y un botón de WhatsApp.",
        caption: "El día, contado: a quién le toca, quién no tiene cita todavía y quién se quedó atrás.",
      },
      {
        alt: "La agenda en vista de día para el jueves 24 de septiembre: un aviso de que el médico está en Medellín según el calendario, las citas como tarjetas por hora con su tipo y su ciudad, una línea roja que marca la hora actual y botones de ficha y calendario en cada tarjeta.",
        caption: "Un día por horas, con una línea para el ahora y dónde está el médico.",
      },
      {
        alt: "Los cupos del médico para la semana del 5 al 11 de octubre: siete columnas, cada una con la ciudad donde está el médico, horas marcadas como ocupadas en rojo o libres en verde, un conteo de horas libres en los próximos dos meses y un botón para copiar dos meses de cupos para WhatsApp.",
        caption: "La disponibilidad del médico, leída del documento que la secretaria ya lleva.",
      },
      {
        alt: "Edición de un usuario en Usuarios y permisos: la cuenta del médico en solo ver, con casillas para ver, crear y editar por área —y borrar, en pacientes y casos— en agenda y seguimiento, pacientes y casos y pagos de pacientes, bajo plantillas para operar el día, solo ver y nada.",
        caption: "Quién ve qué, área por área: el médico lee, la secretaria maneja el día.",
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
      "Soy socio de la clínica junto al médico y construí esto de punta a punta: decisiones de producto, interfaz y código, con la IA en el proceso. El médico es dueño del protocolo médico que codifican las fases; la secretaria de la clínica es la usuaria diaria, y los flujos se moldearon viéndola usarlos, en el escritorio y en su celular. Las pantallas y el recorrido se grabaron sobre datos de prueba con nombres inventados: en este caso no aparece información de ninguna paciente ni ninguna cifra de la contabilidad de la clínica.",
  },

  "royal-caribbean": {
    category: "Viajes × Móvil",
    duration: "1 año",
    team: "Equipo multifuncional EE. UU. + LATAM",
    tagline:
      "Diseñando experiencias a bordo para las flotas de Royal Caribbean en rutas por el Caribe y el Mediterráneo.",
    impact:
      "Experiencias a bordo que acompañan al pasajero desde la reserva hasta el desembarque, resistentes a la vida en altamar.",
    context:
      "Los huéspedes de un crucero pasan una semana a bordo con una conexión irregular. Diseñé la reserva y la experiencia a bordo —horarios, restaurantes, excursiones, saldos— para huéspedes de todas las edades y de cualquier nivel de comodidad con la tecnología.",
    contributions: [
      "**Flujos de reserva móviles** para distintos destinos y tipos de camarote.",
      "**Experiencia a bordo**: horarios, restaurantes, excursiones y saldos que funcionan con un Wi-Fi intermitente.",
      "**Colaboración remota** con los equipos de producto e ingeniería en la sede de Royal Caribbean en Estados Unidos.",
    ],
    kpis: [
      { label: "Flotas y regiones", delta: "Caribe + Mediterráneo" },
      { value: "De punta a punta", label: "Recorrido del huésped" },
      { value: "Sin conexión", label: "Resistente en altamar" },
    ],
    technologies: ["Sketch", "iOS", "Android", "Prototipado", "Colaboración intercultural"],
    externalLink: { label: "Visitar globant.com" },
  },

  qrvey: {
    category: "SaaS × Encuestas y NPS × Automatización",
    duration: "11 meses",
    team: "Producto + Ingeniería",
    tagline:
      "Un constructor de automatizaciones para encuestas: un disparador, una condición y una acción, armados por personas que nunca habían dibujado un diagrama de flujo.",
    impact:
      "Una mala respuesta podía responderse sola: una encuesta de seguimiento una semana después, y el resultado en la bandeja correcta, sin nadie pendiente de ello.",
    context:
      "Qrvey era una plataforma de encuestas y NPS: armabas un Qrvey, la gente lo respondía y después alguien tenía que leer las respuestas y hacer algo con ellas. AutomatiQ era la parte que hacía algo. Como diseñador UI líder diseñé el constructor: la lista de procesos, las tarjetas de disparadores, el editor de condiciones y las acciones que ejecutan.",
    contributions: [
      "**Una lista de procesos que muestra si un proceso está funcionando**: estado, las encuestas que cubre, el tiempo promedio de ciclo y cuántos ciclos ha corrido, en la misma fila. Un proceso que se había detenido en silencio se veía sin abrirlo.",
      "**Disparadores como tarjetas, no como lienzo**: una programación con sus propias reglas de repetición y de fin, o una respuesta nueva a una encuesta elegida, cada una como una tarjeta que se expande en su sitio. Sin conectores que dibujar y nada que acomodar.",
      "**Condiciones con las palabras del propio producto**: *si la respuesta es* o *número de respuestas*, sobre una pregunta y sus respuestas, con filas que se agregan y se quitan una a una.",
      "**Acciones que vuelven al producto**: el editor de correo adjunta los resultados y pone un enlace vivo a una encuesta en el cuerpo, así que el seguimiento es la siguiente encuesta y no un mensaje sobre ella.",
    ],
    gallery: [
      {
        alt: "La pestaña de Automatización de Qrvey: un botón de Crear proceso sobre una lista de tarjetas de procesos, cada una con una barra de estado de color que dice En ejecución o En pausa, su nombre y fecha de creación, y tres cifras: encuestas cubiertas, tiempo promedio y ciclos ejecutados. Una barra lateral ofrece encuestas de ejemplo y consejos.",
        caption: "Cada proceso dice si está corriendo y qué ha hecho.",
      },
      {
        alt: "Una tarjeta de disparador de Programación expandida: frecuencia de repetición, un intervalo en días y una hora del día, una fecha de inicio y un final que es un número de ejecuciones o una fecha específica.",
        caption: "El disparador de programación, con las dos formas en que puede terminar.",
      },
      {
        alt: "Un disparador de Respuesta nueva con su selector de encuestas abierto: una lista buscable de encuestas, cada fila con una insignia de Activa o Borrador y la fecha en que se activó.",
        caption: "Elegir la encuesta cuyas respuestas inician el proceso.",
      },
      {
        alt: "Una condición bajo un disparador de Respuesta nueva: dos pastillas, Si la respuesta es y Número de respuestas, sobre un panel con una pregunta y sus filas de respuestas con botones para agregar o quitar cada una, y una fila de Seleccionar acción esperando debajo.",
        caption: "El editor de condiciones: una pregunta, sus respuestas y lo que sigue.",
      },
      {
        alt: "La acción Enviar correo abierta: chips de destinatarios, un asunto con el conteo de caracteres restantes, un mensaje de texto enriquecido con botones para adjuntar resultados o insertar una encuesta, un enlace a una encuesta insertado en el cuerpo y un bloque de adjunto con la encuesta elegida.",
        caption: "La acción de correo, con los resultados adjuntos y una encuesta en el cuerpo.",
      },
      {
        alt: "Un proceso completo armado a partir de un escenario escrito en lenguaje simple arriba: un disparador de respuesta nueva, una condición sobre la respuesta dada y dos acciones de correo —una a quien respondió con una encuesta de seguimiento y otra al equipo con los resultados— sobre un botón de Guardar cambios que advierte que guardar reinicia el proceso.",
        caption: "Un escenario de punta a punta: disparador, condición y dos acciones.",
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
      "Diseñando wireframes, UI kits y prototipos para clientes internacionales, en web y móvil.",
    impact:
      "Diseño de producto en fintech, marketplaces y B2B: la soltura entre dominios que después hizo natural el trabajo de sistemas.",
    context:
      "Una agencia remota que atendía clientes de Estados Unidos y Latinoamérica. Cada proyecto implicaba aprender rápido un dominio nuevo y entregar un diseño limpio y listo para desarrollo.",
    contributions: [
      "**Wireframes y UI kits** para productos fintech, de consumo y B2B.",
      "**Prototipos de alta fidelidad** para validar con stakeholders y entregar a desarrollo.",
      "**Patrones reutilizables** aplicados y ajustados a cada cliente.",
    ],
    kpis: [
      { value: "Agencia", label: "Un dominio nuevo en cada proyecto" },
      { value: "EE. UU. + LATAM", label: "Clientes distribuidos" },
      { value: "Listo para dev", label: "Calidad de entrega" },
    ],
    technologies: ["Sketch", "InVision", "Wireframing", "Prototipado"],
    externalLink: { label: "Visitar ideaware.co" },
  },

  chub: {
    category: "iOS × Movilidad",
    clientOverride: "Proyecto freelance paralelo",
    roleOverride: "Diseñador de producto — de punta a punta",
    team: "Yo y el equipo de desarrollo, hasta la entrega",
    tagline:
      "Reserva un carro por minuto, mira cuánto cuesta antes de comprometerte y controla la cabina una vez estás adentro.",
    impact:
      "Un flujo de reserva que responde las dos preguntas que una app de alquiler suele esconder —qué carro es este y cuánto va a costar este viaje— antes de que aceptes cualquiera de las dos.",
    context:
      "Un proyecto paralelo de 2018, junto al trabajo de planta. Chub reserva un carro, no un viaje: eliges un vehículo, ves su autonomía y cuánto cobra por minuto, y la app se convierte en los controles de la cabina cuando arranca el viaje. Lo diseñé desde cero y trabajé con el equipo de desarrollo hasta la entrega.",
    contributions: [
      "**La ficha del vehículo empieza por la decisión**: autonomía, aceleración, puestos y la tarifa por minuto en una sola tarjeta, encima del botón. Lo que alguien necesita para elegir no queda escondido detrás.",
      "**La pantalla de ruta pone precio al viaje antes de empezar**: recogida, destino, una duración estimada y un rango de tarifa, con la tarjeta guardada ya a la vista, para que la última pantalla no tenga sorpresas.",
      "**La app se vuelve el carro**: con el viaje en marcha, el mismo producto se convierte en un panel de cabina: clima, asientos ventilados, temperatura interior y exterior, y la velocidad.",
      "**Oscuro por defecto, un solo acento**: un violeta que solo marca lo que está activo: la ruta en curso, el vehículo elegido, la acción principal.",
    ],
    gallery: [
      {
        alt: "La primera pantalla de Chub: el logotipo sobre un carro dibujado en un anillo luminoso, la frase «Choose a Vehicle and trip with style» y un botón de Get started sobre un enlace de Skip.",
        caption: "Primer uso: qué es el producto, en una pantalla.",
      },
      {
        alt: "La ficha de un vehículo sobre el mapa: el modelo con su calificación, una fila de especificaciones con aceleración, autonomía y puestos, su dirección de recogida y distancia, la tarjeta guardada, un precio por minuto y un botón de Book Car.",
        caption: "Autonomía, tarifa y distancia antes del botón, no después.",
      },
      {
        alt: "La ruta dibujada sobre un mapa oscuro con un marcador de distancia, y un panel debajo con la recogida y el destino, la clase de servicio, un rango de tarifa, el tiempo estimado de viaje, la tarjeta guardada y un botón de Need Assistance.",
        caption: "El viaje, con precio y tiempo, antes de empezar.",
      },
      {
        alt: "El panel dentro del carro: chips para el aire acondicionado y los asientos ventilados, temperatura interior y exterior, un indicador circular en 65 km/h con el selector de cambios alrededor y una línea que dice que el aire acondicionado está encendido.",
        caption: "En marcha, la app es la cabina.",
      },
    ],
    technologies: ["Sketch", "iOS", "Prototipado", "Entrega a desarrollo"],
    credits:
      "Diseño de producto de punta a punta: flujos, interfaz y la entrega. Lo construyó un equipo de desarrollo con el que trabajé. El proyecto terminó en la entrega; nunca se lanzó.",
  },

  makeappet: {
    category: "iOS × Adopción de mascotas",
    clientOverride: "Proyecto freelance paralelo",
    roleOverride: "Diseñador de producto — de punta a punta",
    team: "Yo y el equipo de desarrollo, hasta la entrega",
    tagline:
      "Desliza para conocer a un perro o un gato cerca de ti: el patrón que la gente ya conoce, apuntado a la adopción en lugar de a las citas.",
    impact:
      "La adopción tomó prestada la única interacción que todo el mundo ya sabe usar, y puso la petición de donación de un refugio donde ya estaba la atención.",
    context:
      "Un proyecto paralelo de 2018, junto al trabajo de planta. MakeAppet aplica el patrón de deslizar para hacer match a encontrar una mascota cerca: explorar por especie, deslizar entre las que están cerca y abrir un perfil completo antes de decidir. Lo diseñé desde cero y trabajé con el equipo de desarrollo hasta la entrega.",
    contributions: [
      "**La tarjeta lleva la decisión, el perfil lleva el detalle**: nombre, edad y distancia en la tarjeta; raza, peso, sexo y una descripción escrita un toque más adentro. Nadie adopta solo con una fotografía.",
      "**Dos formas de entrar, no una**: una pila para deslizar al explorar y una grilla filtrada por especie y distancia, porque la mitad de quienes llegan ya saben si quieren un gato.",
      "**La petición del refugio va en la pantalla de exploración**: un panel de donación entre la búsqueda y los resultados, donde ya está la atención, en lugar de detrás de un menú que nadie abre.",
      "**La pantalla de match entrega una primera frase**: el momento del match también es el momento de no saber qué decir, así que la pantalla ofrece el saludo en lugar de un campo vacío.",
    ],
    gallery: [
      {
        alt: "La pantalla de bienvenida: una grilla de fotografías de perros con sus dueños detrás de una huella, la frase «Connect and uncover the ideal pets that match your preferences in your area» y un botón de Explore.",
        caption: "La premisa, antes de pedir cualquier cuenta.",
      },
      {
        alt: "La pantalla para deslizar: pestañas For you y Nearby sobre una tarjeta a sangre con la foto de un perro, su nombre, edad y distancia, y botones redondos para descartar y dar like debajo.",
        caption: "El patrón que todos ya conocen, sin cambios.",
      },
      {
        alt: "El perfil de una mascota: una fotografía grande, el nombre y la distancia, una grilla de cuatro celdas con edad, raza, sexo y peso, una descripción escrita y un botón principal de Bark me junto a uno de favorito.",
        caption: "Raza, edad, peso y una descripción: lo que una foto no puede contar.",
      },
      {
        alt: "La pantalla de exploración: una ubicación y un campo de búsqueda con filtros, un panel violeta que pide una donación a nombre de los refugios, y luego una sección de Adopción con pestañas por especie y una grilla de mascotas cercanas.",
        caption: "Explorar por especie, con la petición de los refugios en el flujo.",
      },
      {
        alt: "La pantalla de match: un título de Congratulations con una cinta de It's a Match, las dos mascotas a cada lado de un corazón, una frase de saludo sugerida y un botón de Say woof sobre un enlace de Not now.",
        caption: "Un match, y algo que decir.",
      },
    ],
    technologies: ["Sketch", "iOS", "Prototipado", "Entrega a desarrollo"],
    credits:
      "Diseño de producto de punta a punta: flujos, interfaz y la entrega. Lo construyó un equipo de desarrollo con el que trabajé. El proyecto terminó en la entrega; nunca se lanzó.",
  },
};

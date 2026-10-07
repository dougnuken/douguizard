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
      "Una PWA de finanzas personales que lee tu ritmo, no tu saldo. En vivo, 634 pruebas, cero dependencias.",
    impact:
      "En vivo, instalable y en uso diario: 634 pruebas en 292 ms, cero dependencias, diseñada e implementada de punta a punta con la IA en el proceso.",
    context:
      "Las apps de presupuesto responden «cuánto te queda», la pregunta ansiosa. Construí olbo para mi propio hogar: una PWA local-first en pesos colombianos cuyo semáforo lee el ritmo de gasto contra el calendario.",
    contributions: [
      "**Producto e interfaz**: 24 vistas, del tablero del semáforo a la IA que lee recibos, voz y PDF.",
      "**Cero dependencias**: módulos ES nativos, sin paso de build; matemática de presupuesto pura, así que 634 pruebas corren en 292 ms.",
      "**Privacidad verificable**: local-first, con una CSP estricta que no permite nada más que la app y api.anthropic.com.",
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
        body: "Cada app que probé contaba centavos en la moneda de otro. Primero el producto: pesos enteros, mis datos en mi propio teléfono, una pantalla que me diga si voy bien.",
      },
      {
        title: "Hecho con IA, decidido por las pruebas",
        body: "Trabajé con Claude como pareja, pero me negué a que el resultado fuera desechable: una capa de dominio pura, con «hoy» siempre inyectado, así que cada prueba corre en Node sin navegador. La IA escribía rápido; las pruebas decidían qué sobrevivía.",
      },
      {
        title: "Lanzar, y después escuchar",
        body: "En vivo como PWA instalable y sin conexión, con el service worker en la v150. El uso diario mostró lo que ninguna especificación habría mostrado: un error de zona horaria que dañaba el color de noche y recibos que me negué a volver a digitar.",
      },
    ],
    decisions: [
      {
        title: "El semáforo lee ritmo, no saldo",
        body: "Ritmo de gasto sobre el mes transcurrido: verde hasta 1, ámbar hasta 1,25 y rojo por encima. Gastar el 90 % el día 28 está bien; el 80 % el día 10, no.",
      },
      {
        title: "Las facturas variables nunca reservan plata",
        body: "Luz, agua y gasolina solo cuentan cuando registras lo que de verdad costaron. Un estimado reservado puede pintar un rojo falso, y uno basta para dejar de creerle al color.",
      },
      {
        title: "Privacidad que se puede comprobar, no solo leer",
        body: "Todos prometen local-first. Aquí el encabezado CSP lo demuestra: nada sale del dispositivo salvo las llamadas a api.anthropic.com. Me costó todos los estilos en línea, incluso dentro de los SVG.",
      },
    ],
    featuresIntro:
      "La captura es donde mueren las apps de finanzas: si registrar cuesta esfuerzo, nadie registra. Por eso olbo toma un gasto como llegue.",
    features: [
      {
        title: "Fotografía el recibo",
        body: "Claude lee total, comercio y categoría en una tarjeta que confirmas antes de guardar.",
      },
      {
        title: "Di el gasto en voz alta",
        body: "«Cincuenta mil en el mercado» se vuelve un movimiento estructurado: Claude con la llamada a herramienta forzada, marcado para revisión por debajo de 0,7 de confianza.",
      },
      {
        title: "Pega el mensaje del banco",
        body: "A propósito, sin modelo: un parser exacto lee los dos formatos del banco sin conexión, gratis, sin forma de inventarse un monto.",
      },
      {
        title: "Lee el extracto completo de la tarjeta",
        body: "Un PDF se vuelve datos: fechas de corte y de pago, tasa mensual, cada compra a cuotas y su plazo restante.",
      },
    ],
    video: {
      label:
        "Grabación de olbo: un gasto de 120.000 pesos digitado en el teclado propio de la app, categorizado y guardado; luego el tablero y la lista de movimientos se recalculan.",
      caption:
        "El piso al que llega toda captura: 120.000 pesos en cuatro toques y el ritmo recalculado antes de que se cierre la hoja.",
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
      "Diseño e ingeniería de punta a punta. Claude trabajó dentro del build y del producto; las decisiones, y las pruebas que las hacen cumplir, son mías.",
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
      "Digitalizar cómo Colombia gestiona su deporte: más de 130 pantallas en 8 módulos, diseñadas y construidas con IA.",
    impact:
      "Una sola plataforma nativa de IA reemplaza hoy una pila de herramientas desconectadas, y sale a un ritmo que la entrega clásica de diseño a desarrollo no alcanza.",
    context:
      "El sector deportivo colombiano funcionaba con papel, hojas de cálculo y sistemas aislados. Como Head of Product marco la dirección y construyo en código su plataforma, SUID: un solo sistema de diseño, con la IA en el proceso.",
    contributions: [
      "**Un solo sistema de diseño**: más de 38 componentes naowee-* y una sola receta de asistente mantienen más de 130 pantallas en un mismo lenguaje.",
      "**La jerarquía real del sector**: comités → federaciones → ligas → clubes → deportistas, modelada con aprobación en cascada.",
      "**Prototipos, no especificaciones**: construidos con Claude Code, Cursor y Gemini; los analistas aprueban contra el producto en marcha.",
    ],
    kpis: [
      { label: "Trámites digitalizados", delta: "antes en Word, correo y GESDOC" },
      { value: "~1.200", label: "Organizaciones deportivas en alcance" },
      { label: "Pantallas entregadas", delta: "en 8 módulos de negocio" },
      { label: "Módulos de negocio", delta: "de 13 en total" },
    ],
    process: [
      {
        title: "El sector funcionaba con archivos",
        body: "Los 30 trámites se movían por Word, correo y un gestor documental, GESDOC. Antes de dibujar una pantalla mapeé más de 45 estados y 15 roles: los estados eran el producto.",
      },
      {
        title: "Deportistas y eventos, modelados construyéndolos",
        body: "Un deportista aprobado hereda la liga y la federación de su club. Eventos, resultados y rankings entran por plantilla .xlsx en 83 deportes: las filas válidas cargan y las fallas vuelven por número de fila.",
      },
      {
        title: "Lo que se firma es el prototipo",
        body: "Cada módulo empieza como un prototipo clicable con roles y estados reales, recorrido historia por historia en un tour guiado. El sistema de diseño es el contrato; la demo es como lo firmamos.",
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
      {
        alt: "La bandeja de asignación de la coordinadora de IVC: contadores con 6 en remisión, 3 asignados y 3 en validación, sobre una tabla de 25 trámites con número de radicado, la organización deportiva y su NIT, días restantes, estado y profesional asignado.",
        caption: "Cada trámite con un plazo y un responsable.",
      },
      {
        alt: "El espacio de trabajo del profesional en el trámite IVC-2026-005: 18 días de plazo junto a una lista de 7 documentos, cada uno citando el artículo del Decreto 1387/1970 al que responde, con validar, rechazar u observar por documento.",
        caption: "Cada documento revisado contra el artículo al que responde.",
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
      "Más de 400 diseñadores y más de 2.000 ingenieros construyen con una sola librería, mantenida en paridad en iOS, Android y Web.",
    context:
      "Andes es la fuente de verdad de los productos de comercio, fintech y envíos de Mercadolibre. Fui dueño de sus fundamentos y de las definiciones de componentes, y llevé la IA a la forma en que se audita a sí mismo.",
    contributions: [
      "**Fundamentos**: tokens, espaciado, tipografía y movimiento, acordados una vez y gobernando la suite de productos.",
      "**Paridad multiplataforma**: una sola API de componente, lanzada idéntica en iOS, Android y Web, trabajada con ingeniería.",
      "**Mantenimiento a escala**: adiciones, deprecaciones y migraciones en una librería que cientos de diseñadores abren a diario.",
      "**IA en la práctica de sistemas**: auditorías guiadas por prompts que detectan desviaciones en Figma antes de que salgan.",
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
      "Uno de los bancos más grandes de Colombia: su portal rediseñado y Velocity, el sistema de diseño que compartían más de 12 squads.",
    impact:
      "Un portal bancario sobrecargado, reconstruido como un solo producto liviano y legible, sobre un sistema documentado que hizo cada pantalla más barata que la anterior.",
    context:
      "El portal era denso y difícil de recorrer, y cada squad resolvía los mismos problemas a su manera. Lo rediseñé y construí Velocity para resolver ambas cosas.",
    contributions: [
      "**Rediseñé el portal transaccional**: ingreso, cuentas, tarjetas, transferencias, pagos y bloqueo de productos, idéntico en escritorio, tableta y celular.",
      "**Construí Velocity, el sistema de diseño del banco**: de fundamentos a organismos, con diseño atómico para que el front end lo refleje.",
      "**Guardián del sistema de diseño**: aprobé adiciones, deprecaciones y patrones para más de 12 squads, y dirigí los talleres y las críticas.",
    ],
    kpis: [
      { label: "Squads de producto alineados", delta: "un solo sistema" },
      { value: "6 años", label: "Como guardián del sistema de diseño" },
      { label: "Áreas del sistema documentadas", delta: "de fundamentos a organismos" },
      { label: "Íconos ilustrados", delta: "dibujados para el sistema" },
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
        body: "El brief pedía algo similar. Cada capacidad del escritorio llega al celular con los mismos nombres, en el mismo orden: nada que volver a aprender en el bus.",
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
        caption: "Ingreso, sin nada que distraiga a mitad de la tarea.",
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
        caption: "Profundidad en vez de anidación: dos capas, cada tarea.",
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
    duration: "En vivo desde el 21 sep 2026 — sigue saliendo",
    team: "Solo — producto, diseño, código",
    tagline:
      "El panel que maneja una clínica desde el celular de la secretaria. Ningún procedimiento empieza sin estar pagado.",
    impact:
      "Dos semanas del primer commit a la versión que la clínica usa hoy: cada paciente con una fase, un saldo y un siguiente paso.",
    context:
      "La clínica de medicina estética de la que soy socio, en Barranquilla, funcionaba con WhatsApp, Google Calendar y un Drive compartido: todo escrito, nada conectado. Construí un panel encima de esas herramientas, no en su lugar.",
    contributions: [
      "**Tres fases con candado**: valoración, pago, procedimiento; la luz verde del procedimiento exige el pago completo, su recibo y el consentimiento firmado.",
      "**Un archivo, dos entornos**: un artifact de Claude de solo lectura y un panel web detrás de un Cloudflare Worker.",
      "**Reglas como funciones con pruebas**: saldos, comisiones de tarjeta, fechas y el emparejado de nombres, cubiertos por 12 suites de pruebas.",
    ],
    kpis: [
      { label: "Días, del primer commit a la versión de hoy", delta: "19 sep → 2 oct 2026" },
      { label: "Fases con candado", delta: "valoración, pago, procedimiento" },
      { label: "Bases de datos nuevas", delta: "Drive y Calendar siguen siendo la fuente de verdad" },
      { label: "Suites de pruebas", delta: "dominio, contabilidad, worker, navegador" },
    ],
    process: [
      {
        title: "Primero se atacó el plan",
        body: "Mapeé cómo funcionaba de verdad la clínica y luego sometí el plan a una revisión adversarial en datos, seguridad y factibilidad. Encontró las trampas que esconden las hojas; solo la tercera versión llegó al código.",
      },
      {
        title: "Primero leer, después escribir",
        body: "La primera versión fue un artifact de Claude de solo lectura, seguro para ponerlo frente a la clínica desde el primer día. La escritura llegó después, con un usuario por persona y una auditoría de seguridad; en vivo desde el 21 de septiembre.",
      },
      {
        title: "El celular reescribió la interfaz",
        body: "La secretaria maneja la clínica desde un iPhone, muchas veces desde el carro. Por eso el panel se instala como app, las tablas se vuelven tarjetas, cada zona táctil mide al menos 44 píxeles y una nota de voz llena el formulario de paciente nueva.",
      },
      {
        title: "Plata real, y después pedidos reales",
        body: "Los pagos reales trajeron reglas que ningún plan tenía: una tarjeta de crédito entra al 95 %, porque la clínica le traslada la comisión a la paciente. Después la clínica empezó a pedir: cupos, agenda por ciudad, permisos. La mayoría salió en menos de un día.",
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
    featuresIntro:
      "Un solo tablero con el día de la clínica: en un portátil en recepción o en un celular dentro de un carro.",
    features: [
      {
        title: "Una nota de voz que llena el formulario",
        body: "Di quién llegó, para qué y qué pagó. El modelo llena el formulario y no guarda nada hasta que una persona lo revisa.",
      },
      {
        title: "Fases con candado",
        body: "Cada fase lista lo que falta y lleva al formulario que lo resuelve. El pie siempre nombra el siguiente paso.",
      },
      {
        title: "Los cupos del médico, listos para enviar",
        body: "El documento que la secretaria ya lleva se vuelve una semana de cupos en rojo y verde, avisa los días que caen en dos ciudades y se copia a WhatsApp.",
      },
      {
        title: "Recibos y facturas leídos por IA",
        body: "Fotografía un recibo, una factura de proveedor o gastos de viaje: los valores vuelven llenos para revisar y luego van al inventario o a la contabilidad del mes.",
      },
    ],
    video: {
      label:
        "En el celular: una nota de voz llena el formulario de paciente nueva, la valoración toma una hora libre del calendario de la clínica y, al guardar, se abre el caso en la fase uno",
      caption:
        "Una nota llena el formulario de paciente nueva y abre el caso; en esta demo, reglas simples reemplazan al modelo.",
    },
    // Paired by index with work.ts: the case sheet leads, then the agenda.
    gallery: [
      {
        alt: "La ficha del caso de una paciente abierta sobre la lista de casos: un indicador de tres pasos con valoración y pago completos y el procedimiento en curso, el procedimiento definido en cuatro viales para rostro y cuello, la fecha del procedimiento agendada, una barra de pagos en 5,3 de 9,8 millones de pesos, los pagos del caso del más reciente al más antiguo y un pie que nombra el siguiente paso: registrar el pago final.",
        caption: "El caso: qué está pagado, qué falta y la única acción que sigue.",
      },
      {
        alt: "La agenda en vista de mes: septiembre de 2026 de lunes a domingo, con las citas de cada día como líneas cortas del color de su ciudad —naranja para Barranquilla, azul para Bogotá, verde azulado para Medellín—, una franja de color sobre los días que el médico pasa en cada ciudad y un conteo de citas por ciudad encima de la grilla.",
        caption: "Un mes de citas, cada una con el color de su ciudad.",
      },
      {
        alt: "La agenda en vista de día para el jueves 24 de septiembre: un aviso de que el médico está en Medellín según el calendario, las citas como tarjetas por hora con su tipo y su ciudad, una línea roja que marca la hora actual y botones de ficha y calendario en cada tarjeta.",
        caption: "Un día por horas, y la ciudad donde está el médico.",
      },
      {
        alt: "Los cupos del médico para la semana del 5 al 11 de octubre: siete columnas, cada una con la ciudad donde está el médico, horas marcadas como ocupadas en rojo o libres en verde, un conteo de horas libres en los próximos dos meses y un botón para copiar dos meses de cupos para WhatsApp.",
        caption: "Los cupos del médico, leídos del propio documento de la secretaria.",
      },
      {
        alt: "El tablero de seguimiento: contadores de valoraciones, procedimientos, controles por reagendar, esta semana, los próximos 30 días y controles sin fecha; pestañas de valoraciones, procedimientos, controles, agenda, cupos y por cobrar; filtros por ciudad; y una tabla de controles a los 45 días, cada uno con los días que faltan, su estado y un botón de WhatsApp.",
        caption: "El seguimiento, contado: a quién le toca, quién no tiene fecha y quién se quedó atrás.",
      },
      {
        alt: "Edición de un usuario en Usuarios y permisos: la cuenta del médico en solo ver, con casillas para ver, crear y editar por área —y borrar, en pacientes y casos— en agenda y seguimiento, pacientes y casos y pagos de pacientes, bajo plantillas para operar el día, solo ver y nada.",
        caption: "Permisos por área: el médico lee, la secretaria maneja el día.",
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
      "Soy socio de la clínica junto al médico y construí el panel de punta a punta. Él es dueño del protocolo médico; el uso diario de la secretaria moldeó los flujos. Pantallas y recorrido usan datos de prueba: ninguna paciente real, ninguna cifra de la clínica.",
  },

  "royal-caribbean": {
    category: "Viajes × Móvil",
    duration: "1 año",
    team: "Equipo multifuncional EE. UU. + LATAM",
    tagline:
      "Reservas móviles y experiencias a bordo para los huéspedes de Royal Caribbean en rutas por el Caribe y el Mediterráneo.",
    impact:
      "Un solo recorrido móvil desde la reserva hasta el desembarque —horarios, restaurantes, excursiones, saldos— que aguanta el Wi-Fi irregular de un barco.",
    context:
      "Huéspedes de todas las edades y niveles de comodidad con la tecnología pasan una semana a bordo con una conexión irregular. Diseñé la reserva y la experiencia a bordo para que les sirvieran a todos.",
    contributions: [
      "**Reservas móviles**: flujos para distintos destinos y tipos de camarote.",
      "**Experiencia a bordo**: horarios, restaurantes, excursiones y saldos que funcionan con un Wi-Fi intermitente.",
      "**Colaboración remota**: con producto e ingeniería en la sede de Royal Caribbean en Estados Unidos.",
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
      "Un constructor de automatizaciones para encuestas —disparador, condición, acción— para personas que nunca habían dibujado un diagrama de flujo.",
    impact:
      "Una mala respuesta podía responderse sola: una encuesta de seguimiento una semana después y los resultados en la bandeja correcta, sin nadie pendiente.",
    context:
      "Qrvey era una plataforma de encuestas y NPS; alguien todavía tenía que actuar sobre las respuestas. Como diseñador UI líder, diseñé AutomatiQ, el constructor que lo hacía.",
    contributions: [
      "**Una lista que informa sobre sí misma**: cada proceso muestra su estado, las encuestas que cubre, el tiempo promedio de ciclo y los ciclos que ha corrido.",
      "**Tarjetas, no un lienzo**: disparadores y condiciones se abren en su sitio, con las palabras del producto; sin conectores que dibujar.",
      "**El seguimiento es la siguiente encuesta**: los correos llevan los resultados y un enlace vivo a una encuesta en el cuerpo.",
    ],
    // Paired by position with `work.ts`, which sets the order (cover first).
    gallery: [
      {
        alt: "La pestaña de Automatización de Qrvey: un botón de Crear proceso sobre una lista de tarjetas de procesos, cada una con una barra de estado de color que dice En ejecución o En pausa, su nombre y fecha de creación, y tres cifras: encuestas cubiertas, tiempo promedio y ciclos ejecutados. Una barra lateral ofrece encuestas de ejemplo y consejos.",
        caption: "Cada proceso: en ejecución o en pausa, y lo que ha hecho.",
      },
      {
        alt: "Una condición bajo un disparador de Respuesta nueva: dos pastillas, Si la respuesta es y Número de respuestas, sobre un panel con una pregunta y sus filas de respuestas con botones para agregar o quitar cada una, y una fila de Seleccionar acción esperando debajo.",
        caption: "Condiciones con las palabras del producto: «si la respuesta es», «número de respuestas».",
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
      "Diseño listo para desarrollo en fintech, marketplaces y B2B: la soltura entre dominios que después hizo natural el trabajo de sistemas.",
    context:
      "Una agencia remota, donde el trabajo era aprender rápido el dominio de cada cliente y entregar un diseño limpio.",
    contributions: [
      "**Wireframes y UI kits**: para productos fintech, de consumo y B2B.",
      "**Prototipos de alta fidelidad**: para validar con stakeholders y entregar a desarrollo.",
      "**Patrones reutilizables**: aplicados entre clientes y ajustados a cada uno.",
    ],
    kpis: [
      { value: "Agencia", label: "Un dominio nuevo en cada proyecto" },
      { value: "EE. UU. + LATAM", label: "Clientes distribuidos" },
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
      "Reserva un carro por minuto, conoce el costo de antemano y después controla la cabina.",
    impact:
      "Un flujo de reserva que responde lo que las apps de alquiler suelen esconder —qué carro es y cuánto cuesta el viaje— antes de que te comprometas.",
    context:
      "Chub reserva un carro, no un viaje: eliges un vehículo, ves su autonomía y su tarifa por minuto, y cuando arranca el viaje la app se convierte en los controles de la cabina.",
    contributions: [
      "**La decisión en una sola tarjeta**: autonomía, aceleración, puestos y la tarifa por minuto, encima del botón.",
      "**El costo por adelantado**: recogida, destino, tiempo estimado y un rango de tarifa, antes de que empiece el viaje.",
      "**La app se vuelve el carro**: en pleno viaje maneja el clima y los asientos ventilados, y muestra la temperatura y la velocidad.",
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

  makeappet: {
    category: "iOS × Adopción de mascotas",
    clientOverride: "Proyecto freelance paralelo",
    roleOverride: "Diseñador de producto — de punta a punta",
    team: "Yo y el equipo de desarrollo, hasta la entrega",
    tagline:
      "Desliza para conocer a un perro o un gato cerca: el patrón de las apps de citas que todos conocen, apuntado a la adopción.",
    impact:
      "La adopción tomó prestada la interacción que todo el mundo ya sabe usar, y puso la petición de donación de los refugios donde ya estaba la atención.",
    context:
      "MakeAppet aplica el deslizar para hacer match a encontrar una mascota cerca: explorar por especie, deslizar entre las que están cerca y abrir un perfil completo antes de decidir.",
    contributions: [
      "**Nadie adopta por una foto**: un toque más adentro, el perfil suma raza, peso, sexo y una descripción.",
      "**Dos formas de entrar**: deslizar para explorar, o filtrar por especie y distancia cuando ya sabes qué buscas.",
      "**La petición del refugio donde la gente mira**: un panel de donación entre la búsqueda y los resultados, no escondido en un menú.",
    ],
    // Paired by position with `work.ts`, which sets the order (cover first).
    gallery: [
      {
        alt: "La pantalla para deslizar: pestañas For you y Nearby sobre una tarjeta a sangre con la foto de un perro, su nombre, edad y distancia, y botones redondos para descartar y dar like debajo.",
        caption: "El patrón que todos ya conocen, sin cambios.",
      },
      {
        alt: "El perfil de una mascota: una fotografía grande, el nombre y la distancia, una grilla de cuatro celdas con edad, raza, sexo y peso, una descripción escrita y un botón principal de Bark me junto a uno de favorito.",
        caption: "Lo que una foto no puede contar.",
      },
      {
        alt: "La pantalla de match: un título de Congratulations con una cinta de It's a Match, las dos mascotas a cada lado de un corazón, una frase de saludo sugerida y un botón de Say woof sobre un enlace de Not now.",
        caption: "Un match, y algo que decir.",
      },
      {
        alt: "La pantalla de exploración: una ubicación y un campo de búsqueda con filtros, un panel violeta que pide una donación a nombre de los refugios, y luego una sección de Adopción con pestañas por especie y una grilla de mascotas cercanas.",
        caption: "Explorar por especie, con la petición de los refugios incluida.",
      },
      {
        alt: "La pantalla de bienvenida: una grilla de fotografías de perros con sus dueños detrás de una huella, la frase «Connect and uncover the ideal pets that match your preferences in your area» y un botón de Explore.",
        caption: "La premisa, antes de pedir una cuenta.",
      },
    ],
    technologies: ["Sketch", "iOS", "Prototipado", "Entrega a desarrollo"],
    credits:
      "Diseño de producto de punta a punta, entregado al equipo de desarrollo que lo construyó. Nunca se lanzó.",
  },
};

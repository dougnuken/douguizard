# SEGURIDAD · cruce de medios del caso DC Medical contra datos reales

Fecha: 2026-10-11 · commit evaluado: bdb3f47 (rama claude/eloquent-mayer-by6jn3) · responsable: pf-security.
Método: lista de reales armada fuera del repo (nombres, teléfonos y cifras de los fixtures y de los .xlsx del panel; ya borrada),
`leak-scan --denylist`, búsqueda de cifras reales en `src/` y `mockups/`, y revisión visual de 6 capturas, el póster, 13 fotogramas
del video (uno cada 1,5 s; 5 estados distintos) y `hero-mano`. Este archivo no contiene ningún dato real, ni parcial.

## Resultado por medio

| Medio | Qué se ve (categorías) | Veredicto | Acción mínima |
|---|---|---|---|
| Texto: `src/data/work.ts`, `src/data/es/work.ts`, `mockups/scenes/*.json` | alt, captions, credits: sin nombres de personas, teléfonos ni montos | OK (leak-scan: 0 hallazgos; sin cifras reales) | ninguna |
| `nota-de-voz-poster.jpg`, fotogramas de `nota-de-voz.mp4`, `scenes/hero-mano.*.webp` | nombres de pacientas inventados (ninguno coincide con la lista de reales, ni el nombre ni el apellido juntos); teléfono con el patrón 300 000 xxxx; iniciales de usuario; precio de la valoración (tarifa configurada de la clínica) | OK en nombres y teléfono; BAJO por la tarifa (es un precio de lista, no de una paciente) | confirmar con Doug que la tarifa de valoración puede ser pública |
| `agenda-dia.webp`, `agenda-mes.webp` | nombres inventados de pacientas (sin coincidencia con reales); usuario «(demo)»; bandas de ciudad por días de septiembre | OK; BAJO: los bloques de ciudades por fechas podrían calcarse del Calendar real | Doug confirma que las fechas por ciudad son inventadas |
| `seguimiento-controles.webp`, `usuarios-permisos-v2.webp` | nombres inventados, procedimientos, ciudades, estados; usuario de demo con nombre de pila inventado | OK (sin coincidencias) | ninguna |
| `caso-fases-v2.webp` | lista de 7 casos con nombres inventados y un teléfono tipo 300 000 xxxx; montos de un caso (precio, pagado, saldo, abono, valoración) | CRÍTICO por regla: uno de los montos del panel de caso es igual a un monto del libro de casos real de los fixtures. Además la estructura (números de caso 0001–0006, mezcla procedimiento/ciudad por caso) calca el libro real: es «limpiado», no inventado desde cero | rehacer la captura con casos, números y montos inventados (no la misma secuencia de casos ni cifras reales) y renombrar a `-v3` |
| `cupos-semana.webp` | cupos del Dr. del 5 al 11 de oct, hora por hora, con ciudad por día y la franja libre; aviso de días repetidos en dos sedes con fechas de octubre y noviembre | CRÍTICO por regla (dato real, sin datos de pacientas): reproduce casillero por casillero la agenda real del Dr. y su calendario de viajes futuros | rehacer con cupos y fechas de otra semana inventada, y quitar o inventar el aviso de noviembre; renombrar a `-v2` |

## Notas
- Ningún correo, teléfono real, id de Drive ni enlace aparece en pantalla; los «Abrir el documento» no llevan URL visible.
- Hallazgos de coincidencia solo de apellido con datos de pruebas (no de pacientas) quedan descartados.
- No se pudo verificar contra la Drive real: la comparación es solo contra los fixtures y .xlsx del repo del panel.
- Las imágenes ya publicadas permanecen en el historial de git aunque se reemplacen; Doug decide si importa.

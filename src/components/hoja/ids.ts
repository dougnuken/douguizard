/** id del título del caso dentro de la hoja (lo usa `aria-labelledby` del `<dialog>`). */
export function tituloHojaId(slug: string) {
  return `hoja-titulo-${slug}`;
}

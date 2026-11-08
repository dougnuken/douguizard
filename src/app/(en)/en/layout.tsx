/**
 * Layout anidado de `/en` (F6, 07 §1.2): solo existe para alojar el slot
 * `@modal`. El root layout `(en)/layout.tsx` no es el nivel de `/en`, y `(.)`
 * se resuelve por segmentos: con el slot aquí, `(.)work/[slug]` intercepta
 * `/en/work/[slug]` y la hoja inglesa solo existe bajo `/en`.
 */
export default function EnLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}

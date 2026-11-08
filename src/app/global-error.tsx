"use client";

/**
 * F8 · Último recurso: si falla el propio layout raíz, Next pinta esto en su
 * lugar (documento propio, sin las fuentes ni el CSS del sitio). Estilos en
 * línea con los tokens B (`--vacio`, `--tinta`) para que no se vea roto.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          background: "#060608",
          color: "#f5f5f7",
          font: "16px/1.5 system-ui, sans-serif",
        }}
      >
        <main style={{ maxWidth: 560, padding: 24 }}>
          <h1 style={{ fontSize: 32, lineHeight: 1.1, margin: "0 0 16px" }}>
            Algo falló en esta página.
          </h1>
          <p lang="en" style={{ color: "#a1a1ab", margin: "0 0 32px" }}>
            Something broke on this page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: 44,
              padding: "0 20px",
              borderRadius: 999,
              border: 0,
              background: "#f5f5f7",
              color: "#060608",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Intentar de nuevo · Try again
          </button>{" "}
          {/* Recarga completa a propósito: el layout raíz es lo que falló. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{ color: "#f5f5f7", marginInlineStart: 16 }}>
            Inicio · Home
          </a>
        </main>
      </body>
    </html>
  );
}

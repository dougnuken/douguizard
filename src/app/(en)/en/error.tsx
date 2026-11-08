"use client";

import ErrorContent from "@/components/pages/ErrorContent";

/** F8 · Error de render en cualquier ruta EN (dentro del layout: cabecera y fuentes intactas). */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorContent locale="en" reset={reset} />;
}

import { Archivo, Geist_Mono } from "next/font/google";
import { htmlLang, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SiteHeader from "@/components/SiteHeader";
import { personJsonLd } from "@/lib/personJsonLd";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

/**
 * Resolution order: stored choice → `prefers-color-scheme: light` → dark.
 * Runs before the first paint, so a stored light theme never shows a dark frame.
 */
const THEME_INIT = `(function(){try{
var s=localStorage.getItem("dg-theme");
var t=(s==="light"||s==="dark")?s:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");
var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;
}catch(e){var r=document.documentElement;r.setAttribute("data-theme","dark");r.style.colorScheme="dark";}})();`;

/**
 * The document both languages share.
 *
 * Each language is its own root layout — `app/(es)/layout.tsx` and
 * `app/(en)/layout.tsx` — and both render this, so the only thing that differs
 * between them is the one thing that must: `<html lang>`. It is in the HTML the
 * server sends, not patched in afterwards, which is what a screen reader, a
 * translation prompt and a crawler all read.
 */
export default function RootDocument({
  locale,
  children,
  lost = false,
}: {
  locale: Locale;
  children: React.ReactNode;
  /**
   * The 404 for an address no route matches. It carries no `Person` node — a
   * 404 has nothing to say about anyone — and its language switch goes home.
   */
  lost?: boolean;
}) {
  const t = getDict(locale);
  return (
    <html
      lang={htmlLang[locale]}
      className={`${archivo.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      {/* This IS the root layout's document — both `app/(es)/layout.tsx` and
          `app/(en)/layout.tsx` return it — so `<head>` is the right element;
          the rule only recognises a `<head>` written inside `app/`. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <LocaleProvider locale={locale} lost={lost}>
          <a href="#main" className="skip-link">
            {t.meta.skip}
          </a>
          <SiteHeader />
          {children}
        </LocaleProvider>
        {!lost && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
          />
        )}
      </body>
    </html>
  );
}

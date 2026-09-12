import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";
import themeColors from "./theme-colors.json";
import { site } from "@/data/site";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://douguizard.com"),
  title: {
    default: `${site.name} — ${site.headline}`,
    template: `%s · ${site.name}`,
  },
  description: site.seo.description,
  keywords: site.seo.keywords,
  applicationName: site.brand,
  authors: [{ name: site.name, url: "https://douguizard.com" }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "https://douguizard.com",
    siteName: site.brand,
    title: `${site.name} — ${site.headline}`,
    description: site.seo.description,
    firstName: "Doug",
    lastName: "Vargas",
    username: "douguizard",
    images: [
      {
        // ⚠️ Build B generates public/og.png (08-assets.md). The reference is
        // fixed here so the contract cannot drift.
        url: site.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.headline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.headline}`,
    description: site.seo.description,
    images: [site.seo.ogImage],
    // No handle: Doug has no X account on record.
    // ⚠️ CONFIRMAR DOUG — add only if one exists.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "design",
  // ⚠️ CONFIRMAR DOUG — Search Console verification token, if Doug has one.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </body>
    </html>
  );
}

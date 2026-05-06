import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://douguizard.com"),
  title: {
    default: "Doug Vargas — Senior Product Designer × AI",
    template: "%s · Doug Vargas",
  },
  description:
    "Senior Product Designer & Design Systems Architect. 12+ years shipping digital products for banks, marketplaces, and consumer apps. Now bridging classical product craft with AI-native workflows.",
  keywords: [
    "Doug Vargas",
    "Product Designer",
    "Design Systems",
    "AI Product Design",
    "UX Designer Colombia",
    "Mercadolibre Designer",
    "Andes Design System",
  ],
  authors: [{ name: "Doug Vargas" }],
  creator: "Doug Vargas",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://douguizard.com",
    title: "Doug Vargas — Senior Product Designer × AI",
    description:
      "Senior Product Designer crafting the next generation of digital experiences with AI.",
    siteName: "douguizard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doug Vargas — Senior Product Designer × AI",
    description:
      "Senior Product Designer crafting the next generation of digital experiences with AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}

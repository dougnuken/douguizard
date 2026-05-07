import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#07060f",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://douguizard.com"),
  title: {
    default: "Douguizard — Doug Vargas · Senior Product Designer × AI",
    template: "%s · Douguizard",
  },
  description:
    "Senior Product Designer & Design Systems Architect. 12+ years shipping digital products for banks, marketplaces, and consumer apps. Now bridging classical product craft with AI-native workflows.",
  keywords: [
    "Doug Vargas",
    "Douguizard",
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
    title: "Douguizard — Senior Product Designer × AI",
    description:
      "Senior Product Designer crafting the next generation of digital experiences with AI.",
    siteName: "douguizard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Douguizard — Senior Product Designer × AI",
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
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
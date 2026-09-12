# 06 — SEO, metadata and structured data

Spec owner: data/SEO/copy agent. Depends on `01-data-model.md` (`site.seo`, `cv.ts`, `getCaseMeta`). Copy strings that also appear on screen live in `07-copy-deck.md`.

**The problem this fixes.** Today `<title>`, the meta description, OG and Twitter all say *"Senior Product Designer × AI"* — an identity no visible surface of the site uses any more, with no "design engineer", no "Head of Product" and no "Naowee" in the keywords (cvSync §2). Google, LinkedIn's link preview and Slack unfurls all serve the oldest version of Doug. Every string below derives from `site` so that can't happen again.

**Known URLs — do not invent others.**

| What | URL |
|---|---|
| Site | `https://douguizard.com` |
| LinkedIn | `https://linkedin.com/in/dougvargasco` |
| Behance | `https://www.behance.net/dougvargas` |
| GitHub | `https://github.com/dougnuken` ⚠️ CONFIRMAR DOUG |

`douguizard.webflow.io` (printed in the 2026 PDF) is **obsolete** and appears nowhere.

---

## 1. `src/app/layout.tsx` — root metadata

```ts
import type { Metadata, Viewport } from "next";
import { site } from "@/data/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Dark is the default theme (plan D1). Both entries are required so the
  // browser chrome follows the toggle, not just the system setting.
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#101010" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://douguizard.com"),
  title: {
    default: `${site.name} — ${site.headline}`,   // "Doug Vargas — Head of Product · Design Engineer"
    template: `%s · ${site.name}`,                 // "Banco de Occidente · Doug Vargas"
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
        url: site.seo.ogImage,       // "/og.png"
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
    // No `site` / `creator` handle: Doug has no X account on record.
    // ⚠️ CONFIRMAR DOUG — add only if one exists.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "design",
  // ⚠️ CONFIRMAR DOUG — Search Console verification token, if Doug has one.
  // verification: { google: "…" },
};
```

Rules the build agent must hold:
- `title.template` is `"%s · Doug Vargas"`, **not** `"%s · Douguizard"`. The brand is the wordmark; the person is what people search.
- Nothing in this file may contain a literal role string. If a grep for `Senior Product Designer` hits `layout.tsx`, the refactor is not done.
- `metadataBase` must stay — the relative `/og.png` and every per-page `alternates.canonical` resolve against it.

---

## 2. JSON-LD `Person`

Rendered once, in `app/layout.tsx`, inside `<body>` via `<script type="application/ld+json">` with `dangerouslySetInnerHTML` on a `JSON.stringify` of the object below (no user input reaches it, so there is nothing to escape). It must be built from `site` and `cv`, never typed out.

```ts
import { site } from "@/data/site";
import { education, certifications, skills } from "@/data/cv";
import { currentExperience } from "@/lib/career";

const current = currentExperience();

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://douguizard.com/#person",
  name: site.name,
  alternateName: site.brand,
  url: "https://douguizard.com",
  // image: "https://douguizard.com/doug-vargas.jpg",
  //   ⚠️ CONFIRMAR DOUG — only if he supplies a portrait at usable resolution.
  //   The one in the PDF is 190 px (plan D13). Omit the key entirely otherwise;
  //   never point it at a placeholder.
  jobTitle: site.headline,                 // "Head of Product · Design Engineer"
  description: site.seo.description,
  email: `mailto:${site.email}`,
  telephone: site.phoneHref.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.city,    // "Barranquilla"
    addressCountry: "CO",
  },
  worksFor: { "@type": "Organization", name: current.company.name },  // "Naowee"
  alumniOf: education.map((e) => ({
    "@type": "EducationalOrganization",
    name: e.institution,
  })),
  hasCredential: certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.name,
    credentialCategory: "certificate",
    recognizedBy: { "@type": "Organization", name: c.issuer },
  })),
  knowsAbout: skills.flatMap((g) => g.items.filter((i) => i.primary).map((i) => i.label)),
  knowsLanguage: [
    { "@type": "Language", name: "Spanish" },
    { "@type": "Language", name: "English" },
  ],
  sameAs: site.social.map((s) => s.href),
  //   → LinkedIn, Behance, GitHub (GitHub only if §Known URLs is confirmed).
  //   Dribbble is deliberately absent: the profile carries no work this site cites.
};
```

`WebSite` is **not** emitted: there is no site search, so `SearchAction` would be a lie, and a second top-level entity dilutes the Person. Individual case studies are **not** emitted as `CreativeWork` in phase 1 — several (Mercadolibre, Royal Caribbean) are NDA-shaped or client-owned and should not be indexed as authored artifacts. Revisit in phase 2.

---

## 3. `/cv` metadata

Replaces `src/app/cv/layout.tsx:3–7` — which today reads *"CV — Senior Product Designer × AI"* and lists Mercadolibre, Aval, Globant, Qrvey and Ideaware **without Naowee** (cvSync §2).

```ts
// src/app/cv/layout.tsx (or the page itself once the cosmic clone is deleted)
import type { Metadata } from "next";
import { site } from "@/data/site";
import { experiences } from "@/data/cv";
import { yearsOfExperience } from "@/lib/career";

const companies = experiences
  .filter((e) => e.era !== "earlier")
  .map((e) => e.company.name)
  .join(", ");        // "Naowee, Mercadolibre, Aval Digital Labs, Globant, Qrvey, Ideaware"

export const metadata: Metadata = {
  title: `CV — ${site.headline}`,   // renders "CV — Head of Product · Design Engineer · Doug Vargas"
  description:
    `Curriculum vitae of ${site.name}. ${yearsOfExperience()} years of product design and design engineering across ${companies}.`,
  alternates: { canonical: "/cv" },
  openGraph: {
    type: "profile",
    url: "https://douguizard.com/cv",
    title: `${site.name} — CV`,
    description: `${site.headline}. ${site.seo.description}`,
    images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: `${site.name} — CV` }],
  },
  robots: { index: true, follow: true },
};
```

The company list and the year count are **computed**, so adding an employer to `cv.ts` updates the description with no second edit. That is the whole point of the field.

---

## 4. `/work/[slug]` metadata

Replaces `src/app/work/[slug]/layout.tsx:19–26`, which reads `study.client` and `study.role` — both fields `01-data-model.md` removes.

```ts
import type { Metadata } from "next";
import { caseStudies, getCaseStudy } from "@/data/work";
import { getCaseMeta } from "@/lib/career";
import { site } from "@/data/site";

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case study not found", robots: { index: false, follow: false } };

  const meta  = getCaseMeta(study);
  const title = `${study.project} — ${meta.client}`;
  const url   = `/work/${study.slug}`;

  return {
    title,                       // → "Banco de Occidente — Banco de Occidente · Doug Vargas"  ← see note
    description: study.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: study.tagline,
      images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description: study.tagline },
  };
}
```

Two corrections the build agent must apply:

1. **Avoid the doubled name.** For `banco-de-occidente` and `qrvey` the project and the client are the same word, so `${project} — ${client}` stutters. Use `const title = study.project === meta.client ? study.project : \`${study.project} — ${meta.client}\`;`
2. **`olbo` is personal**, so `meta.client` is `"Personal product"`. Its title should be `"olbo — Personal product"`, which reads correctly; no special case needed beyond rule 1.

Per-case OG images are out of scope for phase 1 — one static `/og.png` for the whole site. If `08-assets.md` produces per-case images later, only the `images` array changes.

---

## 5. `src/app/robots.ts`

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://douguizard.com/sitemap.xml",
    host: "https://douguizard.com",
  };
}
```

Nothing is disallowed: the site has no private routes. Delete any `public/robots.txt` if one exists — a static file wins over the route handler and would silently freeze this.

---

## 6. `src/app/sitemap.ts`

```ts
import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/work";

const BASE = "https://douguizard.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // One build-time timestamp. Do NOT call new Date() per entry — it makes every
  // build claim every page changed, which trains crawlers to ignore lastModified.
  const lastModified = new Date();

  return [
    { url: BASE,          lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/cv`,  lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...caseStudies.map((c) => ({
      url: `${BASE}/work/${c.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
```

Nine URLs: `/`, `/cv`, and the seven cases. The home panels are anchors on one document and must not be listed separately.

---

## 7. OG image — content contract

The file itself belongs to `08-assets.md`. Its **text** is fixed here so it cannot drift from `site`:

```
Line 1 (mono, small, tracked):  PRODUCT × SYSTEMS × CODE
Line 2 (display, large):        Doug Vargas
Line 3 (display, medium):       Head of Product · Design Engineer
Line 4 (mono, small, dim):      douguizard.com
```

1200 × 630, dark ground `#101010`, ink `#F2F1EE`, one `#485EF2` radial glow bottom-right at ≤ 0.6 opacity. No photo, no logos, no red. Nothing on it says "Senior Product Designer".

---

## 8. Acceptance checks

- [ ] `grep -rn "Senior Product Designer × AI" src README.md` → no hits.
- [ ] `grep -rn "12+ years\|Twelve years\|A decade" src` → no hits outside `src/data`, `src/lib`.
- [ ] Rendered `<title>` on `/` is `Doug Vargas — Head of Product · Design Engineer`.
- [ ] `<meta name="description">` on `/` equals `site.seo.description`, ≤ 160 chars.
- [ ] `<meta property="og:image">` resolves to an existing 1200×630 file (200, not 404).
- [ ] JSON-LD validates in Google's Rich Results Test with zero errors; `sameAs` contains the LinkedIn URL.
- [ ] `/sitemap.xml` returns 9 URLs; `/robots.txt` points at it.
- [ ] Every `/work/*` page has a distinct `<title>` and a canonical matching its path.
- [ ] `<html lang="en">` — the site is entirely in English.
- [ ] The LinkedIn post-inspector preview for `douguizard.com` shows the new headline (re-scrape after deploy; LinkedIn caches aggressively).

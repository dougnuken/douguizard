# douguizard

> Senior Product Designer × AI · Doug Vargas · Personal site & CV
> Next.js 16 · React 19 · Framer Motion · React Three Fiber · Tailwind v4

---

## ⚡ Quick start

You need **Node.js 20+** installed (currently tested on Node 22). Then:

```bash
# 1. Install dependencies (~1 min)
npm install

# 2. Start dev server (Turbopack, hot reload)
npm run dev

# Open http://localhost:3000
```

That's it. The dev server boots in ~500ms.

---

## 📁 Project structure

```
douguizard/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout: fonts, metadata
│   │   ├── globals.css             # Tailwind v4 + design tokens
│   │   ├── page.tsx                # Home (the cinematic hero site)
│   │   ├── cv/
│   │   │   ├── layout.tsx          # CV layout (cursor)
│   │   │   └── page.tsx            # /cv route — print-to-PDF ready
│   │   └── work/[slug]/
│   │       ├── layout.tsx          # generateStaticParams + metadata
│   │       ├── page.tsx            # Cinematic case study page
│   │       └── not-found.tsx       # 404 for invalid slugs
│   │
│   ├── components/
│   │   ├── Loader.tsx              # Cinematic 0→100% loader
│   │   ├── CustomCursor.tsx        # Difference-blend cursor
│   │   ├── SmoothScroll.tsx        # Lenis smooth-scroll provider
│   │   │
│   │   ├── three/                  # React Three Fiber 3D scene
│   │   │   ├── Scene3D.tsx         # Canvas + scroll-driven layers
│   │   │   ├── Starfield.tsx       # 3,500 GPU-shader stars
│   │   │   ├── NebulaClouds.tsx    # 4 additive-blended spheres
│   │   │   ├── GeometricRings.tsx  # 3 rotating tori
│   │   │   ├── FloatingParticles.tsx  # 20 wireframe geometries
│   │   │   └── CinematicCamera.tsx # Scroll + mouse parallax cam
│   │   │
│   │   └── sections/               # Page sections
│   │       ├── Navigation.tsx
│   │       ├── Hero.tsx            # Masked-line text reveal
│   │       ├── Marquee.tsx
│   │       ├── Manifesto.tsx       # Word-by-word scroll reveal
│   │       ├── Capabilities.tsx    # Hover-spotlight cards
│   │       ├── Portfolio.tsx       # Floating preview on hover
│   │       ├── Stats.tsx           # Animated counters
│   │       └── Footer.tsx
│   │
│   └── data/
│       ├── cv.ts                   # CV content (single source)
│       └── work.ts                 # Case studies (single source)
│
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs              # Tailwind v4
└── README.md
```

## 🛣 Routes

| Route | Description | Type |
|---|---|---|
| `/` | Home — cinematic hero, 3D background, all sections | Static |
| `/cv` | Curriculum Vitae, print-to-PDF ready | Static |
| `/work/[slug]` | Individual case study pages | SSG (5 prerendered) |
| `/work/mercadolibre-andes` | Mercadolibre Andes Design System | SSG |
| `/work/banco-de-occidente` | Banco de Occidente | SSG |
| `/work/royal-caribbean` | Royal Caribbean | SSG |
| `/work/qrvey` | Qrvey | SSG |
| `/work/ideaware` | Ideaware co | SSG |

---

## 🎨 The animation system

### Tech stack
- **React Three Fiber v9** (`@react-three/fiber`) — Three.js in React, with React 19 support
- **Framer Motion v11** — declarative animations, scroll, gestures
- **Lenis v1** — buttery smooth scroll
- **Tailwind v4** — CSS-first config, design tokens in `globals.css`

### Scene composition (4 depth layers)

| Layer | What | Parallax |
|---|---|---|
| **Starfield** | 3,500 GPU-shader points with twinkle | Z drift -200 over scroll |
| **Nebula** | 4 additive spheres breathing | Z drift -80 |
| **Rings** | 3 tori rotating per-axis | Scale 1→1.6, Z drift -100 |
| **Particles** | 20 wireframe octahedra/tetrahedra | Z forward +50 |

### Camera (scroll 0% → 100%)
```
position.z   : 300 → 220 → 300   (dolly in mid, dolly back)
fov          : 50  → 54  → 50    (FOV breathing)
position.y   : 0   → -80         (vertical pan)
position.x   : ±12 lerp           (mouse parallax)
lookAt       : drifts y -40       (with mouse offset)
```

Smoothing: `lerp 0.08` per frame for natural easing.

### Lighting (3-point cinematic rig)
- **Key**: warm `#ff8b5e` top-left, intensity 1.2 + scroll-modulated
- **Fill**: cool `#5eb8ff` bottom-right, 0.8 inverse phase
- **Back**: violet `#8b7fff` behind scene, constant 0.6
- **Ambient**: `#1a1530`, 0.4
- **Fog**: `FogExp2 0.0008` for soft far-distance fade

### Framer Motion patterns used

- `useScroll` + `useTransform` for word-by-word manifesto reveal
- `useMotionValue` + `useSpring` for cursor and floating preview
- `useInView` + `animate` for counters
- `motion.div` with `whileInView` for section reveals
- `AnimatePresence` for loader and preview unmount

---

## 🚀 Deploy

### Recommended: **Vercel** (creator of Next.js, zero-config)

```bash
npm i -g vercel
vercel
# Follow prompts, app live in ~1 minute
```

For custom domain:
1. In Vercel dashboard → Settings → Domains
2. Add `douguizard.com`
3. Vercel shows the DNS records to set at your registrar
4. Wait ~10 min for propagation
5. HTTPS auto-provisioned

### Alternative: **Netlify**
```bash
npm run build
# Drag the .next/ folder onto https://app.netlify.com/drop
```

### Buying the domain (`douguizard.net` if `.com` is taken)

Recommended registrars (cheapest first):
- **Cloudflare Registrar** — at-cost (~$10/yr `.net`), no markup
- **Porkbun** — ~$11/yr, best UI
- **Namecheap** — ~$13/yr
- **Avoid GoDaddy** — cheap year 1, expensive renewals

To check availability: type the domain into any of those sites.

---

## ✏️ Updating content

### CV
All CV data lives in **one file**: `src/data/cv.ts`. Edit the arrays:
- `experiences` — work history
- `education` — degrees + certs
- `skills` — capability tag groups
- `tools` — toolkit chips
- `languages` — language proficiencies

Save → page hot-reloads. No build needed in dev.

### Case studies
All case study data lives in **`src/data/work.ts`**. Each entry has:
- `slug` — URL path (e.g. `/work/my-project`)
- `client`, `project`, `year`, `role`, `team`, etc.
- `tagline` — hero subtitle
- `challenge` — problem statement (1 paragraph)
- `approach` — array of steps (use `**bold**` for emphasis)
- `outcome` — headline + description + optional metrics
- `colors` — `[from, to]` for the gradient cover
- Optional: `technologies`, `externalLink`

To add a new case study:
1. Add an entry to `caseStudies` in `src/data/work.ts`
2. The route `/work/your-slug` is auto-generated
3. The Portfolio list on the home page picks it up automatically

### Site copy
Each section is its own component in `src/components/sections/`. Edit the JSX directly.

### Color tokens
All colors are CSS variables defined in `src/app/globals.css` under `@theme`. Change one value, propagates everywhere.

```css
@theme {
  --color-accent: #8b7fff;       /* primary violet */
  --color-accent-warm: #ff8b5e;  /* sunset */
  --color-accent-cool: #5eb8ff;  /* nebula blue */
  /* ... */
}
```

---

## 🛠 Common tasks

### Add a new project to the portfolio list
Edit `src/components/sections/Portfolio.tsx` → add a new entry to the `works` array:
```tsx
{
  num: "/06",
  name: { plain: "Project name", accent: "Highlight" },
  role: "Your role · Description",
  year: "2024 — 2025",
  colors: ["#8b7fff", "#5eb8ff"],
  href: "https://...",  // optional
},
```

### Change the manifesto
Edit `src/components/sections/Manifesto.tsx` → `manifestoText` string.
- Wrap accent words in `{curly braces}` → renders italic violet
- Wrap warm-accent words in `[square brackets]` → renders italic orange

### Add a new section
1. Create `src/components/sections/NewSection.tsx`
2. Import and add to `src/app/page.tsx` between existing sections

---

## 🧪 Available scripts

```bash
npm run dev       # Dev server with Turbopack hot reload
npm run build     # Production build
npm run start     # Run production build
npm run lint      # ESLint check
```

---

## 📦 What's in package.json

| Package | Why |
|---|---|
| `next` 16.2 | Latest stable; Turbopack dev/build |
| `react` 19 | Latest, paired with Next 16 |
| `framer-motion` 11 | Animation engine |
| `three` 0.170 | 3D library |
| `@react-three/fiber` 9 | React renderer for Three (React 19 compatible) |
| `@react-three/drei` 10 | R3F helpers (loaded but minimally used) |
| `lenis` 1 | Smooth scroll |
| `tailwindcss` 4 | CSS-first styling |

---

## 🎯 Next steps (when you're ready)

1. **Profile photo** — when you have one, add to `public/` and integrate into Hero
2. **Real case study pages** — add `app/work/[slug]/page.tsx` with MDX support for case studies
3. **Blog/Thinking section** — add `app/thinking/[slug]/page.tsx` for AI + design articles
4. **Open Graph image** — auto-generated social preview using Next's OG Image API
5. **Analytics** — Plausible, Fathom, or Vercel Analytics (privacy-first)
6. **Sitemap & robots.txt** — Next can generate these automatically

Each of these is a small, isolated addition. The core architecture handles them cleanly.

---

Built with care · Doug, May 2026.

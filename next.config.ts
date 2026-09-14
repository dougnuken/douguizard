import type { NextConfig } from "next";

/**
 * Response headers.
 *
 * They live here rather than in `vercel.json` for one reason: `next start`
 * serves them too, which means `tests/e2e/security.spec.ts` can assert them on
 * every run. Headers configured at the host are invisible to the test suite
 * and drift the moment nobody is looking.
 */
const CSP = [
  // Nothing loads from anywhere but this origin. The site has no third-party
  // script, no analytics, no tag manager and no web font host — `next/font`
  // self-hosts Archivo and Geist Mono at build time — so `'self'` is not a
  // compromise here, it is the full list.
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  // Belt to `X-Frame-Options`' braces, and the one modern browsers read.
  "frame-ancestors 'none'",
  "form-action 'self'",
  // `'unsafe-inline'`, deliberately, and worth being precise about. The App
  // Router streams its RSC payload as ~30 inline `<script>` tags per page and
  // the theme resolver has to run before first paint; hashing those is not
  // possible (the payload differs per page and per build) and a nonce means
  // middleware, which means every page renders dynamically instead of being
  // served from the CDN. What `'unsafe-inline'` costs is protection against an
  // injected inline script — and injection needs an injection point. This site
  // renders no user input, has no forms, no search, no query parameters and no
  // comments: there is nothing to inject through. What the directive still
  // buys, and what actually matters here, is that an injected `<script src>`
  // pointing anywhere off this origin is refused.
  "script-src 'self' 'unsafe-inline'",
  // Same reasoning, plus every `style={{…}}` in the tree is an inline style.
  "style-src 'self' 'unsafe-inline'",
  // `data:` for the blur placeholders `next/image` inlines.
  "img-src 'self' data:",
  "font-src 'self'",
  // The case-study captures, all local files.
  "media-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Everything off by default. `autoplay` is the exception: the case pages play
 * muted local captures of the products, and `()` would stop them.
 */
const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "autoplay=(self)",
  "browsing-topics=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "idle-detection=()",
  "local-fonts=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "serial=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  // Two years, subdomains included, and preload-eligible. Vercel's default
  // sets the max-age alone, which is not enough to be submitted to the
  // preload list — and without preload the very first request to the domain
  // is still an unprotected one.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
  // Severs the opener relationship, so a page opened from here (every
  // `target="_blank"` on the site) cannot reach back through `window.opener`.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  // `poweredByHeader` off: `X-Powered-By: Next.js` tells an attacker which
  // stack to bring exploits for and tells a visitor nothing.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // The widths the layout actually asks for: phone frame ≤ 400 CSS px,
    // browser frame ≤ 1330 CSS px, both at DPR 1–3. Trimming the default
    // ladder removes transform variants nothing ever requests.
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048],
    imageSizes: [200, 256, 384, 400, 800],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // Content-addressed by Next, so it can never go stale.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // NOT immutable: these filenames carry no hash, and the header avatar
        // has already been replaced once under the same name. A day of cache
        // with a week of stale-while-revalidate gets the repeat-visit win
        // without pinning a wrong face in somebody's browser for a year.
        source: "/:path(portrait|work)/:rest*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Regenerated by `npm run cv:pdf` whenever the data moves, so it is
        // revalidated every time rather than cached.
        source: "/cv/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;

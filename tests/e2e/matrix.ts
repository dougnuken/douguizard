export const WIDTHS = [320, 375, 768, 1024, 1440, 1920];
export const THEMES = ["dark", "light"] as const;
export const ROUTES = [
  "/",
  "/cv",
  "/work/olbo",
  "/work/naowee-suid",
  // DC Medical is the only case with no employer behind it AND a client name
  // of its own (`clientOverride`), so it is the one page whose meta strip is
  // built from the override rather than from an experience.
  "/work/dc-medical",
  "/work/banco-de-occidente",
  // Qrvey joined the matrix when it gained a gallery: it is now the only case
  // with a "plain" gallery and no KPI band, so it exercises two paths the
  // other four do not.
  "/work/qrvey",
];

/**
 * The same pages in English, one segment down. The matrix above is the Spanish
 * site — the primary one, served at the root — and every layout, contrast and
 * motion check runs there; the English tree is held to the head, structure and
 * wording checks in `seo.spec.ts`, `content.spec.ts` and `i18n.spec.ts`.
 */
export const EN_ROUTES = ROUTES.map((r) => (r === "/" ? "/en" : `/en${r}`));

/** Seeded via addInitScript before first navigation so the anti-flash script sees it. */
export const setTheme = (t: string) =>
  `try{localStorage.setItem("dg-theme", ${JSON.stringify(t)})}catch(e){}`;

export const slugify = (route: string) => route.replace(/\W+/g, "_") || "_root";

export const WIDTHS = [320, 375, 768, 1024, 1440, 1920];
export const THEMES = ["dark", "light"] as const;
export const ROUTES = [
  "/",
  "/cv",
  "/work/olbo",
  "/work/naowee-suid",
  // DC Medical is the only case with no employer behind it AND a client name
  // of its own (`kind: "side"` + `clientOverride`), so it is the one page that
  // renders that meta strip.
  "/work/dc-medical",
  "/work/banco-de-occidente",
  // Qrvey joined the matrix when it gained a gallery: it is now the only case
  // with a "plain" gallery and no KPI band, so it exercises two paths the
  // other four do not.
  "/work/qrvey",
];

/** Seeded via addInitScript before first navigation so the anti-flash script sees it. */
export const setTheme = (t: string) =>
  `try{localStorage.setItem("dg-theme", ${JSON.stringify(t)})}catch(e){}`;

export const slugify = (route: string) => route.replace(/\W+/g, "_") || "_root";

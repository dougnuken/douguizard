export const WIDTHS = [320, 375, 768, 1024, 1440, 1920];
export const THEMES = ["dark", "light"] as const;
export const ROUTES = [
  "/",
  "/cv",
  "/work/olbo",
  "/work/naowee-suid",
  "/work/banco-de-occidente",
];

/** Seeded via addInitScript before first navigation so the anti-flash script sees it. */
export const setTheme = (t: string) =>
  `try{localStorage.setItem("dg-theme", ${JSON.stringify(t)})}catch(e){}`;

export const slugify = (route: string) => route.replace(/\W+/g, "_") || "_root";

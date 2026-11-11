import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

/**
 * Specs de medida (`tests/medidas/`): no afirman nada, solo escriben JSON en
 * `tests/out/` (marcos, rojos, anillo de foco, contraste). Fuera de la suite
 * normal; se corren a mano con `npx playwright test -c playwright.medidas.config.ts`.
 */
export default defineConfig({ ...base, testDir: "tests/medidas" });

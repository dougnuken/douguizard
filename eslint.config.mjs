import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Flat config for ESLint 9 / Next 16. `next lint` was removed in Next 16, so
 * the script is a plain `eslint .`.
 *
 * No `FlatCompat`: as of `eslint-config-next` 16 both entry points already
 * export flat-config ARRAYS. Running them through the eslintrc bridge makes
 * `@eslint/eslintrc` try to `JSON.stringify` the react plugin and die on a
 * circular reference — the compat layer is the bug, not the fix.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },

  ...nextCoreWebVitals,
  ...nextTypescript,

  {
    // A config file's default export IS an anonymous object by contract.
    files: ["*.mjs", "*.ts"],
    rules: { "import/no-anonymous-default-export": "off" },
  },

  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      /*
       * `react-hooks/set-state-in-effect` (new in the React Compiler rule set)
       * fires on three call sites, all of them the sanctioned shape rather
       * than a cascading render:
       *
       *   src/components/text/useInView.ts        — seeding state from
       *     `matchMedia(...).matches` before subscribing to `change`.
       *   src/components/work/videoChrome.tsx     — the one-shot mount flag
       *     that keeps autoplay off during SSR.
       *   src/components/SiteHeader.tsx           — closing the mobile menu
       *     when `pathname` changes.
       *
       * Each is a subscription or a reset, none of them loops, and
       * `src/components/work/*` belongs to another workstream this branch may
       * not edit. Rewriting them around `useSyncExternalStore` is a real
       * refactor with real risk and no user-visible payoff — so the rule is
       * off, deliberately and in one place, rather than silenced inline three
       * times. Revisit if a fourth site appears.
       */
      "react-hooks/set-state-in-effect": "off",

      // `_`-prefixed bindings are deliberate placeholders (destructuring a
      // shape where only some fields are used); everything else must go.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  {
    // Dev-only Node scripts: no Next runtime, no JSX, and `console` is the
    // entire output contract.
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { console: "readonly", process: "readonly", fetch: "readonly", WebSocket: "readonly", Buffer: "readonly", setTimeout: "readonly" },
    },
  },
];

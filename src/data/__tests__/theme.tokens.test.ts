import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import themeColors from "@/app/theme-colors.json";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

/** Reads `--paper: <value>;` out of a `:root…{ … }` block. */
function paperIn(selector: string): string {
  const block = css.split(selector)[1]?.split("}")[0] ?? "";
  const match = block.match(/--paper:\s*([^;]+);/);
  if (!match) throw new Error(`No --paper declaration under "${selector}".`);
  return match[1].trim().toLowerCase();
}

describe("theme tokens", () => {
  it("themeColor mirrors --paper in both appearances", () => {
    expect(themeColors.dark.toLowerCase()).toBe(paperIn(":root {"));
    expect(themeColors.light.toLowerCase()).toBe(paperIn(':root[data-theme="light"] {'));
  });

  it("declares the accent only as signal tokens", () => {
    expect(css).toContain("--signal:");
    expect(css).not.toContain("--color-accent");
  });

  it("carries no retired utility families", () => {
    for (const dead of [".glass", ".cosmic-", ".btn-accent", ".btn-outline", "theme-dark"]) {
      expect(css.includes(dead), dead).toBe(false);
    }
  });
});

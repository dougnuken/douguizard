import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

function walk(dir: string, exts: string[]): string[] {
  let out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out = out.concat(walk(full, exts));
    else if (exts.some((e) => entry.endsWith(e))) out.push(full);
  }
  return out;
}

const isDataOrLib = (file: string) => {
  const rel = relative(SRC, file);
  return rel.startsWith("data/") || rel.startsWith("lib/");
};

/** The guard itself quotes the strings it bans, so its own suite is excluded. */
const sourceFiles = walk(SRC, [".ts", ".tsx"]).filter(
  (f) => !relative(SRC, f).includes("__tests__"),
);
const componentFiles = sourceFiles.filter((f) =>
  relative(SRC, f).startsWith("components/"),
);

function hits(files: string[], pattern: RegExp): string[] {
  const found: string[] = [];
  for (const file of files) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (pattern.test(line)) found.push(`${relative(ROOT, file)}:${i + 1} — ${line.trim()}`);
      });
  }
  return found;
}

describe("components declare no career data", () => {
  it("no component contains an array literal with company:", () => {
    // A literal value is the failure; `company: e.company.name` (a mapping over
    // `cv.experiences`) is exactly the shape this refactor wants.
    expect(hits(componentFiles, /\bcompany\s*:\s*["'`]/)).toEqual([]);
  });

  it("no component hardcodes a year count", () => {
    const outsideData = sourceFiles.filter((f) => !isDataOrLib(f));
    expect(hits(outsideData, /\b(Twelve|Eleven|Ten)\s+years\b/i)).toEqual([]);
    expect(hits(outsideData, /\bA decade\b/i)).toEqual([]);
  });

  it("no component hardcodes a role string", () => {
    const roles = [
      "Head of Product",
      "Tech Lead",
      "Technical Lead",
      "Senior Product Designer",
      "Design System Gatekeeper",
    ];
    const outsideData = sourceFiles.filter((f) => !isDataOrLib(f));
    for (const role of roles) {
      expect(hits(outsideData, new RegExp(role))).toEqual([]);
    }
  });

  it("the retired identity is gone", () => {
    const readme = join(ROOT, "README.md");
    const files = [...sourceFiles, readme];
    expect(hits(files, /Senior Product Designer × AI/)).toEqual([]);
    expect(hits(files, /Design Systems Architect/)).toEqual([]);
    expect(hits(files, /I transitioned/)).toEqual([]);
    expect(hits(files, /Available 2026/)).toEqual([]);
    expect(hits(files, /Dribbble/)).toEqual([]);
    expect(hits(files, /douguizard\.webflow\.io/)).toEqual([]);
  });
});

import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import {
  projectSourceFiles,
  ROOT,
  SOURCE_DIRECTORIES,
} from "@/test/source-files";

/** Project files outside the source directories that carry copy or URLs. */
const PROJECT_TEXT_FILES = [
  "README.md",
  ".env.example",
  "Dockerfile",
  "package.json",
  "next.config.ts",
];

/**
 * Retired names and domains. The production domain is satuporto.biz.id, so
 * the bare `satuporto.id` must not come back. The production domain never
 * matches, because "satuporto." is followed by "biz", not "id"; the `\b`
 * only stops the pattern matching longer labels such as "satuporto.idn".
 */
const RETIRED_BRANDING = [
  { name: "old product name", pattern: /one\s?-?porto/i },
  { name: "old domain satuporto.id", pattern: /satuporto\.id\b/i },
];

// This file is skipped: its samples of the retired domain are intentional.
const checkedFiles = [
  ...projectSourceFiles(SOURCE_DIRECTORIES, { includeTests: true }),
  ...PROJECT_TEXT_FILES.map((file) => join(ROOT, file)),
].filter((path) => path !== __filename);

describe("branding", () => {
  it("checks the source, tests and project docs", () => {
    expect(checkedFiles.length).toBeGreaterThan(PROJECT_TEXT_FILES.length);
  });

  it("matches the old domain but not the production one", () => {
    const [, oldDomain] = RETIRED_BRANDING;
    expect("https://satuporto.id/").toMatch(oldDomain.pattern);
    expect("budi@SatuPorto.ID").toMatch(oldDomain.pattern);
    expect("https://satuporto.biz.id/").not.toMatch(oldDomain.pattern);
  });

  it.each(checkedFiles.map((path) => [relative(ROOT, path), path]))(
    "%s uses only the current brand and domain",
    (_name, path) => {
      const text = readFileSync(path, "utf8");
      for (const { name, pattern } of RETIRED_BRANDING) {
        expect(text, name).not.toMatch(pattern);
      }
    },
  );
});

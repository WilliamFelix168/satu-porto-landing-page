import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { describe, expect, it } from "vitest";

import {
  projectSourceFiles,
  ROOT,
  SOURCE_DIRECTORIES,
} from "@/test/source-files";

/** Where client components live: every source directory except the tests. */
const APP_DIRECTORIES = SOURCE_DIRECTORIES.filter(
  (directory) => directory !== "test",
);

/**
 * Modules that build `Intl` formatters (or import ones that do). Client
 * components may only import their types; values are formatted on the
 * server and passed down as strings.
 */
const SERVER_FORMATTING_MODULES = [
  "@/lib/format",
  "@/lib/count-up",
  "@/lib/card-display",
  "@/lib/dashboard-display",
  "@/lib/ai-showcase-display",
];

const clientFiles = projectSourceFiles(APP_DIRECTORIES).filter((path) =>
  readFileSync(path, "utf8").startsWith('"use client";'),
);

describe("client component boundaries", () => {
  it("finds the client components to check", () => {
    expect(clientFiles.length).toBeGreaterThan(0);
  });

  it.each(clientFiles.map((path) => [relative(ROOT, path), path]))(
    "%s imports no Intl formatting code",
    (_name, path) => {
      const source = readFileSync(path, "utf8");
      for (const formattingModule of SERVER_FORMATTING_MODULES) {
        const valueImport = new RegExp(
          `import\\s+(?!type\\b)[^;]*from\\s+"${formattingModule}"`,
        );
        expect(source, formattingModule).not.toMatch(valueImport);
      }
    },
  );
});

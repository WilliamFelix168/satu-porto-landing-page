import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** The project root. */
export const ROOT = join(__dirname, "..");
/** Directories holding the app's TypeScript source. */
export const SOURCE_DIRECTORIES = ["app", "components", "lib", "test"] as const;

const SOURCE_FILE = /\.(ts|tsx)$/;
const TEST_FILE = /\.test\.(ts|tsx)$/;

interface SourceFileOptions {
  /** Include `*.test.ts(x)` files (default false). */
  includeTests?: boolean;
}

/** Every `.ts`/`.tsx` file under `directory`, recursively. */
export function sourceFiles(
  directory: string,
  { includeTests = false }: SourceFileOptions = {},
): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      return sourceFiles(path, { includeTests });
    }
    if (!SOURCE_FILE.test(entry)) return [];
    return includeTests || !TEST_FILE.test(entry) ? [path] : [];
  });
}

/** Source files across the given project directories. */
export function projectSourceFiles(
  directories: readonly string[],
  options?: SourceFileOptions,
): string[] {
  return directories.flatMap((directory) =>
    sourceFiles(join(ROOT, directory), options),
  );
}

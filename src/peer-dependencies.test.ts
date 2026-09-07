import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { join, extname, resolve } from "node:path";

const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "src");

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name === "test") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

/** `@scope/name/sub` -> `@scope/name`; `name/sub` -> `name`. */
function packageOf(specifier: string): string {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/**
 * Everything `src/` imports must be installable by a consumer without being asked.
 *
 * `@dnd-kit/core`, `/sortable` and `/utilities` were declared as **optional** peer
 * dependencies, and optional is what npm reads as "do not install unless asked". But
 * `src/index.ts` re-exports `SidebarPinnedSection`, which imports all three
 * unconditionally — so the barrel could not be resolved without them, and a consumer
 * importing a single Button got:
 *
 *   Cannot find package '@dnd-kit/core' imported from
 *   .../dist/components/layout/sidebar-pinned-section.js
 *
 * It stayed hidden while every consumer linked this package from source with `file:`,
 * where resolution fell through to this package's own node_modules. The first two
 * consumers to install a packaged copy both hit it, and both worked around it by
 * declaring three packages they never use.
 *
 * The rule this asserts is the general one, not that specific trio: if `src/` imports
 * it, a consumer must get it — as a dependency, or as a peer that is not optional.
 */
describe("dependency declarations", () => {
  it("declares every package src/ imports as a dependency or a required peer", async () => {
    const manifest = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));
    const dependencies = new Set(Object.keys(manifest.dependencies ?? {}));
    const peers = new Set(Object.keys(manifest.peerDependencies ?? {}));
    const optionalPeers = new Set(Object.keys(manifest.peerDependenciesMeta ?? {}));

    const specifier = /(?:from\s*|import\s*)['"]([^'".][^'"]*)['"]/g;
    const offenders: string[] = [];

    for await (const file of walk(SRC)) {
      if (![".ts", ".tsx"].includes(extname(file))) continue;
      if (/\.(test|stories)\.tsx?$/.test(file)) continue;

      const source = await readFile(file, "utf8");
      for (const [, spec] of source.matchAll(specifier)) {
        const pkg = packageOf(spec);
        if (dependencies.has(pkg)) continue;
        if (peers.has(pkg) && !optionalPeers.has(pkg)) continue;

        const why = optionalPeers.has(pkg)
          ? "declared as an OPTIONAL peer, so npm will not install it"
          : "not declared at all";
        offenders.push(`${file.replace(ROOT + "/", "")} imports ${pkg} — ${why}`);
      }
    }

    expect([...new Set(offenders)]).toEqual([]);
  });
});

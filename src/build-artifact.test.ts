import { describe, expect, it } from "vitest";
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const DIST = resolve(__dirname, "..", "dist");

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

/**
 * Guards the packaged artefact, not the source.
 *
 * `tsup` runs with `bundle: false` so the library stays tree-shakeable, and that
 * mode passes relative specifiers through untouched — producing `from
 * './components/accordion'` in ESM output, which Node refuses to resolve. Every
 * consumer here reached the library through a `file:` link to the source, where
 * Vite filled the extension in, so the broken artefact shipped in v1.2.2 and was
 * only found when the boilerplate installed a packaged version.
 *
 * `scripts/fix-esm-extensions.mjs` repairs this after the build; this is what stops
 * it silently regressing. Skips when there is no build, so `vitest` alone still runs.
 */
describe("dist (ESM artefact)", () => {
  const built = existsSync(DIST);

  it.runIf(built)("has no extensionless relative specifiers", async () => {
    const pattern =
      /(?:(?:^|[\s;])(?:import|export)[\s\S]*?from\s*|(?:^|[\s;])import\s*)(['"])(\.{1,2}\/[^'"]*)\1/g;
    const offenders: string[] = [];

    for await (const file of walk(DIST)) {
      if (extname(file) !== ".js") continue;
      const source = await readFile(file, "utf8");
      for (const [, , specifier] of source.matchAll(pattern)) {
        if (!/\.[a-z0-9]+$/i.test(specifier)) {
          offenders.push(`${file.replace(DIST, "dist")} -> ${specifier}`);
        }
      }
    }

    expect(offenders, "Node cannot resolve these; run scripts/fix-esm-extensions.mjs").toEqual([]);
  });

  it.runIf(built)("is importable by Node's own ESM resolver", () => {
    // **In a separate process, deliberately.** A dynamic `import()` from inside a
    // test goes through Vite, whose resolver fills in missing extensions — so this
    // written the obvious way passed against a build with every specifier broken.
    // Confirmed: running `tsup` without the extension-fixing step left this green
    // while the assertion above went red. Only a real `node` resolves the way a
    // consumer will.
    const entry = join(DIST, "index.js");
    const probe = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", `const m = await import(${JSON.stringify(entry)}); if (Object.keys(m).length < 50) process.exit(2);`],
      { encoding: "utf8" },
    );

    expect(probe.stderr.slice(0, 600)).not.toMatch(/ERR_MODULE_NOT_FOUND|Cannot find module/);
    expect(probe.status, "node could not import the built entry point").toBe(0);
  });
});

/**
 * Append `.js` to relative import specifiers in the ESM build.
 *
 * `tsup` with `bundle: false` copies relative specifiers through untouched, so
 * `dist/index.js` ends up with `export * from './components/accordion'`. That is a
 * valid *bundler* specifier and an invalid *ESM* one: Node requires the extension,
 * and so does anything that resolves the way Node does.
 *
 * It went unnoticed because every consumer in this estate reached the library
 * through a `file:` link to the source directory, where Vite's own resolver filled
 * the extension in. The first install from a packaged tarball — the boilerplate
 * moving to a pinned version on 2026-09-07 — failed immediately:
 *
 *   Cannot find module '.../dist/components/accordion'
 *   imported from '.../dist/index.js'
 *
 * `bundle: false` is deliberate and stays: preserving the source tree is what makes
 * the library tree-shakeable, and bundling cost a measured 888 kB on a login screen
 * that imports three components. So the specifiers are fixed after the fact instead.
 *
 * Only `.js` is touched. CommonJS resolves extensionless paths itself, and the
 * declaration files are consumed by TypeScript, which does too.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;

// `from './x'`, `import './x'`, `export * from '../y'` — quote style preserved.
const SPECIFIER = /((?:^|[\s;])(?:import|export)[\s\S]*?from\s*|(?:^|[\s;])import\s*)(['"])(\.{1,2}\/[^'"]*)\2/g;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let patched = 0;
let rewritten = 0;

for await (const file of walk(DIST)) {
  if (extname(file) !== ".js") continue;

  const source = await readFile(file, "utf8");
  let hits = 0;

  const output = source.replace(SPECIFIER, (match, head, quote, specifier) => {
    // Already carries an extension, so leave it: `./tokens.css`, `./x.js`.
    if (/\.[a-z0-9]+$/i.test(specifier)) return match;
    hits += 1;
    return `${head}${quote}${specifier}.js${quote}`;
  });

  if (hits > 0) {
    await writeFile(file, output);
    patched += 1;
    rewritten += hits;
  }
}

console.log(`fix-esm-extensions: ${rewritten} specifiers in ${patched} files`);

import { defineConfig } from "tsup";

export default defineConfig([
  {
    // Every module its own file, not one bundle.
    //
    // A single bundled `dist/index.js` cannot be tree-shaken by a consumer: Rollup has
    // no module boundaries to prune along, so importing three components pulled the
    // whole library. Measured in `abeon-auth-ui`, whose login screen imports exactly
    // three: 888 kB raw / 264 kB gzip on the platform's front door.
    //
    // `splitting: true` alone changed nothing — with a single entry there is nothing to
    // split. Preserving the source tree is what gives the consumer's bundler something
    // to work with, and `sideEffects` in package.json is what lets it act on that.
    entry: ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.test.tsx", "!src/test/**"],
    bundle: false,
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
    ],
    outExtension({ format }) {
      return format === "esm" ? { js: ".js" } : { js: ".cjs" };
    },
    treeshake: true,
  },
  {
    entry: ["tailwind.preset.ts"],
    format: ["cjs"],
    dts: true,
    splitting: true,
    outDir: "dist",
    outExtension() {
      return { js: ".js" };
    },
    external: ["tailwindcss", "tailwindcss-animate"],
    platform: "node",
    target: "node18",
    tsconfig: "tsconfig.preset.json",
  },
]);

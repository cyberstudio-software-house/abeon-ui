import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
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
    splitting: false,
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

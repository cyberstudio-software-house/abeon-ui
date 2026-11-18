import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ACCENTS, DEFAULT_ACCENT } from "./accent";

const css = readFileSync(resolve(__dirname, "../../tokens.css"), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`Missing ${selector}`);
  const body = css.slice(start, css.indexOf("\n}", start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

function luminance(hsl: string): number {
  const [h, s, l] = hsl.replace(/%/g, "").split(/\s+/).map(Number);
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(8) + 0.0722 * channel(4);
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const PAIRS: [string, string, number][] = [
  ["primary-foreground", "primary", 4.5],
  ["primary-muted-foreground", "primary-muted", 4.5],
  ["sidebar-foreground", "sidebar-background", 4.5],
  ["sidebar-muted", "sidebar-background", 3],
  ["sidebar-primary-foreground", "sidebar-primary", 4.5],
  ["ring", "background", 3],
];

const root = block(":root");
const dark = { ...root, ...block(".dark") };

const themes = ACCENTS.flatMap(({ name }) =>
  name === DEFAULT_ACCENT
    ? [[`${name} light`, root] as const, [`${name} dark`, dark] as const]
    : [
        [`${name} light`, { ...root, ...block(`[data-accent="${name}"]`) }] as const,
        [`${name} dark`, { ...dark, ...block(`.dark[data-accent="${name}"],\n[data-accent="${name}"] .dark`) }] as const,
      ],
);

describe("theme profiles", () => {
  it.each(themes)("%s meets WCAG AA", (_, tokens) => {
    for (const [fg, bg, min] of PAIRS) {
      expect(contrast(tokens[fg], tokens[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(min);
    }
  });
});

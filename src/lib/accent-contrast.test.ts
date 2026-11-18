import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ACCENTS, DEFAULT_ACCENT } from "./accent";

const css = readFileSync(resolve(__dirname, "../../tokens.css"), "utf8").replace(/\s+/g, " ");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector.replace(/\s+/g, " ")} {`);
  if (start < 0) throw new Error(`Missing ${selector}`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

function rgb(hsl: string): [number, number, number] {
  const [h, s, l] = hsl.replace(/%/g, "").split(/\s+/).map(Number);
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    return l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [channel(0), channel(8), channel(4)];
}

function luminance(hsl: string): number {
  const [r, g, b] = rgb(hsl).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
  ["foreground", "background", 4.5],
  ["sidebar-accent-foreground", "sidebar-accent", 4.5],
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

const light = Object.fromEntries(themes.filter(([label]) => label.endsWith(" light")).map(([label, tokens]) => [label.split(" ")[0], tokens]));

describe("theme profiles", () => {
  it.each(ACCENTS.map((accent) => [accent.name, accent] as const))("%s tile previews its light tokens", (name, { preview }) => {
    const tokens = light[name];
    const expected = { sidebar: tokens["sidebar-background"], accent: tokens["sidebar-primary"], primary: tokens.primary };
    for (const [key, hsl] of Object.entries(expected)) {
      const actual = preview[key as keyof typeof preview].match(/[0-9a-f]{2}/gi)!.map((hex) => parseInt(hex, 16));
      rgb(hsl).forEach((channel, i) => expect(Math.abs(actual[i] - channel * 255), `${key} ${preview[key as keyof typeof preview]} vs ${hsl}`).toBeLessThanOrEqual(1));
    }
  });

  it.each(themes)("%s meets WCAG AA", (_, tokens) => {
    for (const [fg, bg, min] of PAIRS) {
      expect(contrast(tokens[fg], tokens[bg]), `${fg} on ${bg}`).toBeGreaterThanOrEqual(min);
    }
  });
});

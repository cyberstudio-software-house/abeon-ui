export const ACCENTS = [
  { name: "cyberstudio", label: "Granat + turkus", preview: { sidebar: "#1a192e", accent: "#4cdbeb", primary: "#3728bd" } },
  { name: "graphite", label: "Grafit + turkus", preview: { sidebar: "#1c1e22", accent: "#4cdbeb", primary: "#0f758a" } },
  { name: "light", label: "Jasny + ultramaryna", preview: { sidebar: "#f6f6f9", accent: "#3728bd", primary: "#3728bd" } },
  { name: "indigo", label: "Indygo + lawenda", preview: { sidebar: "#191b34", accent: "#ad9efa", primary: "#2f32da" } },
  { name: "blue", label: "Stal + błękit", preview: { sidebar: "#1d2530", accent: "#55c3f6", primary: "#175dcf" } },
  { name: "emerald", label: "Las + mięta", preview: { sidebar: "#122b25", accent: "#6ce0af", primary: "#0e7c5b" } },
  { name: "violet", label: "Śliwka + róż", preview: { sidebar: "#2c1b32", accent: "#f68ec2", primary: "#783bce" } },
  { name: "rose", label: "Bordo + koral", preview: { sidebar: "#32151d", accent: "#f88d77", primary: "#bf2249" } },
  { name: "orange", label: "Grafit + bursztyn", preview: { sidebar: "#211f1c", accent: "#faaf2e", primary: "#bd4f0f" } },
] as const;

export type AccentName = (typeof ACCENTS)[number]["name"];

export const DEFAULT_ACCENT: AccentName = "cyberstudio";

export function isAccent(value: unknown): value is AccentName {
  return typeof value === "string" && ACCENTS.some((accent) => accent.name === value);
}

/**
 * Applies an accent to the whole document. The first known value wins, so callers pass the
 * user's choice before the organisation's; anything unknown falls back to the default.
 */
export function applyAccent(...choices: unknown[]): AccentName {
  const accent = choices.find(isAccent) ?? DEFAULT_ACCENT;
  if (typeof document !== "undefined") {
    if (accent === DEFAULT_ACCENT) {
      delete document.documentElement.dataset.accent;
    } else {
      document.documentElement.dataset.accent = accent;
    }
  }
  return accent;
}

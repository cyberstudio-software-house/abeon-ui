export const ACCENTS = [
  { name: "cyberstudio", label: "Cyberstudio", swatch: "#1e149d" },
  { name: "indigo", label: "Indygo", swatch: "#4f46e5" },
  { name: "blue", label: "Niebieski", swatch: "#1d5fe0" },
  { name: "emerald", label: "Szmaragd", swatch: "#0f8a6b" },
  { name: "violet", label: "Fiolet", swatch: "#7c45e4" },
  { name: "rose", label: "Róż", swatch: "#d4224f" },
  { name: "orange", label: "Pomarańcz", swatch: "#d35d0d" },
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

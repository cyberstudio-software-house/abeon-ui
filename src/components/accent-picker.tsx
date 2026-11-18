import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";
import { ACCENTS, type AccentName } from "../lib/accent";

export interface AccentPickerProps {
  value: AccentName | null;
  onChange: (value: AccentName | null) => void;
  /** Label of the "no choice of my own" option, e.g. "Jak organizacja". Omit to hide it. */
  inheritLabel?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** Theme profiles as tiles, each with a miniature panel in its own colours; one radio group, keyboard friendly. */
function AccentPicker({ value, onChange, inheritLabel, label = "Profil motywu", disabled, className }: AccentPickerProps) {
  const options: { name: AccentName | null; label: string; preview?: { sidebar: string; accent: string; primary: string } }[] = [
    ...(inheritLabel ? [{ name: null, label: inheritLabel }] : []),
    ...ACCENTS.map((accent) => ({ name: accent.name, label: accent.label, preview: accent.preview })),
  ];

  return (
    <div role="radiogroup" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const checked = option.name === value;
        return (
          <button
            key={option.name ?? "inherit"}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.label}
            disabled={disabled}
            onClick={() => onChange(option.name)}
            className={cn(
              "relative flex w-28 flex-col gap-1.5 rounded-lg border p-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
              checked ? "border-primary bg-primary-muted text-primary-muted-foreground" : "border-border bg-background hover:bg-accent",
            )}
          >
            {option.preview ? (
              <span aria-hidden className="grid h-14 w-full grid-cols-[1.75rem_1fr] overflow-hidden rounded-md border border-border bg-[#f7f7f7]">
                <span className="flex flex-col gap-1 px-1 py-2" style={{ background: option.preview.sidebar }}>
                  <span className="h-1 rounded-full opacity-40" style={{ background: option.preview.accent }} />
                  <span className="h-1.5 rounded-full" style={{ background: option.preview.accent }} />
                  <span className="h-1 rounded-full opacity-40" style={{ background: option.preview.accent }} />
                </span>
                <span className="relative flex flex-col gap-1 p-2">
                  <span className="h-1 w-3/4 rounded-full bg-black/15" />
                  <span className="h-1 w-full rounded-full bg-black/15" />
                  <span className="absolute bottom-1.5 right-1.5 h-2 w-5 rounded-sm" style={{ background: option.preview.primary }} />
                </span>
              </span>
            ) : (
              <span aria-hidden className="h-14 w-full rounded-md border border-dashed border-foreground-muted" />
            )}
            <span className="flex items-center gap-1 font-medium">
              {checked && <Check className="h-3 w-3 shrink-0" />}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { AccentPicker };

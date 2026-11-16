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

/** The accent palette as a row of swatches; one radio group, keyboard friendly. */
function AccentPicker({ value, onChange, inheritLabel, label = "Kolor akcentu", disabled, className }: AccentPickerProps) {
  const options: { name: AccentName | null; label: string; swatch?: string }[] = [
    ...(inheritLabel ? [{ name: null, label: inheritLabel }] : []),
    ...ACCENTS.map((accent) => ({ name: accent.name, label: accent.label, swatch: accent.swatch })),
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
            disabled={disabled}
            onClick={() => onChange(option.name)}
            className={cn(
              "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
              checked ? "border-primary bg-primary-muted text-primary-muted-foreground" : "border-border bg-background hover:bg-accent",
            )}
          >
            {option.swatch ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full" style={{ background: option.swatch }}>
                {checked && <Check className="h-3 w-3 text-white" />}
              </span>
            ) : (
              <span className="h-4 w-4 rounded-full border border-dashed border-foreground-muted" />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export { AccentPicker };

import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "../lib/utils";

export interface TimePickerProps
  extends Omit<
    React.ComponentPropsWithoutRef<"input">,
    "type" | "value" | "onChange" | "children"
  > {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, value, onChange, error, disabled, ...props }, ref) => (
    <div className="relative">
      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        ref={ref}
        type="time"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-clear-button]:hidden",
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...props}
      />
    </div>
  ),
);
TimePicker.displayName = "TimePicker";

export { TimePicker };

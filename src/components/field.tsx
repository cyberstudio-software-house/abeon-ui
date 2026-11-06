import * as React from "react";
import { cn } from "../lib/utils";
import { Label } from "./label";

export interface FieldProps {
  /** Id of the control, so the label points at it. */
  id: string;
  label: React.ReactNode;
  /** One short line under the control, for what the label alone does not say. */
  hint?: React.ReactNode;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}

/** A label, a control and its message, laid out tightly for dense forms. */
function Field({ id, label, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("grid gap-1", className)}>
      <Label htmlFor={id} className="text-xs font-medium text-foreground-secondary">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export { Field };

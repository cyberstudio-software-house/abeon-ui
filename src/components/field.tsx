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
  const errorId = `${id}-error`;
  const control =
    error && React.isValidElement<Record<string, unknown>>(children)
      ? React.cloneElement(children, {
          "aria-invalid": true,
          "aria-describedby": [children.props["aria-describedby"], errorId].filter(Boolean).join(" "),
        })
      : children;
  return (
    <div className={cn("grid gap-1", className)}>
      <Label htmlFor={id} className="text-xs font-medium text-foreground-secondary">
        {label}
      </Label>
      {control}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export { Field };

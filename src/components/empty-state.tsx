import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({
  className,
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex gap-3">
          {action && (
            <Button
              variant={action.variant || "default"}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export { EmptyState };

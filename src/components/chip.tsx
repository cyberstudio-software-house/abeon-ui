import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  onRemove?: () => void;
  variant?: "default" | "primary";
}

function Chip({ className, children, onRemove, variant = "default", ...props }: ChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
        variant === "default" && "bg-secondary text-secondary-foreground",
        variant === "primary" && "bg-primary-muted text-primary-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded hover:bg-foreground/10 p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

interface ChipsContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  onClearAll?: () => void;
  clearLabel?: string;
}

function ChipsContainer({ 
  className, 
  children, 
  onClearAll, 
  clearLabel = "Wyczyść wszystko",
  ...props 
}: ChipsContainerProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
      {children}
      {onClearAll && React.Children.count(children) > 0 && (
        <button
          onClick={onClearAll}
          className="text-xs text-foreground-muted hover:text-foreground transition-colors"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}

export { Chip, ChipsContainer };

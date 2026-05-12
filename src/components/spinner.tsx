import * as React from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
    tone: {
      default: "text-foreground-muted",
      primary: "text-primary",
      inherit: "",
    },
  },
  defaultVariants: { size: "md", tone: "default" },
});

export interface SpinnerProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "size">,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, tone, label = "Loading", ...props }, ref) => (
    <Loader2
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size, tone }), className)}
      {...props}
    />
  ),
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };

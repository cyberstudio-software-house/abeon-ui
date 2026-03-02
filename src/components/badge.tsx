import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success: "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        danger: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// Status badge with predefined states
interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: "active" | "inactive" | "draft" | "pending" | "completed" | "error" | "archived";
}

const statusConfig: Record<StatusBadgeProps["status"], { variant: BadgeProps["variant"]; label: string }> = {
  active: { variant: "success", label: "Aktywna" },
  inactive: { variant: "secondary", label: "Nieaktywna" },
  draft: { variant: "outline", label: "Szkic" },
  pending: { variant: "warning", label: "Oczekuje" },
  completed: { variant: "success", label: "Zakończona" },
  error: { variant: "danger", label: "Błąd" },
  archived: { variant: "secondary", label: "Archiwum" },
};

function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={className} {...props}>
      {children || config.label}
    </Badge>
  );
}

export { Badge, StatusBadge, badgeVariants };

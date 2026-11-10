import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success: "border-transparent bg-success-muted text-success-muted-foreground",
        warning: "border-transparent bg-warning-muted text-warning-muted-foreground",
        danger: "border-transparent bg-danger-muted text-danger-muted-foreground",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm: "px-1.5 py-px text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

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

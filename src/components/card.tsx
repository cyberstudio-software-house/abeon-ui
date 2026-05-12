import * as React from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { cn } from "../lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

// Extended stat card for dashboards
interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  value: string | number;
  change?: { value: number; label: string };
  icon?: React.ReactNode;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, icon, ...props }, ref) => {
    const direction = change ? (change.value > 0 ? "up" : change.value < 0 ? "down" : "flat") : null;
    const ChangeIcon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
    return (
      <Card ref={ref} className={cn("p-4", className)} {...props}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
            {change && (
              <p
                className={cn(
                  "flex items-center gap-1 text-xs",
                  direction === "up" && "text-green-600 dark:text-green-400",
                  direction === "down" && "text-red-600 dark:text-red-400",
                  direction === "flat" && "text-muted-foreground",
                )}
              >
                <ChangeIcon className="h-3 w-3" aria-hidden="true" />
                <span>
                  {change.value > 0 ? "+" : ""}
                  {change.value}% {change.label}
                </span>
              </p>
            )}
          </div>
          {icon && (
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              {icon}
            </div>
          )}
        </div>
      </Card>
    );
  }
);
StatCard.displayName = "StatCard";

interface StatCardGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  columns?: 2 | 3 | 4;
  children?: React.ReactNode;
}

const columnClasses: Record<NonNullable<StatCardGridProps["columns"]>, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

const StatCardGrid = React.forwardRef<HTMLDivElement, StatCardGridProps>(
  ({ columns = 4, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid gap-4", columnClasses[columns], className)}
      {...props}
    >
      {children}
    </div>
  ),
);
StatCardGrid.displayName = "StatCardGrid";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatCard, StatCardGrid };
export type { StatCardProps, StatCardGridProps };

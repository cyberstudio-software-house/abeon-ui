import * as React from "react";

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
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: { value: number; label: string };
  icon?: React.ReactNode;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, icon, ...props }, ref) => (
    <Card ref={ref} className={cn("p-4", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs",
                change.value > 0 ? "text-green-600 dark:text-green-400" : change.value < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
              )}
            >
              {change.value > 0 ? "+" : ""}
              {change.value}% {change.label}
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
  )
);
StatCard.displayName = "StatCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatCard };

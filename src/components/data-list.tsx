import * as React from "react";

import { cn } from "../lib/utils";

export interface DataListProps
  extends Omit<React.ComponentPropsWithoutRef<"dl">, "children"> {
  children?: React.ReactNode;
}

const DataList = React.forwardRef<HTMLDListElement, DataListProps>(
  ({ className, children, ...props }, ref) => (
    <dl ref={ref} className={cn("flex flex-col", className)} {...props}>
      {children}
    </dl>
  ),
);
DataList.displayName = "DataList";

export interface DataListRowProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "title"> {
  label: React.ReactNode;
  orientation?: "stacked" | "horizontal";
  children?: React.ReactNode;
}

const DataListRow = React.forwardRef<HTMLDivElement, DataListRowProps>(
  ({ label, orientation = "stacked", className, children, ...props }, ref) => {
    if (orientation === "horizontal") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-start justify-between gap-4 py-3 border-b last:border-0",
            className,
          )}
          {...props}
        >
          <dt className="text-sm text-foreground-muted shrink-0">{label}</dt>
          <dd className="text-sm text-foreground text-right">{children}</dd>
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start gap-3 pb-4 border-b last:border-0",
          className,
        )}
        {...props}
      >
        <div className="flex-1 space-y-1">
          <dt className="text-xs text-foreground-muted">{label}</dt>
          <dd className="text-sm text-foreground">{children}</dd>
        </div>
      </div>
    );
  },
);
DataListRow.displayName = "DataListRow";

export { DataList, DataListRow };

import React from "react";
import { cn } from "../../lib/utils";

export interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export function ContentArea({ children, className, scrollable }: ContentAreaProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-4",
        scrollable && "overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

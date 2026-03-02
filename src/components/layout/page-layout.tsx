import React from "react";
import { cn } from "../../lib/utils";

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {children}
    </div>
  );
}

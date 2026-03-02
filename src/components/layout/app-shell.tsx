import React from "react";
import { cn } from "../../lib/utils";

export interface AppShellProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
  collapsed: boolean;
  noPadding?: boolean;
  className?: string;
}

export function AppShell({ sidebar, topbar, children, collapsed, noPadding, className }: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {sidebar}
      {topbar}
      <main
        className={cn(
          "min-h-screen pt-topbar transition-all duration-200 overflow-x-hidden",
          "ml-0 md:ml-sidebar w-full md:w-[calc(100%-260px)]",
          collapsed && "md:ml-sidebar-collapsed md:w-[calc(100%-72px)]"
        )}
      >
        {noPadding ? children : <div className="p-4 md:p-6">{children}</div>}
      </main>
    </div>
  );
}

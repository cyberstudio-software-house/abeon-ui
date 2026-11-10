import React from "react";
import { cn } from "../../lib/utils";

export type AppShellVariant = "app" | "public";

export interface AppShellProps {
  /** Sidebar element. Required for variant=`"app"`, ignored for `"public"`. */
  sidebar?: React.ReactNode;
  /** Topbar element. Required for variant=`"app"`, ignored for `"public"`. */
  topbar?: React.ReactNode;
  children: React.ReactNode;
  /** Sidebar collapsed state — only used for `"app"` variant. */
  collapsed?: boolean;
  noPadding?: boolean;
  /**
   * Layout variant (per ADR §3.4 + D8):
   *   - `"app"` (default) — full chrome with sidebar + topbar offsets.
   *   - `"public"` — no chrome; bare wrapper for marketing/CMS public pages
   *     where the federated chrome must not appear.
   */
  variant?: AppShellVariant;
  className?: string;
}

export function AppShell({
  sidebar,
  topbar,
  children,
  collapsed = false,
  noPadding,
  variant = "app",
  className,
}: AppShellProps) {
  if (variant === "public") {
    return (
      <div className={cn("min-h-screen bg-background", className)}>
        {noPadding ? children : <div className="min-h-screen">{children}</div>}
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-dropdown focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Przejdź do treści
      </a>
      {sidebar}
      {topbar}
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          "min-h-screen pt-topbar transition-[margin-left,width] duration-200 motion-reduce:transition-none overflow-x-hidden focus:outline-none",
          "ml-0 md:ml-sidebar w-full md:w-[calc(100%-260px)]",
          collapsed && "md:ml-sidebar-collapsed md:w-[calc(100%-72px)]"
        )}
      >
        {noPadding ? children : <div className="p-4 md:p-6">{children}</div>}
      </main>
    </div>
  );
}

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

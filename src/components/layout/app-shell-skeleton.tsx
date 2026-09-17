import * as React from "react";
import { Skeleton } from "../skeleton";
import { cn } from "../../lib/utils";

export interface PageSkeletonProps {
  rows?: number;
  label?: string;
  className?: string;
}

/** Placeholder for a page's content while its data loads. */
export function PageSkeleton({ rows = 5, label = "Ładowanie…", className }: PageSkeletonProps) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cn("flex flex-col gap-4", className)}>
      <span className="sr-only">{label}</span>
      <Skeleton className="h-7 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="mt-2 flex flex-col gap-2">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export interface AppShellSkeletonProps {
  label?: string;
  className?: string;
}

/**
 * The whole chrome — sidebar, topbar, content — as placeholders, for the moment an
 * application starts (architecture §3.7). Same proportions as `AppShell`, so the page
 * does not jump when the real layout replaces it.
 */
export function AppShellSkeleton({ label = "Ładowanie aplikacji…", className }: AppShellSkeletonProps) {
  return (
    <div className={cn("flex h-screen w-full bg-background", className)}>
      <aside aria-hidden="true" className="hidden w-60 shrink-0 flex-col gap-3 border-r border-border p-4 md:flex">
        <Skeleton className="h-8 w-32" />
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header aria-hidden="true" className="flex h-14 items-center justify-between border-b border-border px-4">
          <Skeleton className="h-8 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>
        <main className="flex-1 overflow-hidden p-6">
          <PageSkeleton label={label} />
        </main>
      </div>
    </div>
  );
}

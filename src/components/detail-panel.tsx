import * as React from "react";
import { X, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Card, CardContent } from "./card";

// ─── DetailPanel (the shell) ─────────────────────────

export interface DetailPanelProps {
  open?: boolean;
  onClose?: () => void;
  /** Width on desktop (sm: breakpoint and up). Default 520px. */
  width?: string;
  /** Top offset for sticky shell (e.g. accommodate a topbar). Defaults to var(--topbar-height,56px). */
  topOffset?: string;
  /** Position. "right" (default) slides in from the right; "left" mirrors it. */
  side?: "right" | "left";
  className?: string;
  children: React.ReactNode;
  /** Disable the click-outside backdrop on small screens. */
  disableBackdrop?: boolean;
}

export function DetailPanel({
  open = true,
  onClose,
  width = "520px",
  topOffset = "var(--topbar-height,56px)",
  side = "right",
  className,
  children,
  disableBackdrop = false,
}: DetailPanelProps) {
  if (!open) return null;
  return (
    <>
      {!disableBackdrop && onClose && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <div
        className={cn(
          "fixed bottom-0 z-30 w-full sm:w-[var(--detail-panel-width)] bg-card border-border overflow-y-auto shadow-xl animate-in duration-200",
          side === "right"
            ? "right-0 border-l slide-in-from-right"
            : "left-0 border-r slide-in-from-left",
          className
        )}
        style={
          {
            top: topOffset,
            ["--detail-panel-width" as string]: width,
          } as React.CSSProperties
        }
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  );
}

// ─── DetailHeader ────────────────────────────────────

export interface DetailHeaderProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
}

export function DetailHeader({
  icon,
  title,
  subtitle,
  badges,
  actions,
  onClose,
  closeLabel = "Close",
  className,
}: DetailHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 bg-card border-b border-border px-6 py-4 z-10",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-primary">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="font-semibold text-base truncate">{title}</h2>
            {subtitle && (
              <p className="text-xs text-foreground-muted truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {actions}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
              aria-label={closeLabel}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {badges && <div className="flex items-center gap-2 mt-3 flex-wrap">{badges}</div>}
    </div>
  );
}

// ─── DetailSection ───────────────────────────────────

export interface DetailSectionProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function DetailSection({
  icon,
  title,
  actions,
  className,
  children,
}: DetailSectionProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-3">
        {(title || icon || actions) && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              {icon && (
                <span className="text-foreground-muted [&_svg]:h-4 [&_svg]:w-4">
                  {icon}
                </span>
              )}
              {title}
            </div>
            {actions && <div className="flex items-center gap-1">{actions}</div>}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

// ─── DetailMetricGrid + DetailMetric ─────────────────

export interface DetailMetricGridProps {
  columns?: 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}

export function DetailMetricGrid({
  columns = 2,
  className,
  children,
}: DetailMetricGridProps) {
  const gridCol =
    columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : "grid-cols-4";
  return <div className={cn("grid gap-3", gridCol, className)}>{children}</div>;
}

export type DetailTrendDirection = "up" | "down" | "stable";

export interface DetailMetricProps {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  trend?: {
    direction: DetailTrendDirection;
    value?: React.ReactNode;
  };
  tone?: "default" | "danger" | "success" | "warning";
  className?: string;
}

export function DetailMetric({
  label,
  value,
  hint,
  trend,
  tone = "default",
  className,
}: DetailMetricProps) {
  const valueClass =
    tone === "danger"
      ? "text-destructive"
      : tone === "success"
      ? "text-success"
      : tone === "warning"
      ? "text-warning"
      : "text-foreground";

  return (
    <div className={className}>
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className={cn("text-lg font-semibold", valueClass)}>{value}</p>
      {hint && <p className="text-[10px] text-foreground-muted">{hint}</p>}
      {trend && (
        <div className="mt-1 text-xs">
          {trend.direction === "up" && (
            <span className="inline-flex items-center gap-0.5 text-success font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {trend.value}
            </span>
          )}
          {trend.direction === "down" && (
            <span className="inline-flex items-center gap-0.5 text-destructive font-medium">
              <ArrowDownRight className="h-3.5 w-3.5" />
              {trend.value}
            </span>
          )}
          {trend.direction === "stable" && (
            <span className="inline-flex items-center gap-0.5 text-foreground-muted">
              <Minus className="h-3.5 w-3.5" />
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DetailKeyValue ──────────────────────────────────

export interface DetailKeyValueProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** "row" (default) renders label and value side-by-side; "stacked" stacks them vertically. */
  layout?: "row" | "stacked";
  className?: string;
}

export function DetailKeyValue({
  label,
  value,
  layout = "row",
  className,
}: DetailKeyValueProps) {
  if (layout === "stacked") {
    return (
      <div className={className}>
        <p className="text-xs text-foreground-muted">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    );
  }
  return (
    <div className={cn("flex items-center justify-between gap-3 text-sm", className)}>
      <span className="text-foreground-muted">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

// ─── DetailBody ──────────────────────────────────────

export interface DetailBodyProps {
  className?: string;
  children: React.ReactNode;
}

export function DetailBody({ className, children }: DetailBodyProps) {
  return (
    <div className={cn("px-6 pt-4 pb-6 space-y-4", className)}>{children}</div>
  );
}

import * as React from "react";
import { Grid3X3, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "../../lib/utils";
import type { AppManifest, AppCategory } from "../../types/app-manifest";

export interface AppSwitcherProps {
  apps: AppManifest[];
  currentAppId: string;
  categories?: AppCategory[];
  triggerClassName?: string;
  className?: string;
}

const DEFAULT_CATEGORIES: AppCategory[] = [
  { label: "Główne", appIds: ["suite", "crm", "cms", "ecommerce", "projects"] },
  { label: "Komunikacja", appIds: ["ai", "mailing", "helpdesk", "calendar"] },
  { label: "Finanse i logistyka", appIds: ["finance", "spedycja", "warehouse", "contracts"] },
  { label: "Zasoby", appIds: ["files", "knowledge", "hr", "cloud"] },
  { label: "Analiza i automatyzacja", appIds: ["analytics", "security", "marketing", "workflows", "configurator"] },
];

export function AppSwitcher({
  apps,
  currentAppId,
  categories,
  triggerClassName,
  className,
}: AppSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const resolvedCategories = categories ?? DEFAULT_CATEGORIES;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2", triggerClassName)}
        >
          <Grid3X3 className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className={cn("w-[640px] p-0 shadow-dropdown border-border", className)}
      >
        <div className="px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm">Aplikacje</h4>
          <p className="text-xs text-foreground-muted">Przełącz na wybraną aplikację</p>
        </div>
        <div className="p-3 max-h-[480px] overflow-y-auto">
          {resolvedCategories.map((cat) => {
            const catApps = cat.appIds
              .map((id) => apps.find((a) => a.id === id))
              .filter((a): a is AppManifest => a !== undefined);
            if (catApps.length === 0) return null;
            return (
              <div key={cat.label} className="mb-3 last:mb-0">
                <p className="text-xs font-medium text-foreground-muted uppercase tracking-wide px-1 mb-1.5">
                  {cat.label}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {catApps.map((app) => {
                    const AppIcon = app.icon;
                    return (
                      <a
                        key={app.id}
                        href={app.url}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent group no-underline",
                          app.id === currentAppId && "bg-primary-muted ring-1 ring-primary/20"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            app.id === currentAppId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted group-hover:bg-accent"
                          )}
                        >
                          <AppIcon
                            className={cn(
                              "h-5 w-5",
                              app.id !== currentAppId && "text-foreground-muted"
                            )}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-tight truncate">{app.name}</p>
                          <p className="text-[11px] text-foreground-muted leading-tight truncate">
                            {app.description}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

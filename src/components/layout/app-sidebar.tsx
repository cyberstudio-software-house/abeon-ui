import React, { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../collapsible";
import { Sheet, SheetContent } from "../sheet";

export interface NavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
  badge?: string | number;
  isActive?: boolean;
  children?: NavItem[];
}

export interface NavGroup {
  id: string;
  label?: string;
  items: NavItem[];
}

export interface AppSidebarProps {
  navGroups: NavGroup[];
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  logo?: React.ReactNode;
  className?: string;
}

interface NavItemComponentProps {
  item: NavItem;
  collapsed: boolean;
}

function NavItemComponent({ item, collapsed }: NavItemComponentProps) {
  const IconComponent = item.icon;
  const hasIcon = !!IconComponent;
  const hasChildren = item.children && item.children.length > 0;
  const [childrenOpen, setChildrenOpen] = useState(false);

  if (collapsed && !hasIcon) {
    return null;
  }

  const linkContent = (
    <a
      href={item.href}
      aria-current={item.isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        item.isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground",
        hasIcon ? "py-2.5" : "py-2 pl-4 text-[13px]",
        collapsed && hasIcon && "justify-center px-0 w-11 h-11 relative"
      )}
    >
      {hasIcon && IconComponent && (
        <IconComponent className={cn("shrink-0", "h-[22px] w-[22px]")} />
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && !hasChildren && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && hasIcon && item.badge && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
          {item.badge}
        </span>
      )}
    </a>
  );

  if (hasChildren && !collapsed) {
    return (
      <Collapsible open={childrenOpen} onOpenChange={setChildrenOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              item.isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground"
            )}
          >
            {hasIcon && IconComponent && (
              <IconComponent className="h-[22px] w-[22px] shrink-0" />
            )}
            <span className="flex-1 text-left truncate">{item.label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform text-sidebar-foreground/60",
                childrenOpen && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-0.5 pl-4 pt-0.5">
            {item.children!.map((child) => (
              <NavItemComponent key={child.id} item={child} collapsed={false} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  if (collapsed && hasIcon) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8} className="flex items-center gap-2 font-medium">
          {item.label}
          {item.badge && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

interface NavGroupComponentProps {
  group: NavGroup;
  collapsed: boolean;
}

function NavGroupComponent({ group, collapsed }: NavGroupComponentProps) {
  const showLabel = group.label && group.label.trim() !== "";

  return (
    <div className="mb-2">
      {showLabel && !collapsed && (
        <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
          {group.label}
        </div>
      )}
      {showLabel && collapsed && (
        <div className="mx-2 my-3 border-t border-sidebar-border" />
      )}
      <div className={cn("space-y-0.5", collapsed && "flex flex-col items-center")}>
        {group.items.map((item) => (
          <NavItemComponent key={item.id} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}

function SidebarNav({ navGroups, collapsed }: { navGroups: NavGroup[]; collapsed: boolean }) {
  return (
    <nav className={cn("flex-1 overflow-y-auto py-2", collapsed ? "px-2" : "px-2")}>
      {navGroups.map((group) => (
        <NavGroupComponent key={group.id} group={group} collapsed={collapsed} />
      ))}
    </nav>
  );
}

export function AppSidebar({
  navGroups,
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileOpenChange,
  logo,
  className,
}: AppSidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200",
          collapsed ? "w-sidebar-collapsed" : "w-sidebar",
          className
        )}
      >
        <div
          className={cn(
            "flex h-topbar items-center border-b border-sidebar-border shrink-0",
            collapsed ? "justify-center px-0" : "px-4"
          )}
        >
          {logo}
        </div>

        <SidebarNav navGroups={navGroups} collapsed={collapsed} />

        <div className="border-t border-sidebar-border p-2 shrink-0">
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
          <SheetContent side="left" className="w-[280px] p-0 bg-sidebar">
            <div className="flex h-topbar items-center border-b border-sidebar-border px-4 shrink-0">
              {logo}
            </div>
            <SidebarNav navGroups={navGroups} collapsed={false} />
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

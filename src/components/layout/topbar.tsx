import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Grid3X3,
  Menu,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { AppManifest, AppCategory } from "../../types/app-manifest";
import type { NotificationItem } from "../../types/notification-item";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";

export interface TopbarUser {
  name: string;
  email: string;
  initials: string;
}

export interface TopbarProps {
  apps: AppManifest[];
  currentAppId: string;
  appCategories?: AppCategory[];
  notifications: NotificationItem[];
  unreadCount: number;
  user: TopbarUser;
  sidebarCollapsed: boolean;
  onNotificationRead: (id: string) => void;
  onNotificationReadAll: () => void;
  onSignOut: () => void;
  onSearch?: (query: string) => void;
  onMenuOpen?: () => void;
  notificationsPageUrl?: string;
  profileUrl?: string;
  settingsUrl?: string;
  className?: string;
}

const defaultCategories: AppCategory[] = [
  { label: "Wszystkie", appIds: [] },
];

function getVariantColors(variant: NotificationItem["colorVariant"]): string {
  switch (variant) {
    case "success":
      return "bg-success/10 text-success";
    case "warning":
      return "bg-warning/10 text-warning";
    case "danger":
      return "bg-danger/10 text-danger";
    case "primary":
    default:
      return "bg-primary/10 text-primary";
  }
}

export function Topbar({
  apps,
  currentAppId,
  appCategories,
  notifications,
  unreadCount,
  user,
  sidebarCollapsed,
  onNotificationRead,
  onNotificationReadAll,
  onSignOut,
  onSearch,
  onMenuOpen,
  notificationsPageUrl,
  profileUrl,
  settingsUrl,
  className,
}: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = appCategories && appCategories.length > 0 ? appCategories : defaultCategories;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const getAppsForCategory = (category: AppCategory): AppManifest[] => {
    if (category.appIds.length === 0) {
      return apps;
    }
    return apps.filter((app) => category.appIds.includes(app.id));
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex h-topbar items-center gap-2 md:gap-4 border-b border-border bg-background px-3 md:px-4 transition-all duration-200",
        "left-0 md:left-sidebar",
        sidebarCollapsed && "md:left-sidebar-collapsed",
        className
      )}
    >
      <button
        className="inline-flex md:hidden items-center justify-center rounded-lg h-8 w-8 text-foreground hover:bg-accent transition-colors"
        onClick={onMenuOpen}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild>
          <button
            className="hidden md:flex items-center gap-2 h-9 w-80 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground hover:bg-accent transition-colors"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Szukaj...</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-96 p-0" sideOffset={8}>
          <div className="border-b border-border">
            <div className="flex items-center px-3">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Szukaj..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent py-3 px-3 text-sm placeholder:text-muted-foreground focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                }}
              />
            </div>
          </div>
          <div className="p-3 text-sm text-muted-foreground text-center">
            Zacznij pisać, aby wyszukać...
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-1" />

      <Popover>
        <PopoverTrigger asChild>
          <button
            className="inline-flex md:hidden items-center justify-center rounded-lg h-8 w-8 text-foreground hover:bg-accent transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-0" sideOffset={8}>
          <div className="border-b border-border">
            <div className="flex items-center px-3">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Szukaj..."
                onChange={(e) => onSearch?.(e.target.value)}
                className="flex-1 bg-transparent py-3 px-3 text-sm placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="p-3 text-sm text-muted-foreground text-center">
            Zacznij pisać, aby wyszukać...
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <button className="hidden md:flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-accent transition-colors">
            <Grid3X3 className="h-4 w-4" />
            <ChevronDown className="h-3 w-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[640px] p-0" sideOffset={8}>
          <div className="px-4 py-3 border-b border-border">
            <h4 className="font-semibold text-sm">Aplikacje</h4>
            <p className="text-xs text-muted-foreground">Przełącz na wybraną aplikację</p>
          </div>
          <div className="p-3 max-h-[480px] overflow-y-auto">
            {categories.map((category) => {
              const categoryApps = getAppsForCategory(category);
              if (categoryApps.length === 0) return null;
              return (
                <div key={category.label} className="mb-3 last:mb-0">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1.5">
                    {category.label}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {categoryApps.map((app) => {
                      const AppIcon = app.icon;
                      const isActive = app.id === currentAppId;
                      return (
                        <a
                          key={app.id}
                          href={app.url}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent group",
                            isActive && "bg-primary/10 ring-1 ring-primary/20"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              isActive ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-accent"
                            )}
                          >
                            <AppIcon
                              className={cn("h-4 w-4", !isActive && "text-muted-foreground")}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-tight truncate">{app.name}</p>
                            <p className="text-[11px] text-muted-foreground leading-tight truncate">
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

      <Popover>
        <PopoverTrigger asChild>
          <button
            className="relative inline-flex items-center justify-center rounded-lg h-8 w-8 text-foreground hover:bg-accent transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-danger-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h4 className="font-semibold text-sm">Powiadomienia</h4>
            {unreadCount > 0 && (
              <button
                onClick={onNotificationReadAll}
                className="text-xs text-primary font-medium hover:underline"
              >
                Oznacz wszystkie
              </button>
            )}
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Brak powiadomień
              </div>
            ) : (
              notifications.map((notification) => {
                const NotifIcon = notification.icon;
                const colorClass = getVariantColors(notification.colorVariant);
                return (
                  <div
                    key={notification.id}
                    onClick={() => onNotificationRead(notification.id)}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-border last:border-0 transition-colors",
                      notification.read ? "hover:bg-accent/30" : "hover:bg-accent/50 bg-accent/10"
                    )}
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", colorClass)}>
                      <NotifIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {notificationsPageUrl && (
            <div className="border-t border-border p-2">
              <a
                href={notificationsPageUrl}
                className="flex items-center justify-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Zobacz wszystkie powiadomienia
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 md:gap-2 px-1 md:px-2 rounded-lg hover:bg-accent transition-colors">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {user.initials}
            </div>
            <ChevronDown className="h-3 w-3 hidden md:block text-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {profileUrl && (
            <DropdownMenuItem asChild>
              <a href={profileUrl} className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profil
              </a>
            </DropdownMenuItem>
          )}
          {settingsUrl && (
            <DropdownMenuItem asChild>
              <a href={settingsUrl} className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Ustawienia
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onSignOut}
            className="flex items-center cursor-pointer text-danger focus:text-danger"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Wyloguj
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

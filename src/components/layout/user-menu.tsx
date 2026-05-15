import React from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";

export interface UserMenuUser {
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string | null;
}

export interface UserMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  destructive?: boolean;
}

export interface UserMenuProps {
  user: UserMenuUser;
  onSignOut: () => void;
  profileUrl?: string;
  settingsUrl?: string;
  /** Extra entries between the built-ins and the sign-out divider. */
  extraItems?: UserMenuItem[];
  labels?: {
    profile?: string;
    settings?: string;
    signOut?: string;
  };
  className?: string;
  align?: "start" | "center" | "end";
}

/**
 * Topbar avatar + dropdown — standalone primitive that `<Topbar>` embeds.
 * Use directly for non-chrome avatars (mobile floating menu, account drawer).
 *
 * Props-only — wire your own data, or use `<ConnectedUserMenu>` to feed it
 * `useAuth()` + onSignOut from `@abeon/shared`.
 */
export function UserMenu({
  user,
  onSignOut,
  profileUrl,
  settingsUrl,
  extraItems,
  labels,
  className,
  align = "end",
}: UserMenuProps) {
  const profileLabel = labels?.profile ?? "Profil";
  const settingsLabel = labels?.settings ?? "Ustawienia";
  const signOutLabel = labels?.signOut ?? "Wyloguj";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1 md:gap-2 px-1 md:px-2 rounded-lg hover:bg-accent transition-colors",
            className,
          )}
          aria-label={user.name}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {user.initials}
            </div>
          )}
          <ChevronDown className="h-3 w-3 hidden md:block text-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
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
              {profileLabel}
            </a>
          </DropdownMenuItem>
        )}
        {settingsUrl && (
          <DropdownMenuItem asChild>
            <a href={settingsUrl} className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              {settingsLabel}
            </a>
          </DropdownMenuItem>
        )}
        {extraItems?.map((item, index) => {
          const Icon = item.icon;
          if (item.href) {
            return (
              <DropdownMenuItem key={`${item.label}-${index}`} asChild>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center cursor-pointer",
                    item.destructive && "text-danger focus:text-danger",
                  )}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {item.label}
                </a>
              </DropdownMenuItem>
            );
          }
          return (
            <DropdownMenuItem
              key={`${item.label}-${index}`}
              onClick={item.onClick}
              className={cn(
                "flex items-center cursor-pointer",
                item.destructive && "text-danger focus:text-danger",
              )}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {item.label}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          className="flex items-center cursor-pointer text-danger focus:text-danger"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {signOutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import * as React from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "../../lib/utils";
import type { NotificationItem, NotificationColorVariant } from "../../types/notification-item";

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onRead: (id: string) => void;
  onReadAll: () => void;
  notificationsPageUrl?: string;
  className?: string;
}

const variantColors: Record<NotificationColorVariant, string> = {
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-danger-muted text-danger",
  primary: "bg-primary-muted text-primary",
};

export function NotificationCenter({
  notifications,
  unreadCount,
  onRead,
  onReadAll,
  notificationsPageUrl,
  className,
}: NotificationCenterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn("relative", className)}
          aria-label="Powiadomienia"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-danger-foreground text-[10px] font-medium flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[280px] p-0"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm">Powiadomienia</h4>
          {unreadCount > 0 && (
            <span className="text-xs text-primary font-medium">{unreadCount} nowe</span>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-foreground-muted">
              Brak powiadomień
            </div>
          ) : (
            notifications.map((item) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => onRead(item.id)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border last:border-0",
                    !item.read && "bg-primary-muted/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      variantColors[item.colorVariant]
                    )}
                  >
                    <ItemIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-foreground-muted line-clamp-2">{item.message}</p>
                    <p className="text-xs text-foreground-muted mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t border-border p-2 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs"
            disabled={unreadCount === 0}
            onClick={onReadAll}
          >
            Oznacz wszystkie jako przeczytane
          </Button>
          {notificationsPageUrl && (
            <a
              href={notificationsPageUrl}
              className="flex items-center justify-center w-full rounded-lg px-3 py-2 text-xs font-medium text-primary hover:bg-primary-muted transition-colors no-underline"
            >
              Zobacz wszystkie
            </a>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

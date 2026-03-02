import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "../lib/utils";
import { IconButton } from "./icon-button";
import { Button } from "./button";
import { Progress } from "./progress";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
  Bell,
  Trash2,
} from "lucide-react";

export type NotificationType = "success" | "error" | "warning" | "info" | "loading";

export interface SystemNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  progress?: number;
  duration?: number; // ms, 0 = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: SystemNotification[];
  addNotification: (notification: Omit<SystemNotification, "id" | "createdAt">) => string;
  updateNotification: (id: string, updates: Partial<SystemNotification>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useSystemNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useSystemNotifications must be used within NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<SystemNotification, "id" | "createdAt">) => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification: SystemNotification = {
        ...notification,
        id,
        createdAt: new Date(),
        dismissible: notification.dismissible ?? true,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Auto-dismiss after duration (default 5s for non-loading, 0 for loading)
      const duration = notification.duration ?? (notification.type === "loading" ? 0 : 5000);
      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const updateNotification = useCallback((id: string, updates: Partial<SystemNotification>) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, updateNotification, removeNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

const notificationIcons: Record<NotificationType, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const notificationStyles: Record<NotificationType, { icon: string; bg: string; border: string }> = {
  success: {
    icon: "text-success",
    bg: "bg-success/5",
    border: "border-success/20",
  },
  error: {
    icon: "text-danger",
    bg: "bg-danger/5",
    border: "border-danger/20",
  },
  warning: {
    icon: "text-warning",
    bg: "bg-warning/5",
    border: "border-warning/20",
  },
  info: {
    icon: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
  },
  loading: {
    icon: "text-primary",
    bg: "bg-muted/50",
    border: "border-border",
  },
};

function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: SystemNotification;
  onDismiss: () => void;
}) {
  const Icon = notificationIcons[notification.type];
  const styles = notificationStyles[notification.type];

  return (
    <div
      className={cn(
        "relative flex gap-3 p-3 rounded-lg border animate-fade-in transition-all",
        styles.bg,
        styles.border
      )}
    >
      <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>
        <Icon
          className={cn("h-5 w-5", notification.type === "loading" && "animate-spin")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{notification.title}</p>
        {notification.message && (
          <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
        )}
        {notification.progress !== undefined && (
          <div className="mt-2">
            <Progress value={notification.progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(notification.progress)}% ukończone
            </p>
          </div>
        )}
        {notification.action && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 mt-1 text-xs"
            onClick={notification.action.onClick}
          >
            {notification.action.label}
          </Button>
        )}
      </div>
      {notification.dismissible && (
        <IconButton
          variant="ghost"
          size="sm"
          className="flex-shrink-0 h-6 w-6 -mt-1 -mr-1"
          onClick={onDismiss}
        >
          <X className="h-3.5 w-3.5" />
        </IconButton>
      )}
    </div>
  );
}

export function SystemNotificationPanel() {
  const { notifications, removeNotification, clearAll } = useSystemNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 z-50 animate-fade-in">
      <div className="bg-background border border-border rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Powiadomienia ({notifications.length})
            </span>
          </div>
          {notifications.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={clearAll}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Wyczyść
            </Button>
          )}
        </div>

        {/* Notifications list */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={() => removeNotification(notification.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Convenience hooks for common notification types
export function useNotify() {
  const { addNotification, updateNotification, removeNotification } = useSystemNotifications();

  return {
    success: (title: string, message?: string, options?: Partial<SystemNotification>) =>
      addNotification({ type: "success", title, message, ...options }),

    error: (title: string, message?: string, options?: Partial<SystemNotification>) =>
      addNotification({ type: "error", title, message, duration: 8000, ...options }),

    warning: (title: string, message?: string, options?: Partial<SystemNotification>) =>
      addNotification({ type: "warning", title, message, duration: 6000, ...options }),

    info: (title: string, message?: string, options?: Partial<SystemNotification>) =>
      addNotification({ type: "info", title, message, ...options }),

    loading: (title: string, message?: string, options?: Partial<SystemNotification>) =>
      addNotification({ type: "loading", title, message, duration: 0, dismissible: false, ...options }),

    update: updateNotification,
    remove: removeNotification,
  };
}

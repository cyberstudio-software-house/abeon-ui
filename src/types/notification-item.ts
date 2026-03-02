import type { LucideIcon } from "lucide-react";

export type NotificationColorVariant = "success" | "warning" | "danger" | "primary";

export interface NotificationItem {
  id: string;
  icon: LucideIcon;
  colorVariant: NotificationColorVariant;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

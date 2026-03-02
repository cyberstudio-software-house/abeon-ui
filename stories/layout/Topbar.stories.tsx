import type { Meta, StoryObj } from "@storybook/react";
import { Users, FileText, ShoppingCart, Bot, Mail, Calendar, MessageSquare } from "lucide-react";
import { Topbar } from "../../src/components/layout/topbar";
import type { AppManifest } from "../../src/types/app-manifest";
import type { NotificationItem } from "../../src/types/notification-item";

const mockApps: AppManifest[] = [
  { id: "crm", name: "CRM", icon: Users, description: "Zarządzanie relacjami", url: "/crm", category: "crm" },
  { id: "cms", name: "CMS", icon: FileText, description: "Zarządzanie treściami", url: "/cms", category: "cms" },
  { id: "ecommerce", name: "E-Commerce", icon: ShoppingCart, description: "Sklep internetowy", url: "/ecommerce", category: "ecommerce" },
  { id: "ai", name: "AI Assistant", icon: Bot, description: "Asystent AI", url: "/ai", category: "ai" },
  { id: "mailing", name: "Mailing", icon: Mail, description: "Kampanie email", url: "/mailing", category: "mailing" },
  { id: "calendar", name: "Kalendarz", icon: Calendar, description: "Harmonogram", url: "/calendar", category: "calendar" },
];

const mockNotifications: NotificationItem[] = [
  { id: "1", icon: Users, colorVariant: "primary", title: "Nowy kontakt", message: "Jan Kowalski dodał nowy kontakt do CRM", time: "2 min temu", read: false },
  { id: "2", icon: ShoppingCart, colorVariant: "success", title: "Zamówienie #1234", message: "Nowe zamówienie na kwotę 1200 zł", time: "15 min temu", read: false },
  { id: "3", icon: MessageSquare, colorVariant: "warning", title: "Nowa wiadomość", message: "Masz 3 nieprzeczytane wiadomości", time: "1 godz. temu", read: true },
];

const mockUser = { name: "Jan Kowalski", email: "jan@example.com", initials: "JK" };

const meta: Meta<typeof Topbar> = {
  title: "Layout/Topbar",
  component: Topbar,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof Topbar>;

export const Default: Story = {
  args: {
    apps: mockApps, currentAppId: "crm", notifications: mockNotifications, unreadCount: 2,
    user: mockUser, sidebarCollapsed: false,
    onNotificationRead: () => {}, onNotificationReadAll: () => {}, onSignOut: () => {},
  },
};
export const SidebarCollapsed: Story = {
  args: { ...Default.args, sidebarCollapsed: true },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Users, ShoppingCart, MessageSquare } from "lucide-react";
import { NotificationCenter } from "../../src/components/composite/notification-center";
import type { NotificationItem } from "../../src/types/notification-item";

const mockNotifications: NotificationItem[] = [
  { id: "1", icon: Users, colorVariant: "primary", title: "Nowy kontakt", message: "Jan Kowalski dodał nowy kontakt do CRM", time: "2 min temu", read: false },
  { id: "2", icon: ShoppingCart, colorVariant: "success", title: "Zamówienie #1234", message: "Nowe zamówienie na kwotę 1200 zł", time: "15 min temu", read: false },
  { id: "3", icon: MessageSquare, colorVariant: "warning", title: "Nowa wiadomość", message: "Masz 3 nieprzeczytane wiadomości", time: "1 godz. temu", read: true },
];

const meta: Meta<typeof NotificationCenter> = {
  title: "Composite/NotificationCenter",
  component: NotificationCenter,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof NotificationCenter>;

export const WithUnread: Story = { args: { notifications: mockNotifications, unreadCount: 2, onRead: () => {}, onReadAll: () => {}, notificationsPageUrl: "/notifications" } };
export const Empty: Story = { args: { notifications: [], unreadCount: 0, onRead: () => {}, onReadAll: () => {} } };

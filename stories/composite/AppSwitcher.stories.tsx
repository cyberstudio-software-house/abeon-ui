import type { Meta, StoryObj } from "@storybook/react";
import { Users, FileText, ShoppingCart, Bot, Mail, Calendar } from "lucide-react";
import { AppSwitcher } from "../../src/components/composite/app-switcher";
import type { AppManifest } from "../../src/types/app-manifest";

const mockApps: AppManifest[] = [
  { id: "crm", name: "CRM", icon: Users, description: "Zarządzanie relacjami", url: "/crm", category: "crm" },
  { id: "cms", name: "CMS", icon: FileText, description: "Zarządzanie treściami", url: "/cms", category: "cms" },
  { id: "ecommerce", name: "E-Commerce", icon: ShoppingCart, description: "Sklep internetowy", url: "/ecommerce", category: "ecommerce" },
  { id: "ai", name: "AI Assistant", icon: Bot, description: "Asystent AI", url: "/ai", category: "ai" },
  { id: "mailing", name: "Mailing", icon: Mail, description: "Kampanie email", url: "/mailing", category: "mailing" },
  { id: "calendar", name: "Kalendarz", icon: Calendar, description: "Harmonogram", url: "/calendar", category: "calendar" },
];

const meta: Meta<typeof AppSwitcher> = {
  title: "Composite/AppSwitcher",
  component: AppSwitcher,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof AppSwitcher>;

export const Default: Story = { args: { apps: mockApps, currentAppId: "crm" } };
export const NoActiveApp: Story = { args: { apps: mockApps, currentAppId: "" } };

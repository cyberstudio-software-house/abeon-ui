import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3, Users, Settings } from "lucide-react";
import { AppSidebar } from "../../src/components/layout/app-sidebar";
import type { NavGroup } from "../../src/components/layout/app-sidebar";

const mockNavGroups: NavGroup[] = [
  {
    id: "main",
    label: "Główne",
    items: [
      { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/crm", isActive: true },
      { id: "contacts", label: "Kontakty", icon: Users, href: "/crm/contacts" },
      { id: "settings", label: "Ustawienia", icon: Settings, href: "/crm/settings" },
    ],
  },
];

const meta: Meta<typeof AppSidebar> = {
  title: "Layout/AppSidebar",
  component: AppSidebar,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof AppSidebar>;

export const Expanded: Story = {
  args: { navGroups: mockNavGroups, collapsed: false, onCollapsedChange: () => {}, mobileOpen: false, onMobileOpenChange: () => {} },
};
export const Collapsed: Story = {
  args: { navGroups: mockNavGroups, collapsed: true, onCollapsedChange: () => {}, mobileOpen: false, onMobileOpenChange: () => {} },
};

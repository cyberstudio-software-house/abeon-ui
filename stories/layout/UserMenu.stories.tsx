import type { Meta, StoryObj } from "@storybook/react";
import { LifeBuoy, Map } from "lucide-react";
import { UserMenu } from "../../src/components/layout/user-menu";

const baseUser = {
  name: "Jan Kowalski",
  email: "jan@example.com",
  initials: "JK",
};

const meta: Meta<typeof UserMenu> = {
  title: "Layout/UserMenu",
  component: UserMenu,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {
  args: {
    user: baseUser,
    profileUrl: "/profile",
    settingsUrl: "/settings",
    onSignOut: () => {},
  },
};

export const WithAvatar: Story = {
  args: {
    ...Default.args,
    user: {
      ...baseUser,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jan",
    },
  },
};

export const WithExtraItems: Story = {
  args: {
    ...Default.args,
    extraItems: [
      { label: "Roadmapa", icon: Map, href: "/roadmap" },
      { label: "Pomoc", icon: LifeBuoy, onClick: () => {} },
    ],
  },
};

export const Minimal: Story = {
  args: {
    user: baseUser,
    onSignOut: () => {},
  },
};

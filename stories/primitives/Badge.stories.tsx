import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../src/components/badge";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "Nowy" } };
export const Secondary: Story = { args: { variant: "secondary", children: "W toku" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Błąd" } };
export const Outline: Story = { args: { variant: "outline", children: "Archiwum" } };

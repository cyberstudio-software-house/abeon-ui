import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../src/components/button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Kliknij mnie" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Usuń" } };
export const Outline: Story = { args: { variant: "outline", children: "Anuluj" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Pomiń" } };
export const Small: Story = { args: { size: "sm", children: "Mały" } };
export const Large: Story = { args: { size: "lg", children: "Duży" } };

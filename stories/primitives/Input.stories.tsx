import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../src/components/input";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Wpisz tekst..." } };
export const WithValue: Story = { args: { defaultValue: "jan@example.com", type: "email" } };
export const Disabled: Story = { args: { placeholder: "Niedostępne", disabled: true } };

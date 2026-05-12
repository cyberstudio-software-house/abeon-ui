import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "../../src/components/spinner";
import { Button } from "../../src/components/button";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner tone="default" />
      <Spinner tone="primary" />
      <Button disabled>
        <Spinner tone="inherit" size="sm" className="mr-2" />
        Saving…
      </Button>
    </div>
  ),
};

export const WithCustomLabel: Story = {
  args: { label: "Submitting form" },
};

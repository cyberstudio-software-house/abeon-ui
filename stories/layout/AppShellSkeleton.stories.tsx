import type { Meta, StoryObj } from "@storybook/react";
import { AppShellSkeleton, PageSkeleton } from "../../src/components/layout/app-shell-skeleton";

const meta: Meta<typeof AppShellSkeleton> = {
  title: "Layout/AppShellSkeleton",
  component: AppShellSkeleton,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof AppShellSkeleton>;

export const Starting: Story = { args: { label: "Ładowanie aplikacji…" } };

export const PageOnly: StoryObj<typeof PageSkeleton> = {
  render: () => (
    <div className="p-6">
      <PageSkeleton rows={4} />
    </div>
  ),
};

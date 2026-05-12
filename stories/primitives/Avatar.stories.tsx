import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../src/components/avatar";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackInitials: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>TW</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MN</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar className="h-6 w-6 text-xs">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16 text-lg">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Stack: Story = {
  render: () => (
    <div className="flex -space-x-2">
      {["AK", "TW", "MN", "PM"].map((initials) => (
        <Avatar key={initials} className="border-2 border-background">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <div className="flex items-center justify-center h-10 w-10 rounded-full border-2 border-background bg-muted text-xs font-medium">
        +12
      </div>
    </div>
  ),
};

export const Broken: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://example.invalid/missing.png" alt="missing" />
      <AvatarFallback>??</AvatarFallback>
    </Avatar>
  ),
};

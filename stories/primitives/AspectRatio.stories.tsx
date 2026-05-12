import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio } from "../../src/components/aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "Primitives/AspectRatio",
  component: AspectRatio,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof AspectRatio>;

const Placeholder = ({ label }: { label: string }) => (
  <div className="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-foreground-muted">
    {label}
  </div>
);

export const Square: Story = {
  render: () => (
    <div className="w-72">
      <AspectRatio ratio={1}>
        <Placeholder label="1 : 1" />
      </AspectRatio>
    </div>
  ),
};

export const Widescreen: Story = {
  render: () => (
    <div className="w-96">
      <AspectRatio ratio={16 / 9}>
        <Placeholder label="16 : 9" />
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  render: () => (
    <div className="w-60">
      <AspectRatio ratio={3 / 4}>
        <Placeholder label="3 : 4" />
      </AspectRatio>
    </div>
  ),
};

export const VideoEmbed: Story = {
  render: () => (
    <div className="w-[480px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
        <div className="flex h-full w-full items-center justify-center text-sm text-foreground-muted">
          ▶︎ Wideo (16:9)
        </div>
      </AspectRatio>
    </div>
  ),
};

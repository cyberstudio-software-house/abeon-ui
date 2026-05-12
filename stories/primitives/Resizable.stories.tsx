import type { Meta, StoryObj } from "@storybook/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../src/components/resizable";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "Primitives/Resizable",
  component: ResizablePanelGroup,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-72 max-w-[640px] rounded-md border"
    >
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          <span>Lewy panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          <span>Prawy panel</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="vertical"
      className="h-72 max-w-[640px] rounded-md border"
    >
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Górny panel
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Dolny panel
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const ThreePanel: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-80 max-w-[800px] rounded-md border"
    >
      <ResizablePanel defaultSize={20} minSize={10}>
        <div className="flex h-full items-center justify-center p-4 text-sm">Nawigacja</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={55}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full items-center justify-center p-4 text-sm">Edytor</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <div className="flex h-full items-center justify-center p-4 text-sm">Konsola</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={15}>
        <div className="flex h-full items-center justify-center p-4 text-sm">Inspektor</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea, ScrollBar } from "../../src/components/scroll-area";
import { Separator } from "../../src/components/separator";

const meta: Meta<typeof ScrollArea> = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 50 }, (_, i) => `Tag ${i + 1}`);

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border p-3">
      <h4 className="mb-2 text-sm font-semibold">Tagi</h4>
      {tags.map((t) => (
        <div key={t} className="text-sm py-1">
          {t}
          <Separator className="mt-1" />
        </div>
      ))}
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-[480px] whitespace-nowrap rounded-md border">
      <div className="flex w-max gap-3 p-3">
        {Array.from({ length: 12 }, (_, i) => (
          <figure key={i} className="shrink-0">
            <div className="h-32 w-40 rounded-md bg-muted flex items-center justify-center text-xs text-foreground-muted">
              Obraz {i + 1}
            </div>
            <figcaption className="text-xs pt-2 text-foreground-muted">
              Galeria zdjęć — pozycja {i + 1}
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const ChatMessages: Story = {
  render: () => (
    <ScrollArea className="h-80 w-[420px] rounded-md border p-4">
      <div className="space-y-3">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className={i % 2 === 0 ? "text-right" : ""}>
            <div
              className={`inline-block rounded-lg px-3 py-2 text-sm max-w-[70%] ${
                i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              Wiadomość {i + 1}: lorem ipsum dolor sit amet.
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

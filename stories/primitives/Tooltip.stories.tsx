import type { Meta, StoryObj } from "@storybook/react";
import { Info, Trash2, Copy, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../src/components/tooltip";
import { Button } from "../../src/components/button";
import { IconButton } from "../../src/components/icon-button";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Najedź na mnie</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Skrót: ⌘K</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIconButton: Story = {
  render: () => (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Edytuj">
            <Pencil className="h-4 w-4" />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>Edytuj</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Kopiuj">
            <Copy className="h-4 w-4" />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>Kopiuj</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton aria-label="Usuń">
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>Usuń</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-12">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              side={side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p>side: {side}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const InlineHelp: Story = {
  render: () => (
    <p className="flex items-center gap-2 text-sm">
      <span>Identyfikator API</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" aria-label="Pomoc">
            <Info className="h-3.5 w-3.5 text-foreground-muted hover:text-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-[200px]">
            Identyfikator generowany automatycznie. Nie zmienia się przy zmianie nazwy.
          </p>
        </TooltipContent>
      </Tooltip>
    </p>
  ),
};

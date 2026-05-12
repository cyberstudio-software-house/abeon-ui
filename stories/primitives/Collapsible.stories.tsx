import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../src/components/collapsible";
import { Button } from "../../src/components/button";

const meta: Meta<typeof Collapsible> = {
  title: "Primitives/Collapsible",
  component: Collapsible,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-[420px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">@anna.kowalska udostępniła 3 repozytoria</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Przełącz</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @abeon/ui
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @abeon/shell
          </div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @abeon/utils
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const ShowMore: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-[420px] space-y-2">
        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
        <CollapsibleContent>
          <p className="text-sm text-foreground-muted">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </CollapsibleContent>
        <CollapsibleTrigger asChild>
          <Button variant="link" size="sm" className="px-0">
            {open ? "Pokaż mniej" : "Pokaż więcej"}
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    );
  },
};

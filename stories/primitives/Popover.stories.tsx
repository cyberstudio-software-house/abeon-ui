import type { Meta, StoryObj } from "@storybook/react";
import { Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../src/components/popover";
import { Button } from "../../src/components/button";
import { Input } from "../../src/components/input";
import { Label } from "../../src/components/label";

const meta: Meta<typeof Popover> = {
  title: "Primitives/Popover",
  component: Popover,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Otwórz popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Powiadomienia</h4>
          <p className="text-sm text-foreground-muted">
            Zarządzaj kanałami i preferencjami otrzymywania powiadomień.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
          Wymiary
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Wymiary</h4>
            <p className="text-sm text-foreground-muted">Ustaw szerokość i wysokość obszaru.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Szerokość</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Wysokość</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["start", "center", "end"] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              align={align}
            </Button>
          </PopoverTrigger>
          <PopoverContent align={align}>
            <p className="text-sm">Wyrównanie: <code>{align}</code></p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

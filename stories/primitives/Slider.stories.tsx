import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "../../src/components/slider";
import { Label } from "../../src/components/label";

const meta: Meta<typeof Slider> = {
  title: "Primitives/Slider",
  component: Slider,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  ),
};

export const WithStep: Story = {
  render: () => {
    const [value, setValue] = React.useState([15]);
    return (
      <div className="w-80 space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Czas trwania</Label>
          <span className="text-foreground-muted">{value[0]} min</span>
        </div>
        <Slider value={value} onValueChange={setValue} min={5} max={60} step={5} />
      </div>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [value, setValue] = React.useState([20, 80]);
    return (
      <div className="w-80 space-y-2">
        <div className="flex justify-between text-sm">
          <Label>Zakres ceny</Label>
          <span className="text-foreground-muted">{value[0]} – {value[1]} PLN</span>
        </div>
        <Slider value={value} onValueChange={setValue} min={0} max={100} step={1} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[33]} max={100} disabled />
    </div>
  ),
};

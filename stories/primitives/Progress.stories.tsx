import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "../../src/components/progress";

const meta: Meta<typeof Progress> = {
  title: "Primitives/Progress",
  component: Progress,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Progress value={62} />
    </div>
  ),
};

export const Steps: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Progress value={0} />
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(() => {
        setValue((v) => (v >= 100 ? 0 : v + 5));
      }, 250);
      return () => clearInterval(id);
    }, []);
    return (
      <div className="w-80 space-y-2">
        <Progress value={value} />
        <p className="text-xs text-foreground-muted text-right">{value}%</p>
      </div>
    );
  },
};

export const Indeterminate: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <p className="text-xs text-foreground-muted">
        Brak <code>value</code> (lub <code>null</code>) traktowany jako stan nieokreślony.
      </p>
      <Progress />
    </div>
  ),
};

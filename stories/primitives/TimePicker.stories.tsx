import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "../../src/components/time-picker";

const meta: Meta<typeof TimePicker> = {
  title: "Primitives/TimePicker",
  component: TimePicker,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof TimePicker>;

const Demo = ({
  initial = "",
  ...rest
}: React.ComponentProps<typeof TimePicker> & { initial?: string }) => {
  const [value, setValue] = React.useState(initial);
  return (
    <div style={{ width: 240 }}>
      <TimePicker value={value} onChange={setValue} {...rest} />
      <p className="mt-2 text-xs text-foreground-muted">Wartość: {value || "—"}</p>
    </div>
  );
};

export const Default: Story = {
  render: () => <Demo />,
};

export const WithValue: Story = {
  render: () => <Demo initial="14:30" />,
};

export const Disabled: Story = {
  render: () => <Demo initial="09:00" disabled />,
};

export const Errored: Story = {
  render: () => <Demo initial="03:15" error />,
};

export const FifteenMinuteSteps: Story = {
  render: () => <Demo initial="10:00" step={15 * 60} />,
};

export const BusinessHours: Story = {
  render: () => <Demo initial="09:00" min="09:00" max="17:00" />,
};

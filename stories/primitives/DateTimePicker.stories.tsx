import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateTimePicker } from "../../src/components/date-time-picker";

const meta: Meta<typeof DateTimePicker> = {
  title: "Primitives/DateTimePicker",
  component: DateTimePicker,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof DateTimePicker>;

const Demo = ({
  initial,
  ...rest
}: React.ComponentProps<typeof DateTimePicker> & { initial?: Date }) => {
  const [value, setValue] = React.useState<Date | undefined>(initial);
  return (
    <div style={{ width: 320 }}>
      <DateTimePicker value={value} onChange={setValue} {...rest} />
      <p className="mt-2 text-xs text-foreground-muted">
        Wartość: {value ? value.toISOString() : "—"}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: () => <Demo />,
};

export const WithValue: Story = {
  render: () => <Demo initial={new Date(2026, 3, 28, 14, 30)} />,
};

export const Disabled: Story = {
  render: () => <Demo initial={new Date(2026, 3, 28, 9, 0)} disabled />,
};

export const WithBounds: Story = {
  render: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inTwoWeeks = new Date(today);
    inTwoWeeks.setDate(today.getDate() + 14);
    return <Demo fromDate={today} toDate={inTwoWeeks} />;
  },
};

export const FifteenMinuteSteps: Story = {
  render: () => <Demo initial={new Date(2026, 3, 28, 10, 0)} step={15 * 60} />,
};

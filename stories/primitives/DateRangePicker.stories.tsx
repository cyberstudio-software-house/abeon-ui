import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "../../src/components/date-range-picker";

const meta: Meta<typeof DateRangePicker> = {
  title: "Primitives/DateRangePicker",
  component: DateRangePicker,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof DateRangePicker>;

const Controlled = (args: React.ComponentProps<typeof DateRangePicker>) => {
  const [value, setValue] = React.useState<DateRange | undefined>(args.value);
  return (
    <div className="w-96">
      <DateRangePicker {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
};

export const WithValue: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    value: { from: new Date(2026, 3, 1), to: new Date(2026, 3, 14) },
  },
};

export const SingleMonth: Story = {
  render: (args) => <Controlled {...args} />,
  args: { numberOfMonths: 1 },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { disabled: true, placeholder: "Niedostępne" },
};

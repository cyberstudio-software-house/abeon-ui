import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "../../src/components/date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "Primitives/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

const Controlled = (args: React.ComponentProps<typeof DatePicker>) => {
  const [value, setValue] = React.useState<Date | undefined>(args.value);
  return (
    <div className="w-72">
      <DatePicker {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
};

export const WithValue: Story = {
  render: (args) => <Controlled {...args} />,
  args: { value: new Date(2026, 3, 15) },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { disabled: true, placeholder: "Niedostępne" },
};

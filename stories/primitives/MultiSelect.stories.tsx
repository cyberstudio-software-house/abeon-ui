import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultiSelect, type MultiSelectOption } from "../../src/components/multi-select";

const meta: Meta<typeof MultiSelect> = {
  title: "Primitives/MultiSelect",
  component: MultiSelect,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof MultiSelect>;

const options: MultiSelectOption[] = [
  { value: "crm", label: "CRM" },
  { value: "finance", label: "Finanse" },
  { value: "hr", label: "Kadry" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "spedycja", label: "Spedycja" },
  { value: "cms", label: "CMS" },
  { value: "kalendarz", label: "Kalendarz" },
];

const Controlled = (args: React.ComponentProps<typeof MultiSelect>) => {
  const [value, setValue] = React.useState<string[]>(args.value);
  return (
    <div className="w-96">
      <MultiSelect {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: { options, value: [] },
};

export const WithValue: Story = {
  render: (args) => <Controlled {...args} />,
  args: { options, value: ["crm", "finance"] },
};

export const Overflow: Story = {
  render: (args) => <Controlled {...args} />,
  args: { options, value: ["crm", "finance", "hr", "ecommerce", "spedycja"], maxDisplay: 2 },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { options, value: ["crm"], disabled: true },
};

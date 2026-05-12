import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Combobox, type ComboboxOption } from "../../src/components/combobox";

const meta: Meta<typeof Combobox> = {
  title: "Primitives/Combobox",
  component: Combobox,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Combobox>;

const options: ComboboxOption[] = [
  { value: "1", label: "Acme Sp. z o.o.", keywords: ["1234567890", "acme"] },
  { value: "2", label: "Kowalski Janusz", keywords: ["9876543210"] },
  { value: "3", label: "Cyberstudio Software House", keywords: ["1112223334"] },
  { value: "4", label: "Globex Industries", keywords: ["5556667778"] },
  { value: "5", label: "Initech Solutions", keywords: ["9990001112"] },
];

const Controlled = (args: React.ComponentProps<typeof Combobox>) => {
  const [value, setValue] = React.useState<string | undefined>(args.value);
  return (
    <div className="w-80">
      <Combobox {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: { options, placeholder: "Wybierz kontrahenta..." },
};

export const WithValue: Story = {
  render: (args) => <Controlled {...args} />,
  args: { options, value: "1" },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { options, value: "2", disabled: true },
};

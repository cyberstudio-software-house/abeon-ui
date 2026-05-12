import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../../src/components/checkbox";
import { Label } from "../../src/components/label";

const meta: Meta<typeof Checkbox> = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => <Checkbox id="default" />,
};

export const Checked: Story = {
  render: () => <Checkbox id="checked" defaultChecked />,
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Checkbox id="d1" disabled />
      <Checkbox id="d2" disabled defaultChecked />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Akceptuję regulamin</Label>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="items-top flex space-x-2">
      <Checkbox id="newsletter" />
      <div className="grid gap-1.5 leading-none">
        <Label htmlFor="newsletter">Zapisz mnie do newslettera</Label>
        <p className="text-sm text-foreground-muted">
          Otrzymasz aktualizacje produktowe raz w miesiącu. Możesz wypisać się w każdej chwili.
        </p>
      </div>
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => {
    const [items, setItems] = React.useState([true, false, true]);
    const allChecked = items.every(Boolean);
    const noneChecked = items.every((v) => !v);
    const checked: boolean | "indeterminate" = allChecked ? true : noneChecked ? false : "indeterminate";
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="parent"
            checked={checked}
            onCheckedChange={(v) => setItems(items.map(() => v === true))}
          />
          <Label htmlFor="parent">Zaznacz wszystkie ({items.filter(Boolean).length}/{items.length})</Label>
        </div>
        <div className="ml-6 space-y-2">
          {items.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <Checkbox
                id={`child-${i}`}
                checked={v}
                onCheckedChange={(c) => {
                  setItems(items.map((it, idx) => (idx === i ? c === true : it)));
                }}
              />
              <Label htmlFor={`child-${i}`}>Pozycja {i + 1}</Label>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

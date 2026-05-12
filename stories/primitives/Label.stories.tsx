import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../../src/components/label";
import { Input } from "../../src/components/input";
import { Checkbox } from "../../src/components/checkbox";

const meta: Meta<typeof Label> = {
  title: "Primitives/Label",
  component: Label,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => <Label>Adres e-mail</Label>,
};

export const PairedWithInput: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <Label htmlFor="email">Adres e-mail</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const PairedWithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="remember" />
      <Label htmlFor="remember">Zapamiętaj mnie na tym urządzeniu</Label>
    </div>
  ),
};

export const RequiredManual: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <Label htmlFor="name">
        Imię
        <span aria-hidden="true" className="ml-0.5 text-destructive">*</span>
      </Label>
      <Input id="name" required />
      <p className="text-xs text-foreground-muted">
        Aby wymusić to automatycznie, użyj <code>FormItem</code> z <code>required</code>.
      </p>
    </div>
  ),
};

export const PeerDisabled: Story = {
  render: () => (
    <div className="w-72 flex items-center gap-2">
      <Input id="disabled-input" disabled className="peer" />
      <Label htmlFor="disabled-input">
        Etykieta przyciemniana, gdy peer disabled
      </Label>
    </div>
  ),
};

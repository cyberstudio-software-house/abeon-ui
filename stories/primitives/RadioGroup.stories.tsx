import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "../../src/components/radio-group";
import { Label } from "../../src/components/label";

const meta: Meta<typeof RadioGroup> = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Domyślna</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Wygodna</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Kompaktowa</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="card" className="grid gap-3 max-w-sm">
      {[
        { value: "card", label: "Karta płatnicza", desc: "Visa, Mastercard, BLIK" },
        { value: "transfer", label: "Przelew", desc: "Standardowy przelew bankowy" },
        { value: "invoice", label: "Faktura", desc: "Płatność z odroczonym terminem (7-30 dni)" },
      ].map(({ value, label, desc }) => (
        <Label
          key={value}
          htmlFor={`pay-${value}`}
          className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent"
        >
          <RadioGroupItem value={value} id={`pay-${value}`} className="mt-0.5" />
          <div>
            <div className="font-medium">{label}</div>
            <div className="text-sm text-foreground-muted">{desc}</div>
          </div>
        </Label>
      ))}
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="b" disabled>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="a" />
        <Label htmlFor="a">Opcja A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="b" />
        <Label htmlFor="b">Opcja B (wybrana)</Label>
      </div>
    </RadioGroup>
  ),
};

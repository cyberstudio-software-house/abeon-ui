import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../../src/components/switch";
import { Label } from "../../src/components/label";

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => <Switch />,
};

export const Checked: Story = {
  render: () => <Switch defaultChecked />,
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Tryb samolotowy</Label>
    </div>
  ),
};

export const SettingsList: Story = {
  render: () => (
    <div className="grid gap-4 max-w-sm">
      {[
        { id: "notifs", label: "Powiadomienia push", desc: "Otrzymuj powiadomienia w przeglądarce", on: true },
        { id: "marketing", label: "E-maile marketingowe", desc: "Aktualizacje produktu i promocje", on: false },
        { id: "2fa", label: "Uwierzytelnianie dwuetapowe", desc: "Wymagaj kodu z aplikacji przy logowaniu", on: true },
      ].map((s) => (
        <div key={s.id} className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <Label htmlFor={s.id}>{s.label}</Label>
            <p className="text-sm text-foreground-muted">{s.desc}</p>
          </div>
          <Switch id={s.id} defaultChecked={s.on} />
        </div>
      ))}
    </div>
  ),
};

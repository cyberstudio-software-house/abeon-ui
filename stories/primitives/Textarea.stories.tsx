import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "../../src/components/textarea";
import { Label } from "../../src/components/label";

const meta: Meta<typeof Textarea> = {
  title: "Primitives/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <Textarea placeholder="Wpisz wiadomość..." />
    </div>
  ),
};

export const WithValue: Story = {
  render: () => (
    <div className="w-80">
      <Textarea defaultValue={"Cześć,\n\nDziękuję za wiadomość. Odezwę się jak najszybciej."} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Krótki opis o sobie..." rows={5} />
      <p className="text-xs text-foreground-muted">Maksymalnie 500 znaków.</p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Textarea disabled defaultValue="Pole nieedytowalne — tryb tylko do odczytu." />
    </div>
  ),
};

export const Rows: Story = {
  render: () => (
    <div className="grid gap-4 w-80">
      <Textarea rows={3} placeholder="3 rzędy" />
      <Textarea rows={6} placeholder="6 rzędów" />
      <Textarea rows={10} placeholder="10 rzędów" />
    </div>
  ),
};

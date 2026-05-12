import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "../../src/components/separator";

const meta: Meta<typeof Separator> = {
  title: "Primitives/Separator",
  component: Separator,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-80">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">Profil użytkownika</h4>
        <p className="text-sm text-foreground-muted">Zarządzaj informacjami publicznymi.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center gap-4 text-sm">
        <span>Bio</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Strona</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Lokalizacja</span>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-3">
      <span className="text-sm">Edytuj</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Duplikuj</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-danger">Usuń</span>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div className="w-56 rounded-md border p-1 text-sm">
      <div className="px-2 py-1.5">Profil</div>
      <div className="px-2 py-1.5">Ustawienia</div>
      <Separator className="my-1" />
      <div className="px-2 py-1.5 text-danger">Wyloguj</div>
    </div>
  ),
};

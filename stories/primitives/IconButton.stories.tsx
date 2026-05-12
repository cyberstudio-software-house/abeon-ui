import type { Meta, StoryObj } from "@storybook/react";
import { Pencil, Trash2, Copy, Settings, ChevronRight, MoreHorizontal } from "lucide-react";
import { IconButton } from "../../src/components/icon-button";

const meta: Meta<typeof IconButton> = {
  title: "Primitives/IconButton",
  component: IconButton,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  render: () => (
    <IconButton aria-label="Więcej">
      <MoreHorizontal />
    </IconButton>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton variant="default" aria-label="Domyślny"><Pencil /></IconButton>
      <IconButton variant="secondary" aria-label="Secondary"><Pencil /></IconButton>
      <IconButton variant="ghost" aria-label="Ghost"><Pencil /></IconButton>
      <IconButton variant="outline" aria-label="Outline"><Pencil /></IconButton>
      <IconButton variant="danger" aria-label="Usuń"><Trash2 /></IconButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton size="sm" aria-label="Mały"><Settings /></IconButton>
      <IconButton size="default" aria-label="Domyślny"><Settings /></IconButton>
      <IconButton size="lg" aria-label="Duży"><Settings /></IconButton>
      <IconButton size="xl" aria-label="Największy"><Settings /></IconButton>
    </div>
  ),
};

export const WithTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton tooltip="Edytuj" aria-label="Edytuj"><Pencil /></IconButton>
      <IconButton tooltip="Kopiuj" aria-label="Kopiuj"><Copy /></IconButton>
      <IconButton tooltip="Usuń" aria-label="Usuń" variant="danger"><Trash2 /></IconButton>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <IconButton loading aria-label="Ładowanie">
      <ChevronRight />
    </IconButton>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton disabled aria-label="Wyłączony"><Pencil /></IconButton>
      <IconButton variant="default" disabled aria-label="Wyłączony"><Pencil /></IconButton>
      <IconButton variant="danger" disabled aria-label="Wyłączony"><Trash2 /></IconButton>
    </div>
  ),
};

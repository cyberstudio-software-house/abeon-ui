import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/dialog";
import { Button } from "../../src/components/button";
import { Input } from "../../src/components/input";
import { Label } from "../../src/components/label";

const meta: Meta<typeof Dialog> = {
  title: "Primitives/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Otwórz dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edycja profilu</DialogTitle>
          <DialogDescription>
            Zmiany zostaną zapisane po kliknięciu przycisku Zapisz.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Imię</Label>
            <Input id="name" defaultValue="Anna Kowalska" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Login</Label>
            <Input id="username" defaultValue="@anna" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Zapisz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutDescription: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Pokaż szczegóły</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Faktura FV/2026/04/0042</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-foreground-muted py-4">
          Zawartość bez opisu — DialogTitle pozostaje wymagany dla a11y.
        </div>
        <DialogFooter>
          <Button>Zamknij</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Otwórz długi dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Regulamin</DialogTitle>
          <DialogDescription>Zaakceptuj warunki, aby kontynuować.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm py-4">
          {Array.from({ length: 8 }, (_, i) => (
            <p key={i}>
              §{i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </p>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline">Odrzuć</Button>
          <Button>Akceptuję</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

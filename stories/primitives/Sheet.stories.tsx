import type { Meta, StoryObj } from "@storybook/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "../../src/components/sheet";
import { Button } from "../../src/components/button";
import { Input } from "../../src/components/input";
import { Label } from "../../src/components/label";

const meta: Meta<typeof Sheet> = {
  title: "Primitives/Sheet",
  component: Sheet,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Sheet>;

const ContentBody = () => (
  <div className="grid gap-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="sheet-name">Nazwa</Label>
      <Input id="sheet-name" defaultValue="Projekt Nimbus" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="sheet-team">Zespół</Label>
      <Input id="sheet-team" defaultValue="Platforma" />
    </div>
  </div>
);

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Otwórz panel (right)</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edycja projektu</SheetTitle>
          <SheetDescription>Zmień podstawowe dane projektu.</SheetDescription>
        </SheetHeader>
        <ContentBody />
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Anuluj</Button>
          </SheetClose>
          <Button>Zapisz</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Otwórz panel (left)</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Nawigacja</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 py-4 text-sm">
          <a href="#" className="hover:underline">Dashboard</a>
          <a href="#" className="hover:underline">Projekty</a>
          <a href="#" className="hover:underline">Ustawienia</a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Otwórz panel (top)</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Komunikat systemowy</SheetTitle>
          <SheetDescription>Konserwacja zaplanowana na noc 30/04.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Otwórz panel (bottom)</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Filtry</SheetTitle>
        </SheetHeader>
        <ContentBody />
      </SheetContent>
    </Sheet>
  ),
};

export const WideRight: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Szeroki panel</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Edycja faktury</SheetTitle>
          <SheetDescription>Szerszy panel dla formularzy z dwukolumnowym układem.</SheetDescription>
        </SheetHeader>
        <ContentBody />
      </SheetContent>
    </Sheet>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "../../src/components/drawer";
import { Button } from "../../src/components/button";

const meta: Meta<typeof Drawer> = {
  title: "Primitives/Drawer",
  component: Drawer,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Otwórz drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Płatność miesięczna</DrawerTitle>
            <DrawerDescription>
              Wybierz metodę płatności na bieżący okres rozliczeniowy.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 text-sm">
            <p className="text-foreground-muted">
              Drawer (Vaul) jest preferowany dla mobilnych ekranów — animuje od dołu
              i pozwala na gesty zamykające.
            </p>
          </div>
          <DrawerFooter>
            <Button>Potwierdź</Button>
            <DrawerClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const NestedContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Drawer ze szczegółami</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Zamówienie #2026-0042</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-3 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Klient</span>
              <span>Acme Sp. z o.o.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Wartość</span>
              <span className="font-medium">12 450 PLN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Status</span>
              <span>W realizacji</span>
            </div>
          </div>
          <DrawerFooter>
            <Button>Zobacz szczegóły</Button>
            <DrawerClose asChild>
              <Button variant="outline">Zamknij</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

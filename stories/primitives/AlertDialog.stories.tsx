import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../src/components/alert-dialog";
import { Button } from "../../src/components/button";
import { buttonVariants } from "../../src/components/button";
import { cn } from "../../src/lib/utils";

const meta: Meta<typeof AlertDialog> = {
  title: "Primitives/AlertDialog",
  component: AlertDialog,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Pokaż AlertDialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno?</AlertDialogTitle>
          <AlertDialogDescription>
            Ta operacja zostanie wykonana natychmiast i jest odwracalna.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction>Kontynuuj</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Destructive: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Usuń projekt</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć projekt Nimbus?</AlertDialogTitle>
          <AlertDialogDescription>
            Operacja jest nieodwracalna. Wszystkie zasoby chmurowe zostaną usunięte
            w ciągu 24 godzin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))}>
            Usuń projekt
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const HelperNote: Story = {
  render: () => (
    <div className="text-sm text-foreground-muted max-w-md">
      Dla typowych przypadków użyj komponentu <code>ConfirmDialog</code> z
      <code> Composite/ConfirmDialog</code> — opakowuje on AlertDialog i obsługuje
      asynchroniczne <code>onConfirm</code> ze stanem ładowania.
    </div>
  ),
};

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "../../src/components/confirm-dialog";
import { Button } from "../../src/components/button";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Composite/ConfirmDialog",
  component: ConfirmDialog,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Otwórz dialog</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Zapisać zmiany?"
          description="Twoje zmiany zostaną zachowane i synchronizowane na wszystkich urządzeniach."
          confirmLabel="Zapisz"
          cancelLabel="Anuluj"
          onConfirm={() => {
            // sync — closes immediately because the AlertDialogAction's default
            // close behavior runs after onClick.
          }}
        />
      </>
    );
  },
};

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Usuń projekt
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          variant="destructive"
          title="Usunąć projekt Nimbus?"
          description="Operacja jest nieodwracalna. Wszystkie powiązane zasoby chmurowe zostaną usunięte w ciągu 24 godzin."
          confirmLabel="Usuń projekt"
          cancelLabel="Anuluj"
          onConfirm={() => {
            // sync delete
          }}
        />
      </>
    );
  },
};

export const AsyncConfirm: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Wyślij raport</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Wysłać raport miesięczny?"
          description="Raport zostanie wygenerowany i przesłany na e-mail w ciągu kilku minut."
          confirmLabel="Wyślij"
          onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1500))}
        />
      </>
    );
  },
};

export const CustomLabels: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Wyloguj
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Wylogować ze wszystkich urządzeń?"
          description="Sesje na innych urządzeniach zostaną zakończone, ale dane pozostaną nienaruszone."
          confirmLabel="Tak, wyloguj wszędzie"
          cancelLabel="Pozostań zalogowany"
          onConfirm={() => {}}
        />
      </>
    );
  },
};

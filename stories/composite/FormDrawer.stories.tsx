import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormDrawer } from "../../src/components/form-drawer";
import { Button } from "../../src/components/button";
import { Input } from "../../src/components/input";
import { Label } from "../../src/components/label";
import { Textarea } from "../../src/components/textarea";

const meta: Meta<typeof FormDrawer> = {
  title: "Composite/FormDrawer",
  component: FormDrawer,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof FormDrawer>;

const SimpleFields = () => (
  <div className="flex flex-col gap-4">
    <div className="space-y-2">
      <Label htmlFor="name">Nazwa</Label>
      <Input id="name" placeholder="Wpisz nazwę..." />
    </div>
    <div className="space-y-2">
      <Label htmlFor="desc">Opis</Label>
      <Textarea id="desc" placeholder="Opisz krótko..." rows={4} />
    </div>
  </div>
);

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Otwórz drawer</Button>
        <FormDrawer
          open={open}
          onOpenChange={setOpen}
          title="Nowy projekt"
          description="Wypełnij wymagane pola, aby utworzyć projekt."
          submitLabel="Utwórz"
          cancelLabel="Anuluj"
          onSubmit={() => {}}
        >
          <SimpleFields />
        </FormDrawer>
      </>
    );
  },
};

export const AsyncSubmit: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Otwórz async drawer</Button>
        <FormDrawer
          open={open}
          onOpenChange={setOpen}
          title="Wyślij zapytanie"
          description="Po kliknięciu Wyślij operacja potrwa około 1.5s."
          submitLabel="Wyślij"
          onSubmit={() => new Promise((resolve) => setTimeout(resolve, 1500))}
        >
          <SimpleFields />
        </FormDrawer>
      </>
    );
  },
};

export const SizeLg: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Otwórz LG</Button>
        <FormDrawer
          open={open}
          onOpenChange={setOpen}
          title="Edycja faktury"
          size="lg"
          submitLabel="Zapisz"
          onSubmit={() => {}}
        >
          <SimpleFields />
        </FormDrawer>
      </>
    );
  },
};

export const SizeXl: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Otwórz XL</Button>
        <FormDrawer
          open={open}
          onOpenChange={setOpen}
          title="Edycja umowy"
          description="Szeroki drawer dla formularzy z dwukolumnowym układem."
          size="xl"
          submitLabel="Zapisz"
          onSubmit={() => {}}
        >
          <SimpleFields />
        </FormDrawer>
      </>
    );
  },
};

export const CustomFooter: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Otwórz z custom footer</Button>
        <FormDrawer
          open={open}
          onOpenChange={setOpen}
          title="Dokument"
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Anuluj
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Zapisz szkic
              </Button>
              <Button onClick={() => setOpen(false)}>Wystaw</Button>
            </>
          }
        >
          <SimpleFields />
        </FormDrawer>
      </>
    );
  },
};

export const NoSubmit: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Otwórz read-only drawer</Button>
        <FormDrawer
          open={open}
          onOpenChange={setOpen}
          title="Szczegóły zlecenia"
          description="Tylko do odczytu — brak akcji submit."
          cancelLabel="Zamknij"
        >
          <SimpleFields />
        </FormDrawer>
      </>
    );
  },
};

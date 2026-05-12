import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Toaster as Sonner } from "../../src/components/sonner";
import { Button } from "../../src/components/button";

const meta: Meta = {
  title: "Primitives/Sonner",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Sonner />
      </>
    ),
  ],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast("Skopiowano do schowka")}>Domyślny</Button>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast.success("Zapisano zmiany")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("Nowa wersja jest dostępna")}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Sesja wygasa za 5 minut")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Nie udało się zapisać")}>
        Error
      </Button>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast.success("Zapisano zmiany", {
          description: "Wszystkie zmiany w profilu zostały zsynchronizowane.",
        })
      }
    >
      Z opisem
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast("Plik usunięty", {
          description: "raport-q1-2026.pdf",
          action: { label: "Cofnij", onClick: () => alert("Cofnięto") },
        })
      }
    >
      Z akcją
    </Button>
  ),
};

export const Promise: Story = {
  render: () => (
    <Button
      onClick={() => {
        const fakeUpload = new Promise<{ name: string }>((resolve) =>
          setTimeout(() => resolve({ name: "raport.pdf" }), 1500),
        );
        toast.promise(fakeUpload, {
          loading: "Wysyłanie pliku…",
          success: (data) => `Wysłano ${data.name}`,
          error: "Błąd przesyłania",
        });
      }}
    >
      Toast z Promise
    </Button>
  ),
};

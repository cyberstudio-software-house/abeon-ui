import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToastAction } from "../../src/components/toast";
import { Toaster } from "../../src/components/toaster";
import { toast } from "../../src/components/use-toast";
import { Button } from "../../src/components/button";

const meta: Meta = {
  title: "Primitives/Toast",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast({
          title: "Zapisano zmiany",
          description: "Twoje ustawienia zostały zaktualizowane.",
        })
      }
    >
      Pokaż toast
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast({
          title: "Plik usunięty",
          description: "raport-q1-2026.pdf został przeniesiony do kosza.",
          action: (
            <ToastAction altText="Cofnij" onClick={() => alert("Cofnięto")}>
              Cofnij
            </ToastAction>
          ),
        })
      }
    >
      Toast z akcją
    </Button>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() =>
        toast({
          variant: "destructive",
          title: "Nie udało się zapisać",
          description: "Sprawdź połączenie i spróbuj ponownie.",
        })
      }
    >
      Toast destruktywny
    </Button>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast({ title: "Skopiowano do schowka" })}>
      Tylko tytuł
    </Button>
  ),
};

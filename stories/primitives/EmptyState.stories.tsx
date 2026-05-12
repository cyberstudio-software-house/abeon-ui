import type { Meta, StoryObj } from "@storybook/react";
import { Inbox, Search, FolderOpen, AlertCircle } from "lucide-react";
import { EmptyState } from "../../src/components/empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Primitives/EmptyState",
  component: EmptyState,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => (
    <div className="rounded-lg border w-[640px]">
      <EmptyState
        icon={Inbox}
        title="Skrzynka jest pusta"
        description="Nowe wiadomości pojawią się tutaj. Skonfiguruj reguły, aby filtrować nadawców."
        action={{ label: "Dodaj regułę", onClick: () => {} }}
      />
    </div>
  ),
};

export const NoSearchResults: Story = {
  render: () => (
    <div className="rounded-lg border w-[640px]">
      <EmptyState
        icon={Search}
        title="Brak wyników"
        description='Nie znaleziono nic dla zapytania "audyt 2024". Spróbuj zmienić kryteria.'
        secondaryAction={{ label: "Wyczyść filtry", onClick: () => {} }}
      />
    </div>
  ),
};

export const FirstTimeUse: Story = {
  render: () => (
    <div className="rounded-lg border w-[640px]">
      <EmptyState
        icon={FolderOpen}
        title="Brak projektów"
        description="Utwórz pierwszy projekt, aby zacząć śledzić zadania, terminy i budżet."
        action={{ label: "Utwórz projekt", onClick: () => {} }}
        secondaryAction={{ label: "Importuj z CSV", onClick: () => {} }}
      />
    </div>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <div className="rounded-lg border w-[640px]">
      <EmptyState
        icon={AlertCircle}
        title="Nie udało się wczytać"
        description="Sprawdź połączenie i spróbuj ponownie. Jeśli problem się powtarza, skontaktuj się z administratorem."
        action={{ label: "Spróbuj ponownie", onClick: () => {} }}
      />
    </div>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <div className="rounded-lg border w-[640px]">
      <EmptyState title="Brak danych do wyświetlenia" />
    </div>
  ),
};

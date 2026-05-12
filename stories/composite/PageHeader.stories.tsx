import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Download, Filter } from "lucide-react";
import { PageHeader } from "../../src/components/page-header";
import { Button } from "../../src/components/button";

const meta: Meta<typeof PageHeader> = {
  title: "Composite/PageHeader",
  component: PageHeader,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Projekty",
    description: "Lista wszystkich projektów w systemie",
  },
};

export const WithActions: Story = {
  args: {
    title: "Umowy",
    description: "Zarządzaj umowami i ich statusami",
    actions: (
      <>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Eksport
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Nowa umowa
        </Button>
      </>
    ),
  },
};

export const TitleOnly: Story = {
  args: { title: "Ustawienia" },
};

export const TitleAsH2: Story = {
  args: {
    title: "Sekcja na podstronie",
    titleAs: "h2",
    description: "Użyj titleAs gdy strona zawiera już h1.",
  },
};

export const ManyActions: Story = {
  args: {
    title: "Płatności",
    description: "Rejestr płatności i transakcji",
    actions: (
      <>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4" />
          Filtry
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Eksport
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Dodaj
        </Button>
      </>
    ),
  },
};

export const LongDescriptionWrap: Story = {
  args: {
    title: "Kontrahenci",
    description:
      "Pełna lista kontrahentów z możliwością filtrowania według statusu, grupy przychodów, terminowości płatności oraz innych parametrów. Dane synchronizowane co godzinę.",
    actions: (
      <Button size="sm">
        <Plus className="h-4 w-4" />
        Dodaj kontrahenta
      </Button>
    ),
  },
};

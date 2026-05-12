import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../src/components/tabs";

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="overview">Przegląd</TabsTrigger>
        <TabsTrigger value="activity">Aktywność</TabsTrigger>
        <TabsTrigger value="settings">Ustawienia</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="rounded-md border p-4 mt-2">
        <p className="text-sm">Statystyki, ostatnia aktywność, kluczowe metryki.</p>
      </TabsContent>
      <TabsContent value="activity" className="rounded-md border p-4 mt-2">
        <p className="text-sm">Historia wszystkich zdarzeń w projekcie.</p>
      </TabsContent>
      <TabsContent value="settings" className="rounded-md border p-4 mt-2">
        <p className="text-sm">Konfiguracja powiadomień, dostępu, integracji.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="t1" className="w-[640px]">
      <TabsList>
        <TabsTrigger value="t1">Klient</TabsTrigger>
        <TabsTrigger value="t2">Faktury</TabsTrigger>
        <TabsTrigger value="t3">Płatności</TabsTrigger>
        <TabsTrigger value="t4">Umowy</TabsTrigger>
        <TabsTrigger value="t5">Notatki</TabsTrigger>
      </TabsList>
      <TabsContent value="t1" className="rounded-md border p-4 mt-2 text-sm">
        Acme Sp. z o.o. — kontrahent strategiczny od 2018 r.
      </TabsContent>
      <TabsContent value="t2" className="rounded-md border p-4 mt-2 text-sm">
        12 faktur w bieżącym roku.
      </TabsContent>
      <TabsContent value="t3" className="rounded-md border p-4 mt-2 text-sm">
        Saldo dodatnie 24 800 PLN.
      </TabsContent>
      <TabsContent value="t4" className="rounded-md border p-4 mt-2 text-sm">
        Umowa ramowa do 2027-12-31.
      </TabsContent>
      <TabsContent value="t5" className="rounded-md border p-4 mt-2 text-sm">
        Brak notatek wewnętrznych.
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="a" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="a">Dostępna</TabsTrigger>
        <TabsTrigger value="b" disabled>Wymaga uprawnień</TabsTrigger>
        <TabsTrigger value="c">Inna</TabsTrigger>
      </TabsList>
      <TabsContent value="a" className="rounded-md border p-4 mt-2 text-sm">
        Zawartość zakładki A.
      </TabsContent>
      <TabsContent value="c" className="rounded-md border p-4 mt-2 text-sm">
        Zawartość zakładki C.
      </TabsContent>
    </Tabs>
  ),
};

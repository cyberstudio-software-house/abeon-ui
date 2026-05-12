import type { Meta, StoryObj } from "@storybook/react";
import { DataList, DataListRow } from "../../src/components/data-list";
import { Badge, StatusBadge } from "../../src/components/badge";
import { Button } from "../../src/components/button";

const meta: Meta = {
  title: "Primitives/DataList",
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ maxWidth: 480 }}>{children}</div>
);

export const Stacked: Story = {
  render: () => (
    <Frame>
      <DataList>
        <DataListRow label="Nazwa">Projekt Nimbus</DataListRow>
        <DataListRow label="Status">
          <StatusBadge status="active" />
        </DataListRow>
        <DataListRow label="Klient">Acme Sp. z o.o.</DataListRow>
        <DataListRow label="Utworzono">2025-12-04 14:32</DataListRow>
        <DataListRow label="Opis">
          Środowisko produkcyjne z replikacją multi-region. Aktualizowane co 24h.
        </DataListRow>
      </DataList>
    </Frame>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Frame>
      <DataList>
        <DataListRow label="Numer faktury" orientation="horizontal">
          FV/2026/04/0042
        </DataListRow>
        <DataListRow label="Kwota netto" orientation="horizontal">
          12 450,00 PLN
        </DataListRow>
        <DataListRow label="VAT (23%)" orientation="horizontal">
          2 863,50 PLN
        </DataListRow>
        <DataListRow label="Termin płatności" orientation="horizontal">
          2026-05-15
        </DataListRow>
        <DataListRow label="Status" orientation="horizontal">
          <Badge variant="warning">Oczekuje</Badge>
        </DataListRow>
      </DataList>
    </Frame>
  ),
};

export const MixedValues: Story = {
  render: () => (
    <Frame>
      <DataList>
        <DataListRow label="Plan">
          <div className="flex items-center gap-2">
            <Badge>Pro</Badge>
            <span className="text-foreground-muted">do 2026-12-31</span>
          </div>
        </DataListRow>
        <DataListRow label="Wykorzystanie CPU">
          <div className="flex items-center gap-2">
            <span className="font-medium">62%</span>
            <span className="text-xs text-foreground-muted">2.5 / 4 vCPU</span>
          </div>
        </DataListRow>
        <DataListRow label="Akcje">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Zmień plan
            </Button>
            <Button size="sm" variant="outline">
              Rozszerz
            </Button>
          </div>
        </DataListRow>
      </DataList>
    </Frame>
  ),
};

export const DenseList: Story = {
  render: () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({
      label: `Pole ${i + 1}`,
      value: `Wartość ${i + 1}`,
    }));
    return (
      <Frame>
        <DataList>
          {rows.map((row) => (
            <DataListRow key={row.label} label={row.label} orientation="horizontal">
              {row.value}
            </DataListRow>
          ))}
        </DataList>
      </Frame>
    );
  },
};

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Building2,
  BarChart3,
  CreditCard,
  FileText,
  Receipt,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  DetailPanel,
  DetailHeader,
  DetailBody,
  DetailSection,
  DetailMetricGrid,
  DetailMetric,
  DetailKeyValue,
} from "../../src/components/detail-panel";
import { Badge } from "../../src/components/badge";
import { Button } from "../../src/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../src/components/tabs";

const meta: Meta = {
  title: "Composite/DetailPanel",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

function PageScaffold({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen bg-muted/30">
      <div
        className="border-b border-border bg-background px-4 py-3"
        style={{ height: 56 }}
      >
        <p className="text-sm text-foreground-muted">Topbar (56px)</p>
      </div>
      <div className="p-6">
        <p className="text-sm text-foreground-muted">
          Tło aplikacji — panel pojawia się po prawej.
        </p>
      </div>
      {children}
    </div>
  );
}

export const Minimal: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <PageScaffold>
        {!open && (
          <Button onClick={() => setOpen(true)}>Otwórz panel</Button>
        )}
        <DetailPanel open={open} onClose={() => setOpen(false)}>
          <DetailHeader
            title="Acme Sp. z o.o."
            subtitle="NIP 1234567890"
            onClose={() => setOpen(false)}
          />
          <DetailBody>
            <DetailSection>
              <DetailKeyValue label="NIP" value="1234567890" />
              <DetailKeyValue label="Adres" value="ul. Marszałkowska 100, Warszawa" />
              <DetailKeyValue label="Email" value="kontakt@acme.pl" />
            </DetailSection>
          </DetailBody>
        </DetailPanel>
      </PageScaffold>
    );
  },
};

export const FullContractor: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <PageScaffold>
        {!open && <Button onClick={() => setOpen(true)}>Otwórz panel</Button>}
        <DetailPanel open={open} onClose={() => setOpen(false)}>
          <DetailHeader
            icon={<Building2 />}
            title="Acme Sp. z o.o."
            subtitle="NIP 1234567890"
            onClose={() => setOpen(false)}
            badges={
              <>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                >
                  Segment A
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  W terminie
                </Badge>
              </>
            }
          />
          <DetailBody>
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">
                  Przegląd
                </TabsTrigger>
                <TabsTrigger value="invoices" className="flex-1">
                  Faktury
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex-1">
                  Płatności
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <DetailSection icon={<BarChart3 />} title="Przychody">
                  <DetailMetricGrid columns={2}>
                    <DetailMetric
                      label="Przychód 12m"
                      value="1 245 000 PLN"
                      trend={{ direction: "up", value: "+12% vs poprzedni okres" }}
                    />
                    <DetailMetric label="Śr. miesięcznie" value="103 750 PLN" />
                  </DetailMetricGrid>
                </DetailSection>

                <DetailSection icon={<CreditCard />} title="Zdrowie płatnicze">
                  <DetailMetricGrid columns={3}>
                    <DetailMetric
                      label="Śr. czas"
                      value="32d"
                      hint="termin: 30d"
                      tone="danger"
                    />
                    <DetailMetric
                      label="Zaległości"
                      value="—"
                      hint="0 faktur"
                    />
                    <DetailMetric label="Opłacone" value="48" hint="z 50 total" />
                  </DetailMetricGrid>
                </DetailSection>

                <DetailSection title="Szybkie akcje">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      Wszystkie faktury
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Receipt className="h-3.5 w-3.5" />
                      Nowy dokument
                    </Button>
                  </div>
                </DetailSection>
              </TabsContent>

              <TabsContent value="invoices" className="mt-4">
                <DetailSection title="Ostatnie faktury">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <DetailKeyValue
                      key={i}
                      label={
                        <span className="font-mono">FV/2026/02/{String(i).padStart(3, "0")}</span>
                      }
                      value={
                        <span className="flex items-center gap-2">
                          <span>{(15000 + i * 1200).toLocaleString("pl-PL")} PLN</span>
                          {i % 2 === 0 ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                              <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                              Opłacona
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-[10px]">
                              <Clock className="h-2.5 w-2.5 mr-0.5" />
                              Oczekuje
                            </Badge>
                          )}
                        </span>
                      }
                    />
                  ))}
                </DetailSection>
              </TabsContent>

              <TabsContent value="payments" className="mt-4">
                <DetailSection title="Historia płatności">
                  <p className="text-sm text-foreground-muted">
                    Tu może być wykres lub lista płatności.
                  </p>
                </DetailSection>
              </TabsContent>
            </Tabs>
          </DetailBody>
        </DetailPanel>
      </PageScaffold>
    );
  },
};

export const StackedKeyValues: Story = {
  render: () => (
    <PageScaffold>
      <DetailPanel>
        <DetailHeader title="Domena example.com" subtitle="Aktywna" />
        <DetailBody>
          <DetailSection title="Informacje techniczne">
            <DetailMetricGrid columns={2}>
              <DetailKeyValue layout="stacked" label="Serwer" value="ns1.cloud.pl" />
              <DetailKeyValue layout="stacked" label="Wygasa" value="2027-03-15" />
              <DetailKeyValue layout="stacked" label="DNSSEC" value="Włączony" />
              <DetailKeyValue layout="stacked" label="Auto-przedłużenie" value="Tak" />
            </DetailMetricGrid>
          </DetailSection>
        </DetailBody>
      </DetailPanel>
    </PageScaffold>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { Info, CheckCircle2, AlertTriangle, AlertOctagon, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../src/components/alert";

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Alert>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ maxWidth: 560 }}>{children}</div>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Informacja</AlertTitle>
        <AlertDescription>Domyślny wariant — neutralna treść informacyjna.</AlertDescription>
      </Alert>
    </Frame>
  ),
};

export const Info_: Story = {
  name: "Info",
  render: () => (
    <Frame>
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Nowa wersja dostępna</AlertTitle>
        <AlertDescription>Sprawdź notatki o wydaniu, aby zobaczyć co się zmieniło.</AlertDescription>
      </Alert>
    </Frame>
  ),
};

export const Success: Story = {
  render: () => (
    <Frame>
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Zapisano zmiany</AlertTitle>
        <AlertDescription>Twoje ustawienia zostały zaktualizowane.</AlertDescription>
      </Alert>
    </Frame>
  ),
};

export const Warning: Story = {
  render: () => (
    <Frame>
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Sesja wkrótce wygaśnie</AlertTitle>
        <AlertDescription>Pozostało 2 minuty do wylogowania. Zapisz pracę.</AlertDescription>
      </Alert>
    </Frame>
  ),
};

export const Danger: Story = {
  render: () => (
    <Frame>
      <Alert variant="danger">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Nie udało się zapisać</AlertTitle>
        <AlertDescription>Spróbuj ponownie lub skontaktuj się z administratorem.</AlertDescription>
      </Alert>
    </Frame>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Frame>
      <Alert variant="destructive">
        <AlertOctagon className="h-4 w-4" />
        <AlertTitle>Operacja nieodwracalna</AlertTitle>
        <AlertDescription>
          Wariant zachowany dla zgodności z shadcn — w nowym kodzie używaj <code>danger</code>.
        </AlertDescription>
      </Alert>
    </Frame>
  ),
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-col gap-3" style={{ maxWidth: 560 }}>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>default</AlertTitle>
        <AlertDescription>Neutral information.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>info</AlertTitle>
        <AlertDescription>Use for low-stakes notices and tips.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>success</AlertTitle>
        <AlertDescription>Confirmation that an action completed.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>warning</AlertTitle>
        <AlertDescription>Heads-up about a non-blocking issue.</AlertDescription>
      </Alert>
      <Alert variant="danger">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>danger</AlertTitle>
        <AlertDescription>Errors and destructive outcomes.</AlertDescription>
      </Alert>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/components/card";
import { Button } from "../../src/components/button";
import { Input } from "../../src/components/input";
import { Label } from "../../src/components/label";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Witaj z powrotem</CardTitle>
        <CardDescription>Zobacz, co wydarzyło się od ostatniej wizyty.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground-muted">
          3 nowe powiadomienia, 2 oczekujące zadania.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Plan Pro</CardTitle>
        <CardDescription>299 PLN miesięcznie</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground-muted">Projekty</span>
          <span>bez limitu</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-muted">Użytkownicy</span>
          <span>do 50</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-muted">Wsparcie</span>
          <span>priorytetowe</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Wybierz plan</Button>
      </CardFooter>
    </Card>
  ),
};

export const FormCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Utwórz konto</CardTitle>
        <CardDescription>Zacznij za darmo, bez karty kredytowej.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Adres e-mail</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pwd">Hasło</Label>
          <Input id="pwd" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Anuluj</Button>
        <Button>Załóż konto</Button>
      </CardFooter>
    </Card>
  ),
};

export const NoHeader: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="p-6">
        <p className="text-sm">
          Karta bez <code>CardHeader</code> — przydatna do prostych pojemników z paddingiem
          i ramką.
        </p>
      </CardContent>
    </Card>
  ),
};

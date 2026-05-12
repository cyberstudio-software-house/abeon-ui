import type { Meta, StoryObj } from "@storybook/react";
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { StatCard, StatCardGrid } from "../../src/components/card";

const meta: Meta<typeof StatCard> = {
  title: "Primitives/StatCard",
  component: StatCard,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    label: "Aktywne projekty",
    value: 47,
  },
};

export const WithChangeUp: Story = {
  args: {
    label: "Przychody (mies.)",
    value: "124 500 PLN",
    change: { value: 12, label: "vs poprzedni miesiąc" },
    icon: <DollarSign className="h-4 w-4" />,
  },
};

export const WithChangeDown: Story = {
  args: {
    label: "Konwersja",
    value: "3.2%",
    change: { value: -8, label: "vs poprzedni miesiąc" },
    icon: <TrendingUp className="h-4 w-4" />,
  },
};

export const FlatChange: Story = {
  args: {
    label: "Aktywni użytkownicy",
    value: 1248,
    change: { value: 0, label: "bez zmian" },
    icon: <Users className="h-4 w-4" />,
  },
};

export const Grid: Story = {
  render: () => (
    <StatCardGrid>
      <StatCard
        label="Przychody"
        value="124 500 PLN"
        change={{ value: 12, label: "vs poprzedni miesiąc" }}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <StatCard
        label="Zamówienia"
        value={342}
        change={{ value: 5, label: "vs poprzedni miesiąc" }}
        icon={<ShoppingCart className="h-4 w-4" />}
      />
      <StatCard
        label="Aktywni klienci"
        value={1248}
        change={{ value: -2, label: "vs poprzedni miesiąc" }}
        icon={<Users className="h-4 w-4" />}
      />
      <StatCard
        label="Konwersja"
        value="3.2%"
        change={{ value: 0, label: "bez zmian" }}
        icon={<TrendingUp className="h-4 w-4" />}
      />
    </StatCardGrid>
  ),
};

export const ThreeColumnGrid: Story = {
  render: () => (
    <StatCardGrid columns={3}>
      <StatCard label="A" value="1" />
      <StatCard label="B" value="2" />
      <StatCard label="C" value="3" />
    </StatCardGrid>
  ),
};

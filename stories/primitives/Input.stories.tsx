import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Mail, Lock, Search } from "lucide-react";
import { Input, SearchInput } from "../../src/components/input";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Wpisz tekst..." } };
export const WithValue: Story = { args: { defaultValue: "jan@example.com", type: "email" } };
export const Disabled: Story = { args: { placeholder: "Niedostępne", disabled: true } };
export const Errored: Story = {
  args: { defaultValue: "invalid", error: true, placeholder: "E-mail" },
};

export const WithLeadingIcon: Story = {
  args: {
    placeholder: "you@example.com",
    type: "email",
    leadingIcon: <Mail />,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    placeholder: "Hasło",
    type: "password",
    trailingIcon: <Lock />,
  },
};

export const WithLeadingAndTrailing: Story = {
  args: {
    placeholder: "Szukaj…",
    leadingIcon: <Search />,
    trailingIcon: <Lock />,
  },
};

export const WithClearButton: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("Wartość do wyczyszczenia");
    return (
      <Input
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        placeholder="Wpisz coś, potem wyczyść"
      />
    );
  },
};

export const SearchPreset: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <SearchInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        placeholder="Szukaj projektów…"
      />
    );
  },
};

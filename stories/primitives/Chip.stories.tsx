import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Chip, ChipsContainer } from "../../src/components/chip";

const meta: Meta<typeof Chip> = {
  title: "Primitives/Chip",
  component: Chip,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip>Default</Chip>
      <Chip variant="primary">Primary</Chip>
    </div>
  ),
};

export const Removable: Story = {
  render: () => (
    <div className="flex gap-2">
      <Chip onRemove={() => alert("Usunięto")}>Z możliwością usunięcia</Chip>
      <Chip variant="primary" onRemove={() => alert("Usunięto")}>Primary z X</Chip>
    </div>
  ),
};

export const FilterRow: Story = {
  render: () => {
    const [filters, setFilters] = React.useState([
      "Status: Aktywny",
      "Klient: Acme",
      "Okres: Q1 2026",
      "Tag: Pilne",
    ]);
    const remove = (idx: number) => setFilters(filters.filter((_, i) => i !== idx));
    return (
      <div className="w-[480px]">
        <ChipsContainer onClearAll={() => setFilters([])}>
          {filters.map((f, i) => (
            <Chip key={f} variant="primary" onRemove={() => remove(i)}>
              {f}
            </Chip>
          ))}
        </ChipsContainer>
      </div>
    );
  },
};

export const TagCloud: Story = {
  render: () => (
    <div className="w-[480px]">
      <ChipsContainer>
        {[
          "react", "typescript", "tailwind", "radix", "storybook",
          "design-system", "frontend", "open-source",
        ].map((tag) => (
          <Chip key={tag}>#{tag}</Chip>
        ))}
      </ChipsContainer>
    </div>
  ),
};

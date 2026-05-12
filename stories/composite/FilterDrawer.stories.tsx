import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FilterDrawer,
  type FilterField,
  type FilterValues,
} from "../../src/components/filter-drawer";
import { Button } from "../../src/components/button";
import { Filter } from "lucide-react";

const fields: FilterField[] = [
  { id: "search", label: "Wyszukiwanie", type: "text", placeholder: "Nazwa, NIP, email…" },
  {
    id: "status",
    label: "Status",
    type: "select",
    placeholder: "Wszystkie",
    options: [
      { value: "active", label: "Aktywny" },
      { value: "pending", label: "Oczekujący" },
      { value: "completed", label: "Zakończony" },
      { value: "draft", label: "Szkic" },
    ],
  },
  {
    id: "owner",
    label: "Właściciel",
    type: "select",
    options: [
      { value: "anna", label: "Anna K." },
      { value: "tomek", label: "Tomek W." },
      { value: "maria", label: "Maria N." },
    ],
  },
  { id: "due_after", label: "Termin po", type: "date" },
  { id: "archived", label: "Archiwum", type: "checkbox", placeholder: "Pokaż również zarchiwizowane" },
];

const meta: Meta<typeof FilterDrawer> = {
  title: "Composite/FilterDrawer",
  component: FilterDrawer,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof FilterDrawer>;

export const Default: Story = {
  render: () => {
    const [values, setValues] = React.useState<FilterValues>({});
    const [applied, setApplied] = React.useState<FilterValues>({});
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FilterDrawer
            fields={fields}
            values={values}
            onChange={setValues}
            onApply={() => setApplied(values)}
            onReset={() => setValues({})}
          />
          <span className="text-sm text-foreground-muted">
            Otwórz panel i ustaw filtry
          </span>
        </div>
        <pre className="rounded-md border border-border bg-muted/40 p-3 text-xs">
          {JSON.stringify(applied, null, 2)}
        </pre>
      </div>
    );
  },
};

export const PreFilled: Story = {
  render: () => {
    const [values, setValues] = React.useState<FilterValues>({
      search: "Acme",
      status: "active",
      archived: true,
    });
    return (
      <FilterDrawer
        fields={fields}
        values={values}
        onChange={setValues}
        onApply={() => undefined}
        onReset={() => setValues({})}
      />
    );
  },
};

export const CustomTrigger: Story = {
  render: () => {
    const [values, setValues] = React.useState<FilterValues>({ status: "pending" });
    return (
      <FilterDrawer
        fields={fields}
        values={values}
        onChange={setValues}
        onApply={() => undefined}
        onReset={() => setValues({})}
        trigger={
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Zaawansowane filtry
          </Button>
        }
      />
    );
  },
};

export const PolishLabels: Story = {
  render: () => {
    const [values, setValues] = React.useState<FilterValues>({});
    return (
      <FilterDrawer
        fields={fields}
        values={values}
        onChange={setValues}
        onApply={() => undefined}
        onReset={() => setValues({})}
        labels={{
          triggerLabel: "Filtry",
          title: "Filtry",
          description: "Ustaw filtry, aby zawęzić wyniki wyszukiwania.",
          selectPlaceholder: "Wybierz…",
          resetButton: "Wyczyść",
          applyButton: "Zastosuj filtry",
        }}
      />
    );
  },
};

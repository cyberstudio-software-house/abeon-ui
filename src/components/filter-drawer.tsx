import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Checkbox } from "./checkbox";
import { Filter } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

export type FilterFieldType = "text" | "select" | "checkbox" | "date";

export interface FilterField {
  id: string;
  label: string;
  type: FilterFieldType;
  options?: FilterOption[];
  placeholder?: string;
}

export type FilterValues = Record<string, string | boolean | undefined>;

export interface FilterDrawerLabels {
  triggerLabel?: string;
  title?: string;
  description?: string;
  selectPlaceholder?: string;
  resetButton?: string;
  applyButton?: string;
}

const defaultLabels: Required<FilterDrawerLabels> = {
  triggerLabel: "Filters",
  title: "Filters",
  description: "Set filters to narrow down the results.",
  selectPlaceholder: "Select…",
  resetButton: "Reset",
  applyButton: "Apply filters",
};

export interface FilterDrawerProps {
  fields: FilterField[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onApply: () => void;
  onReset: () => void;
  trigger?: React.ReactNode;
  labels?: FilterDrawerLabels;
}

function countActiveFilters(values: FilterValues): number {
  return Object.values(values).filter(
    (v) => v !== "" && v !== null && v !== undefined && v !== false
  ).length;
}

export function FilterDrawer({
  fields,
  values,
  onChange,
  onApply,
  onReset,
  trigger,
  labels,
}: FilterDrawerProps) {
  const t = { ...defaultLabels, ...labels };
  const [open, setOpen] = React.useState(false);

  const handleFieldChange = (fieldId: string, value: string | boolean) => {
    onChange({ ...values, [fieldId]: value });
  };

  const handleApply = () => {
    onApply();
    setOpen(false);
  };

  const activeFiltersCount = countActiveFilters(values);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" />
            {t.triggerLabel}
            {activeFiltersCount > 0 && (
              <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{t.title}</SheetTitle>
          <SheetDescription>{t.description}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              {field.type === "text" && (
                <Input
                  id={field.id}
                  value={(values[field.id] as string) || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
              {field.type === "select" && (
                <Select
                  value={(values[field.id] as string) || ""}
                  onValueChange={(value) => handleFieldChange(field.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={field.placeholder || t.selectPlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === "checkbox" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={Boolean(values[field.id])}
                    onCheckedChange={(checked) =>
                      handleFieldChange(field.id, Boolean(checked))
                    }
                  />
                  <label
                    htmlFor={field.id}
                    className="text-sm text-foreground-secondary"
                  >
                    {field.placeholder}
                  </label>
                </div>
              )}
              {field.type === "date" && (
                <Input
                  id={field.id}
                  type="date"
                  value={(values[field.id] as string) || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <SheetFooter className="gap-2">
          <Button variant="secondary" onClick={onReset}>
            {t.resetButton}
          </Button>
          <Button onClick={handleApply}>{t.applyButton}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

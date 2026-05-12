import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "../lib/utils";
import { Badge } from "./badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  maxDisplay?: number;
  className?: string;
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Wybierz...",
      searchPlaceholder = "Szukaj...",
      emptyText = "Brak wyników.",
      disabled,
      maxDisplay = 3,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const toggle = (optionValue: string) => {
      if (value.includes(optionValue)) {
        onChange(value.filter((v) => v !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    };

    const remove = (optionValue: string, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onChange(value.filter((v) => v !== optionValue));
    };

    const selected = value
      .map((v) => options.find((o) => o.value === v))
      .filter((o): o is MultiSelectOption => Boolean(o));
    const visible = selected.slice(0, maxDisplay);
    const overflow = selected.length - visible.length;

    return (
      <Popover open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            role="combobox"
            aria-expanded={open}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              "flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              disabled && "cursor-not-allowed opacity-50",
              className,
            )}
            onKeyDown={(event) => {
              if (disabled) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOpen((prev) => !prev);
              }
            }}
          >
            <div className="flex flex-1 flex-wrap items-center gap-1">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <>
                  {visible.map((option) => (
                    <Badge key={option.value} variant="secondary" className="gap-1 pr-1">
                      {option.label}
                      <span
                        role="button"
                        aria-label={`Usuń ${option.label}`}
                        tabIndex={-1}
                        className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-sm hover:bg-muted"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={(event) => remove(option.value, event)}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  ))}
                  {overflow > 0 && (
                    <Badge variant="secondary">+{overflow}</Badge>
                  )}
                </>
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() => toggle(option.value)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
MultiSelect.displayName = "MultiSelect";

export { MultiSelect };

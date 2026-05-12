import * as React from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { TimePicker } from "./time-picker";

export interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
  fromDate?: Date;
  toDate?: Date;
  step?: number;
}

const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Wybierz datę i godzinę",
      disabled,
      className,
      align = "start",
      fromDate,
      toDate,
      step,
    },
    ref,
  ) => {
    const timeString = value ? format(value, "HH:mm") : "";

    const handleDateSelect = (date: Date | undefined) => {
      if (!date) {
        onChange?.(undefined);
        return;
      }
      const next = new Date(date);
      if (value) {
        next.setHours(value.getHours(), value.getMinutes(), value.getSeconds(), 0);
      } else {
        next.setHours(0, 0, 0, 0);
      }
      onChange?.(next);
    };

    const handleTimeChange = (time: string) => {
      if (!time) return;
      const [h, m] = time.split(":").map(Number);
      const base = value ?? new Date();
      const next = new Date(base);
      next.setHours(h, m, 0, 0);
      onChange?.(next);
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP HH:mm", { locale: pl }) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            fromDate={fromDate}
            toDate={toDate}
            initialFocus
          />
          <div className="border-t border-border p-3">
            <TimePicker
              value={timeString}
              onChange={handleTimeChange}
              step={step}
              disabled={!value}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker };

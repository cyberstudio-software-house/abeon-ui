import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export interface PaginationBarProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  pageSizeLabel?: string;
  totalLabel?: (total: number) => React.ReactNode;
  pageOfPagesLabel?: (page: number, totalPages: number) => React.ReactNode;
}

const defaultPageSizeOptions = [10, 25, 50, 100];

const PaginationBar = React.forwardRef<HTMLDivElement, PaginationBarProps>(
  (
    {
      page,
      pageSize,
      total,
      onPageChange,
      onPageSizeChange,
      pageSizeOptions = defaultPageSizeOptions,
      pageSizeLabel = "Rows per page",
      totalLabel = (n) => `of ${n}`,
      pageOfPagesLabel = (p, tp) => `Page ${p} of ${tp}`,
      className,
      ...props
    },
    ref,
  ) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const isFirstPage = page <= 1;
    const isLastPage = page >= totalPages;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-4 py-2 text-sm text-foreground-muted",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <span>{pageSizeLabel}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              onPageSizeChange(Number(v));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>{totalLabel(total)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">{pageOfPagesLabel(page, totalPages)}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={isFirstPage}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isLastPage}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  },
);
PaginationBar.displayName = "PaginationBar";

export { PaginationBar };

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Checkbox } from "./checkbox";
import { IconButton } from "./icon-button";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "../lib/utils";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns3,
} from "lucide-react";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterAccessor?: (row: T) => string;
  width?: string;
}

export interface DataTableRowAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "danger";
}

export type DataTableDensity = "compact" | "normal" | "comfortable";

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface DataTableLabels {
  selectedCount?: (count: number) => string;
  columnsTooltip?: string;
  densityCompact?: string;
  densityNormal?: string;
  densityComfortable?: string;
  actionsHeader?: string;
  emptyState?: string;
  pageSizeLabel?: string;
  pageSizeSeparator?: string;
  prevPageTooltip?: string;
  nextPageTooltip?: string;
  selectAllLabel?: string;
  selectRowLabel?: (id: string | number) => string;
  filterPlaceholder?: string;
}

const defaultLabels: Required<DataTableLabels> = {
  selectedCount: (n) => `Selected: ${n}`,
  columnsTooltip: "Columns",
  densityCompact: "Compact",
  densityNormal: "Normal",
  densityComfortable: "Comfortable",
  actionsHeader: "Actions",
  emptyState: "No data to display",
  pageSizeLabel: "Show:",
  pageSizeSeparator: "of",
  prevPageTooltip: "Previous page",
  nextPageTooltip: "Next page",
  selectAllLabel: "Select all",
  selectRowLabel: (id) => `Select row ${id}`,
  filterPlaceholder: "filter…",
};

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  rowActions?: DataTableRowAction<T>[];
  quickAction?: {
    icon: React.ReactNode;
    label: string;
    onClick: (row: T) => void;
  };
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  bulkActions?: React.ReactNode;
  pagination?: DataTablePagination;
  pageSizeOptions?: number[];
  density?: DataTableDensity;
  onDensityChange?: (density: DataTableDensity) => void;
  sortable?: boolean;
  showFilterRow?: boolean;
  onFilterChange?: (filters: Record<string, string>) => void;
  emptyState?: React.ReactNode;
  labels?: DataTableLabels;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  rowActions,
  quickAction,
  selectable = false,
  onSelectionChange,
  bulkActions,
  pagination,
  pageSizeOptions = [10, 25, 50, 100],
  density = "normal",
  onDensityChange,
  sortable = true,
  showFilterRow = false,
  onFilterChange,
  emptyState,
  labels,
}: DataTableProps<T>) {
  const t = { ...defaultLabels, ...labels };

  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(new Set());
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(columns.map((c) => c.id))
  );
  const [filters, setFilters] = React.useState<Record<string, string>>({});

  const displayData = React.useMemo(() => {
    if (!showFilterRow) return data;
    const activeFilters = Object.entries(filters).filter(
      ([, value]) => value.trim() !== "",
    );
    if (activeFilters.length === 0) return data;
    return data.filter((row) =>
      activeFilters.every(([columnId, raw]) => {
        const column = columns.find((c) => c.id === columnId);
        if (!column?.filterable) return true;
        const cellText = column.filterAccessor
          ? column.filterAccessor(row)
          : column.accessorKey
          ? String(row[column.accessorKey] ?? "")
          : "";
        return cellText.toLowerCase().includes(raw.trim().toLowerCase());
      }),
    );
  }, [data, columns, filters, showFilterRow]);

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [columnId]: value };
      onFilterChange?.(next);
      return next;
    });
  };

  const densityClasses: Record<DataTableDensity, string> = {
    compact: "h-8 text-xs",
    normal: "h-10 text-sm",
    comfortable: "h-12 text-sm",
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(displayData.map((row) => row.id));
      setSelectedRows(allIds);
      onSelectionChange?.(displayData);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedRows(newSelection);
    onSelectionChange?.(data.filter((row) => newSelection.has(row.id)));
  };

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-foreground-muted" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  };

  const filteredColumns = columns.filter((col) => visibleColumns.has(col.id));
  const allSelected = displayData.length > 0 && selectedRows.size === displayData.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < displayData.length;
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  return (
    <div className="space-y-4">
      {(selectedRows.size > 0 || onDensityChange) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && (
              <>
                <span className="text-sm text-foreground-muted">
                  {t.selectedCount(selectedRows.size)}
                </span>
                {bulkActions}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton variant="ghost" tooltip={t.columnsTooltip}>
                  <Columns3 className="h-4 w-4" />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {columns.map((column) => (
                  <DropdownMenuItem
                    key={column.id}
                    onClick={(e) => {
                      e.preventDefault();
                      const newVisible = new Set(visibleColumns);
                      if (newVisible.has(column.id)) {
                        newVisible.delete(column.id);
                      } else {
                        newVisible.add(column.id);
                      }
                      setVisibleColumns(newVisible);
                    }}
                  >
                    <Checkbox
                      checked={visibleColumns.has(column.id)}
                      className="mr-2"
                    />
                    {column.header}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {onDensityChange && (
              <Select
                value={density}
                onValueChange={(v) => onDensityChange(v as DataTableDensity)}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">{t.densityCompact}</SelectItem>
                  <SelectItem value="normal">{t.densityNormal}</SelectItem>
                  <SelectItem value="comfortable">{t.densityComfortable}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label={t.selectAllLabel}
                    className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                  />
                </TableHead>
              )}
              {filteredColumns.map((column) => (
                <TableHead
                  key={column.id}
                  style={{ width: column.width }}
                  className={cn(
                    densityClasses[density],
                    column.sortable !== false && sortable && "cursor-pointer select-none"
                  )}
                  onClick={() =>
                    column.sortable !== false && sortable && handleSort(column.id)
                  }
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable !== false && sortable && getSortIcon(column.id)}
                  </div>
                </TableHead>
              ))}
              {(rowActions || quickAction) && (
                <TableHead className="w-20 text-right">{t.actionsHeader}</TableHead>
              )}
            </TableRow>
            {showFilterRow && (
              <TableRow className="hover:bg-transparent">
                {selectable && <TableHead className="w-12" />}
                {filteredColumns.map((column) => (
                  <TableHead key={`filter-${column.id}`} className="py-2">
                    {column.filterable ? (
                      <input
                        type="text"
                        value={filters[column.id] ?? ""}
                        onChange={(e) => handleFilterChange(column.id, e.target.value)}
                        placeholder={t.filterPlaceholder}
                        className="h-7 w-full rounded-full border border-input bg-background px-3 text-xs font-normal text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                      />
                    ) : null}
                  </TableHead>
                ))}
                {(rowActions || quickAction) && <TableHead className="w-20" />}
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    filteredColumns.length +
                    (selectable ? 1 : 0) +
                    (rowActions || quickAction ? 1 : 0)
                  }
                  className="h-32 text-center"
                >
                  {emptyState || (
                    <p className="text-foreground-muted">{t.emptyState}</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(selectedRows.has(row.id) && "bg-primary-muted/30")}
                >
                  {selectable && (
                    <TableCell className={densityClasses[density]}>
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)}
                        aria-label={t.selectRowLabel(row.id)}
                      />
                    </TableCell>
                  )}
                  {filteredColumns.map((column) => (
                    <TableCell key={column.id} className={densityClasses[density]}>
                      {column.cell
                        ? column.cell(row)
                        : column.accessorKey
                        ? String(row[column.accessorKey] ?? "")
                        : ""}
                    </TableCell>
                  ))}
                  {(rowActions || quickAction) && (
                    <TableCell className={cn(densityClasses[density], "text-right")}>
                      <div className="flex items-center justify-end gap-1">
                        {quickAction && (
                          <IconButton
                            variant="ghost"
                            size="sm"
                            tooltip={quickAction.label}
                            onClick={() => quickAction.onClick(row)}
                          >
                            {quickAction.icon}
                          </IconButton>
                        )}
                        {rowActions && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <IconButton variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </IconButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {rowActions.map((action, index) => (
                                <React.Fragment key={index}>
                                  {action.variant === "danger" && index > 0 && (
                                    <DropdownMenuSeparator />
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => action.onClick(row)}
                                    className={cn(
                                      action.variant === "danger" &&
                                        "text-danger focus:text-danger"
                                    )}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </DropdownMenuItem>
                                </React.Fragment>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <span>{t.pageSizeLabel}</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(v) => pagination.onPageSizeChange(Number(v))}
            >
              <SelectTrigger className="w-20 h-8">
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
            <span>
              {t.pageSizeSeparator} {pagination.total}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              variant="ghost"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              tooltip={t.prevPageTooltip}
            >
              <ChevronLeft className="h-4 w-4" />
            </IconButton>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, pagination.page - 3),
                  Math.min(totalPages, pagination.page + 2)
                )
                .map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.page ? "default" : "ghost"}
                    size="icon-sm"
                    onClick={() => pagination.onPageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
            </div>
            <IconButton
              variant="ghost"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              tooltip={t.nextPageTooltip}
            >
              <ChevronRight className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
}

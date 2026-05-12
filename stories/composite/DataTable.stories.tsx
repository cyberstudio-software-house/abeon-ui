import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Eye, Edit, Trash2, Copy, Mail, Archive } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
  type DataTableDensity,
  type DataTableRowAction,
} from "../../src/components/data-table";
import { StatusBadge } from "../../src/components/badge";
import { Button } from "../../src/components/button";

interface Project {
  id: string;
  name: string;
  owner: string;
  status: "active" | "pending" | "completed" | "draft";
  budget: string;
  due: string;
}

const projects: Project[] = [
  { id: "PRJ-001", name: "Migracja CRM", owner: "Anna K.", status: "active", budget: "124 500 PLN", due: "2026-06-30" },
  { id: "PRJ-002", name: "Rebranding", owner: "Tomek W.", status: "pending", budget: "48 000 PLN", due: "2026-07-15" },
  { id: "PRJ-003", name: "Audyt bezpieczeństwa", owner: "Maria N.", status: "completed", budget: "32 800 PLN", due: "2026-04-12" },
  { id: "PRJ-004", name: "Aplikacja mobilna v2", owner: "Piotr M.", status: "draft", budget: "210 000 PLN", due: "2026-09-01" },
  { id: "PRJ-005", name: "Migracja serwerów", owner: "Anna K.", status: "active", budget: "78 000 PLN", due: "2026-08-22" },
  { id: "PRJ-006", name: "Wdrożenie Helpdesk", owner: "Tomek W.", status: "completed", budget: "56 200 PLN", due: "2026-03-05" },
];

const columns: DataTableColumn<Project>[] = [
  {
    id: "id",
    header: "ID",
    accessorKey: "id",
    width: "120px",
    cell: (row) => <span className="font-mono text-xs">{row.id}</span>,
  },
  {
    id: "name",
    header: "Nazwa",
    accessorKey: "name",
    cell: (row) => <span className="font-medium">{row.name}</span>,
  },
  { id: "owner", header: "Właściciel", accessorKey: "owner" },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
    sortable: false,
  },
  {
    id: "budget",
    header: "Budżet",
    accessorKey: "budget",
    cell: (row) => <span className="tabular-nums">{row.budget}</span>,
  },
  { id: "due", header: "Termin", accessorKey: "due" },
];

const rowActions: DataTableRowAction<Project>[] = [
  { label: "Podgląd", icon: <Eye className="mr-2 h-4 w-4" />, onClick: (r) => console.log("preview", r) },
  { label: "Edytuj", icon: <Edit className="mr-2 h-4 w-4" />, onClick: (r) => console.log("edit", r) },
  { label: "Duplikuj", icon: <Copy className="mr-2 h-4 w-4" />, onClick: (r) => console.log("copy", r) },
  { label: "Usuń", icon: <Trash2 className="mr-2 h-4 w-4" />, variant: "danger", onClick: (r) => console.log("delete", r) },
];

const meta: Meta<typeof DataTable<Project>> = {
  title: "Composite/DataTable",
  component: DataTable<Project>,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof DataTable<Project>>;

export const Default: Story = {
  args: {
    data: projects,
    columns,
  },
};

export const WithRowActions: Story = {
  args: {
    data: projects,
    columns,
    rowActions,
    quickAction: {
      icon: <Eye className="h-4 w-4" />,
      label: "Szybki podgląd",
      onClick: (r) => console.log("quick", r),
    },
  },
};

export const SelectableWithBulkActions: Story = {
  render: (args) => {
    const [selected, setSelected] = React.useState<Project[]>([]);
    return (
      <DataTable
        {...args}
        data={projects}
        columns={columns}
        selectable
        onSelectionChange={setSelected}
        rowActions={rowActions}
        bulkActions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Mail className="mr-2 h-4 w-4" /> Wyślij ({selected.length})
            </Button>
            <Button variant="secondary" size="sm">
              <Archive className="mr-2 h-4 w-4" /> Archiwizuj
            </Button>
          </div>
        }
      />
    );
  },
};

export const WithDensityToggle: Story = {
  render: () => {
    const [density, setDensity] = React.useState<DataTableDensity>("normal");
    return (
      <DataTable
        data={projects}
        columns={columns}
        density={density}
        onDensityChange={setDensity}
        rowActions={rowActions}
      />
    );
  },
};

export const CompactDensity: Story = {
  args: { data: projects, columns, density: "compact", rowActions },
};

export const ComfortableDensity: Story = {
  args: { data: projects, columns, density: "comfortable", rowActions },
};

export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const total = 137;
    return (
      <DataTable
        data={projects}
        columns={columns}
        rowActions={rowActions}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: (s) => {
            setPageSize(s);
            setPage(1);
          },
        }}
      />
    );
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    rowActions,
  },
};

const filterableColumns: DataTableColumn<Project>[] = [
  { ...columns[0], filterable: true },
  { ...columns[1], filterable: true },
  { ...columns[2], filterable: true },
  {
    ...columns[3],
    filterable: true,
    filterAccessor: (row) => row.status,
  },
  { ...columns[4], filterable: true },
  { ...columns[5], filterable: true },
];

export const WithFilters: Story = {
  args: {
    data: projects,
    columns: filterableColumns,
    rowActions,
    showFilterRow: true,
    labels: {
      filterPlaceholder: "filtruj…",
      actionsHeader: "Akcje",
    },
  },
};

export const PolishLabels: Story = {
  args: {
    data: projects,
    columns,
    selectable: true,
    rowActions,
    labels: {
      selectedCount: (n) => `Zaznaczono: ${n}`,
      columnsTooltip: "Kolumny",
      densityCompact: "Kompaktowy",
      densityNormal: "Normalny",
      densityComfortable: "Wygodny",
      actionsHeader: "Akcje",
      emptyState: "Brak danych do wyświetlenia",
      pageSizeLabel: "Wyświetl:",
      pageSizeSeparator: "z",
      prevPageTooltip: "Poprzednia strona",
      nextPageTooltip: "Następna strona",
      selectAllLabel: "Zaznacz wszystkie",
      selectRowLabel: (id) => `Zaznacz wiersz ${id}`,
    },
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../src/components/table";
import { StatusBadge } from "../../src/components/badge";

const meta: Meta<typeof Table> = {
  title: "Primitives/Table",
  component: Table,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Table>;

const projects = [
  { id: "PRJ-001", name: "Migracja CRM", owner: "Anna K.", status: "active", budget: "124 500 PLN" },
  { id: "PRJ-002", name: "Rebranding", owner: "Tomek W.", status: "pending", budget: "48 000 PLN" },
  { id: "PRJ-003", name: "Audyt bezpieczeństwa", owner: "Maria N.", status: "completed", budget: "32 800 PLN" },
  { id: "PRJ-004", name: "Aplikacja mobilna v2", owner: "Piotr M.", status: "draft", budget: "210 000 PLN" },
] as const;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista aktywnych projektów (kwiecień 2026)</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nazwa</TableHead>
          <TableHead>Właściciel</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Budżet</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono text-xs">{p.id}</TableCell>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.owner}</TableCell>
            <TableCell>
              <StatusBadge status={p.status as "active" | "pending" | "completed" | "draft"} />
            </TableCell>
            <TableCell className="text-right tabular-nums">{p.budget}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Razem</TableCell>
          <TableCell className="text-right tabular-nums">415 300 PLN</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const Sortable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <button className="flex items-center gap-1 hover:text-foreground">
              Nazwa <ChevronUp className="h-3 w-3" />
            </button>
          </TableHead>
          <TableHead>
            <button className="flex items-center gap-1 hover:text-foreground">
              Status <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </TableHead>
          <TableHead className="text-right">
            <button className="flex items-center gap-1 hover:text-foreground ml-auto">
              Budżet
            </button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.slice(0, 3).map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>
              <StatusBadge status={p.status as "active" | "pending" | "completed"} />
            </TableCell>
            <TableCell className="text-right tabular-nums">{p.budget}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Budżet</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-32 text-center text-foreground-muted">
            Brak projektów spełniających kryteria filtrowania.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

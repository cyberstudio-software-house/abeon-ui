import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, within } from "@testing-library/react";

import { DataTable, type DataTableColumn } from "./data-table";

/**
 * Sorting, which this table advertised and did not do.
 *
 * `sortColumn`/`sortDirection` were set by the header click and read by nothing except
 * the arrow icon, while `sortable` defaults to `true` — so every table in the platform
 * showed a pointer cursor and a direction arrow on its headers, and clicking one flipped
 * the arrow and left the rows exactly where they were. There was no `onSortChange`
 * either, so a caller could not supply the behaviour themselves.
 *
 * The consumer is the organisation members screen. An administrator sorting by status to
 * find suspended people got an arrow saying "ascending", an unchanged order, and a good
 * chance of acting on the wrong row.
 *
 * These tests assert on **row order**, never on the arrow. The arrow was already right.
 */

interface Row {
    id: number;
    name: string;
    seats: number;
    lastUsed: string | null;
}

const ROWS: Row[] = [
    { id: 1, name: "Item 10", seats: 3, lastUsed: "2026-03-01" },
    { id: 2, name: "Item 2", seats: 30, lastUsed: null },
    { id: 3, name: "Ćma", seats: 1, lastUsed: "2026-01-01" },
];

const COLUMNS: DataTableColumn<Row>[] = [
    { id: "name", header: "Nazwa", accessorKey: "name" },
    { id: "seats", header: "Miejsca", accessorKey: "seats" },
    { id: "lastUsed", header: "Użyto", accessorKey: "lastUsed" },
];

/** Row order as rendered, read from the first cell of each body row. */
function order(container: HTMLElement): string[] {
    const body = container.querySelector("tbody");
    if (!body) throw new Error("No table body rendered");

    return Array.from(body.querySelectorAll("tr")).map(
        (row) => row.querySelector("td")?.textContent?.trim() ?? "",
    );
}

function headerCell(container: HTMLElement, label: string): HTMLElement {
    const head = container.querySelector("thead");
    if (!head) throw new Error("No table head rendered");

    return within(head).getByText(label);
}

describe("DataTable sorting", () => {
    it("reorders the rows, not just the arrow", () => {
        const { container } = render(<DataTable data={ROWS} columns={COLUMNS} />);

        expect(order(container)).toEqual(["Item 10", "Item 2", "Ćma"]);

        fireEvent.click(headerCell(container, "Nazwa"));

        // "Item 2" before "Item 10" is `numeric: true` doing its job; a plain string
        // compare puts "Item 10" first, which reads as broken to anybody with more than
        // nine rows.
        expect(order(container)).toEqual(["Ćma", "Item 2", "Item 10"]);
    });

    it("reverses on a second click", () => {
        const { container } = render(<DataTable data={ROWS} columns={COLUMNS} />);

        fireEvent.click(headerCell(container, "Nazwa"));
        fireEvent.click(headerCell(container, "Nazwa"));

        expect(order(container)).toEqual(["Item 10", "Item 2", "Ćma"]);
    });

    it("sorts numbers as numbers", () => {
        const { container } = render(<DataTable data={ROWS} columns={COLUMNS} />);

        fireEvent.click(headerCell(container, "Miejsca"));

        expect(order(container)).toEqual(["Ćma", "Item 10", "Item 2"]);
    });

    it("sorts decimals and negatives, which string collation gets wrong", () => {
        // The test above passes with the numeric branch deleted, because `localeCompare`
        // with `numeric: true` already orders 3 before 30. It is **not** equivalent for
        // decimals or negatives, and those are the cases that pin the branch:
        //
        //   localeCompare   numeric
        //   1.5 <  1.25     1.5 >  1.25
        //   -10 >  -9       -10 <  -9
        //
        // Measured, then written down — the first version of this file asserted numeric
        // sorting and guarded nothing.
        const rows = [
            { id: 1, name: "a", seats: 1.5, lastUsed: null },
            { id: 2, name: "b", seats: 1.25, lastUsed: null },
            { id: 3, name: "c", seats: -10, lastUsed: null },
            { id: 4, name: "d", seats: -9, lastUsed: null },
        ];

        const { container } = render(<DataTable data={rows} columns={COLUMNS} />);

        fireEvent.click(headerCell(container, "Miejsca"));

        expect(order(container)).toEqual(["c", "d", "b", "a"]);
    });

    it("puts missing values last in both directions", () => {
        // Reversing them with the rest would put the rows a user is least interested in
        // at the top of a descending sort, which is never what "sort by last used" means.
        const { container } = render(<DataTable data={ROWS} columns={COLUMNS} />);

        fireEvent.click(headerCell(container, "Użyto"));
        expect(order(container).at(-1)).toBe("Item 2");

        fireEvent.click(headerCell(container, "Użyto"));
        expect(order(container).at(-1)).toBe("Item 2");
    });

    it("sorts by sortAccessor when the cell is not the value", () => {
        // The members screen renders status as a Badge. Sorting has to run on the value
        // behind it, not on the JSX, and not on an accessorKey that may not exist.
        const columns: DataTableColumn<Row>[] = [
            { id: "name", header: "Nazwa", accessorKey: "name" },
            {
                id: "status",
                header: "Status",
                cell: (row) => <span>{row.seats > 2 ? "Aktywny" : "Zawieszony"}</span>,
                sortAccessor: (row) => row.seats,
            },
        ];

        const { container } = render(<DataTable data={ROWS} columns={columns} />);

        fireEvent.click(headerCell(container, "Status"));

        expect(order(container)).toEqual(["Ćma", "Item 10", "Item 2"]);
    });

    it("tells the caller, so sorting can be moved to the server", () => {
        const onSortChange = vi.fn();
        const { container } = render(
            <DataTable data={ROWS} columns={COLUMNS} onSortChange={onSortChange} />,
        );

        fireEvent.click(headerCell(container, "Nazwa"));
        expect(onSortChange).toHaveBeenLastCalledWith("name", "asc");

        fireEvent.click(headerCell(container, "Nazwa"));
        expect(onSortChange).toHaveBeenLastCalledWith("name", "desc");
    });

    it("leaves a column alone when that column opts out", () => {
        const columns: DataTableColumn<Row>[] = [
            { id: "name", header: "Nazwa", accessorKey: "name", sortable: false },
            { id: "seats", header: "Miejsca", accessorKey: "seats" },
        ];

        const { container } = render(<DataTable data={ROWS} columns={columns} />);

        fireEvent.click(headerCell(container, "Nazwa"));

        expect(order(container)).toEqual(["Item 10", "Item 2", "Ćma"]);
    });

    it("leaves every column alone when the table opts out", () => {
        const { container } = render(
            <DataTable data={ROWS} columns={COLUMNS} sortable={false} />,
        );

        fireEvent.click(headerCell(container, "Nazwa"));

        expect(order(container)).toEqual(["Item 10", "Item 2", "Ćma"]);
    });
});

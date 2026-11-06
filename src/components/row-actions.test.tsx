import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { RowActions } from "./row-actions";
import { Field } from "./field";
import { Input } from "./input";

const wrap = (node: React.ReactNode) => render(<>{node}</>);

describe("RowActions", () => {
  it("renders the edit pencil as the given link and the rest behind the menu", async () => {
    const remove = vi.fn();
    wrap(<RowActions edit={{ label: "Edytuj", link: <a href="/pages/1/edit" /> }} actions={[{ label: "W górę", onClick: vi.fn() }, { label: "Usuń", variant: "danger", onClick: remove }]} />);

    expect(screen.getByRole("link", { name: "Edytuj" })).toHaveAttribute("href", "/pages/1/edit");
    fireEvent.keyDown(screen.getByRole("button", { name: "Więcej akcji" }), { key: "Enter" });
    fireEvent.click(await screen.findByRole("menuitem", { name: "Usuń" }));

    expect(remove).toHaveBeenCalled();
  });

  it("calls onClick for a pencil without a link and hides the menu without actions", async () => {
    const edit = vi.fn();
    wrap(<RowActions edit={{ label: "Edytuj", onClick: edit }} />);

    fireEvent.click(screen.getByRole("button", { name: "Edytuj" }));
    expect(edit).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Więcej akcji" })).not.toBeInTheDocument();
  });
});

describe("Field", () => {
  it("labels the control and shows the error instead of the hint", () => {
    const { rerender } = render(<Field id="slug" label="Adres" hint="Bez polskich znaków"><Input id="slug" compact /></Field>);
    expect(screen.getByLabelText("Adres")).toHaveClass("h-8");
    expect(screen.getByText("Bez polskich znaków")).toBeInTheDocument();

    rerender(<Field id="slug" label="Adres" hint="Bez polskich znaków" error="Zajęty"><Input id="slug" compact /></Field>);
    expect(screen.getByText("Zajęty")).toBeInTheDocument();
    expect(screen.queryByText("Bez polskich znaków")).not.toBeInTheDocument();
  });
});

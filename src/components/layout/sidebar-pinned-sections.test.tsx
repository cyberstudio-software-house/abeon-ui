import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";

import { TooltipProvider } from "../tooltip";
import type { PinnedItem } from "./pinned-item-row";
import {
  SidebarPinnedSections,
  arrangementOf,
  layoutOf,
  moveItem,
} from "./sidebar-pinned-sections";

const sections = [
  { id: "default", label: "Przypięte", order: 0 },
  { id: "sales", label: "Sprzedaż", order: 1 },
  { id: "empty", label: "Pusta", order: 2 },
];

const items: PinnedItem[] = [
  { id: "boilerplate.home", label: "Home", href: "/", iconName: "Home", sectionId: "default", order: 0 },
  { id: "boilerplate.settings", label: "Settings", href: "/settings", iconName: "Settings", sectionId: "default", order: 1 },
  { id: "crm.contacts", label: "Kontakty", href: "/crm/contacts", iconName: "Users", sectionId: "sales", order: 0, caption: "CRM" },
];

describe("pinned layout", () => {
  it("groups pins by section in order, and sends pins of an unknown section to the first", () => {
    const layout = layoutOf(sections, [...items, { ...items[0]!, id: "x.orphan", sectionId: "gone", order: 5 }]);

    expect(layout).toEqual({
      default: ["boilerplate.home", "boilerplate.settings", "x.orphan"],
      sales: ["crm.contacts"],
      empty: [],
    });
  });

  it("reorders within a section", () => {
    const layout = layoutOf(sections, items);
    expect(moveItem(layout, "boilerplate.settings", "boilerplate.home").default).toEqual([
      "boilerplate.settings",
      "boilerplate.home",
    ]);
  });

  it("moves a pin onto another section's pin, taking its place", () => {
    const next = moveItem(layoutOf(sections, items), "boilerplate.home", "crm.contacts");

    expect(next.default).toEqual(["boilerplate.settings"]);
    expect(next.sales).toEqual(["boilerplate.home", "crm.contacts"]);
  });

  it("moves a pin into an empty section through its drop area", () => {
    const next = moveItem(layoutOf(sections, items), "crm.contacts", "section:empty");

    expect(next.sales).toEqual([]);
    expect(next.empty).toEqual(["crm.contacts"]);
  });

  it("reports every pin with its section and position", () => {
    const next = moveItem(layoutOf(sections, items), "boilerplate.home", "section:sales");

    expect(arrangementOf(sections, next)).toEqual([
      { id: "boilerplate.settings", sectionId: "default", order: 0 },
      { id: "crm.contacts", sectionId: "sales", order: 0 },
      { id: "boilerplate.home", sectionId: "sales", order: 1 },
    ]);
  });
});

function renderSections(props: Partial<React.ComponentProps<typeof SidebarPinnedSections>> = {}) {
  const handlers = {
    onArrange: vi.fn(),
    onUnpin: vi.fn(),
    onAddSection: vi.fn(),
    onRenameSection: vi.fn(),
    onRemoveSection: vi.fn(),
  };
  render(
    <TooltipProvider>
      <SidebarPinnedSections sections={sections} items={items} {...handlers} {...props} />
    </TooltipProvider>,
  );
  return handlers;
}

describe("SidebarPinnedSections", () => {
  it("shows an empty section with a drop hint instead of hiding it", () => {
    renderSections({ labels: { emptySectionHint: "Przeciągnij tu pinezkę" } });

    const empty = screen.getByRole("region", { name: "Pusta" });
    expect(within(empty).getByText("Przeciągnij tu pinezkę")).toBeInTheDocument();
  });

  it("names the application of a pin that belongs to another one", () => {
    renderSections();
    expect(screen.getByRole("link", { name: "Kontakty · CRM" })).toHaveAttribute("href", "/crm/contacts");
  });

  it("unpins by stored id", () => {
    const { onUnpin } = renderSections({ labels: { unpin: "Odepnij" } });

    fireEvent.click(screen.getByRole("button", { name: "Odepnij: Kontakty" }));

    expect(onUnpin).toHaveBeenCalledWith("crm.contacts");
  });

  it("adds a section by name with Enter, and ignores a blank one", () => {
    const { onAddSection } = renderSections({ labels: { addSection: "Dodaj sekcję" } });

    fireEvent.click(screen.getByRole("button", { name: "Dodaj sekcję" }));
    const input = screen.getByRole("textbox", { name: "Dodaj sekcję" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onAddSection).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "  Operacje " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onAddSection).toHaveBeenCalledWith("Operacje");
  });

  it("renames a section in place", () => {
    const { onRenameSection } = renderSections({ labels: { renameSection: "Zmień nazwę" } });

    fireEvent.click(screen.getByRole("button", { name: "Zmień nazwę: Sprzedaż" }));
    const input = screen.getByRole("textbox", { name: "Zmień nazwę" });
    fireEvent.change(input, { target: { value: "Handel" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onRenameSection).toHaveBeenCalledWith("sales", "Handel");
  });

  it("offers removal for every section but the first", () => {
    const { onRemoveSection } = renderSections({ labels: { removeSection: "Usuń sekcję" } });

    expect(screen.queryByRole("button", { name: "Usuń sekcję: Przypięte" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Usuń sekcję: Sprzedaż" }));
    expect(onRemoveSection).toHaveBeenCalledWith("sales");
  });

  it("keeps row controls visible on keyboard focus and touch screens, not only on hover", () => {
    renderSections({ labels: { unpin: "Odepnij" } });

    const unpin = screen.getByRole("button", { name: "Odepnij: Home" });
    expect(unpin.className).toContain("group-focus-within:opacity-100");
    expect(unpin.className).toContain("[@media(hover:none)]:opacity-100");
  });

  it("collapses to icons only, with no controls and no extra tab stops", () => {
    renderSections({ collapsed: true });

    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(document.querySelectorAll("[tabindex]")).toHaveLength(0);
  });
});

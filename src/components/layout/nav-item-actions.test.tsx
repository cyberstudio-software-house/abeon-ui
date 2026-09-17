import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { NavItemActions, PinItemDialog } from "./nav-item-actions";

function renderDialog(props: Partial<React.ComponentProps<typeof PinItemDialog>> = {}) {
  const onConfirm = vi.fn();
  const onOpenChange = vi.fn();
  render(
    <PinItemDialog
      open
      onOpenChange={onOpenChange}
      itemId="contacts"
      itemLabel="Kontakty"
      itemHref="/contacts"
      onConfirm={onConfirm}
      labels={{ nameLabel: "Nazwa", sectionLabel: "Sekcja", confirm: "Przypnij" }}
      {...props}
    />,
  );
  return { onConfirm, onOpenChange };
}

describe("PinItemDialog", () => {
  it("pins with Enter, trimming the name", () => {
    const { onConfirm, onOpenChange } = renderDialog({ defaultIcon: "Users" });

    const name = screen.getByLabelText("Nazwa");
    fireEvent.change(name, { target: { value: "  Moi klienci " } });
    fireEvent.submit(name.closest("form")!);

    expect(onConfirm).toHaveBeenCalledWith({ id: "contacts", label: "Moi klienci", href: "/contacts", iconName: "Users" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not pin a blank name", () => {
    const { onConfirm } = renderDialog();

    const name = screen.getByLabelText("Nazwa");
    fireEvent.change(name, { target: { value: "   " } });
    fireEvent.submit(name.closest("form")!);

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Przypnij" })).toBeDisabled();
  });

  it("offers the item's own icon, and a star only when that icon is unknown", () => {
    const { onConfirm } = renderDialog({ defaultIcon: "NotAnIcon" });

    fireEvent.submit(screen.getByLabelText("Nazwa").closest("form")!);

    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ iconName: "Star" }));
  });

  it("lets the user choose a section when sections are offered", () => {
    const { onConfirm } = renderDialog({
      sections: [
        { id: "default", label: "Przypięte" },
        { id: "sales", label: "Sprzedaż" },
      ],
    });

    fireEvent.change(screen.getByLabelText("Sekcja"), { target: { value: "sales" } });
    fireEvent.submit(screen.getByLabelText("Nazwa").closest("form")!);

    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ sectionId: "sales" }));
  });

  it("has no section field and no section in the payload without sections", () => {
    const { onConfirm } = renderDialog();

    expect(screen.queryByLabelText("Sekcja")).toBeNull();
    fireEvent.submit(screen.getByLabelText("Nazwa").closest("form")!);
    expect(onConfirm.mock.calls[0]![0]).not.toHaveProperty("sectionId");
  });
});

describe("NavItemActions", () => {
  it("names the item on its trigger and keeps it visible on focus, while open and on touch", () => {
    render(
      <NavItemActions
        itemId="settings"
        itemLabel="Ustawienia"
        itemHref="/settings"
        isPinned={false}
        onPin={vi.fn()}
        onUnpin={vi.fn()}
        labels={{ triggerLabel: "Akcje" }}
        className="ml-auto"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Akcje: Ustawienia" });
    expect(trigger.className).toContain("focus-visible:opacity-100");
    expect(trigger.className).toContain("data-[state=open]:opacity-100");
    expect(trigger.className).toContain("[@media(hover:none)]:opacity-100");
    expect(trigger.className).toContain("ml-auto");
  });
});

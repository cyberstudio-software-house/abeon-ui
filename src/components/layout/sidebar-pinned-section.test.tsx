import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";

import { TooltipProvider } from "../tooltip";
import { SidebarPinnedSection, type PinnedItem } from "./sidebar-pinned-section";

const section = { id: "default", label: "Pinned", order: 0 };

const items: PinnedItem[] = [
  { id: "boilerplate.home", label: "Home", href: "/", iconName: "Home", sectionId: "default", order: 0, isActive: true },
  { id: "crm.contacts", label: "Contacts", href: "/crm/contacts", iconName: "Users", sectionId: "default", order: 1 },
];

function renderSection(props: Partial<React.ComponentProps<typeof SidebarPinnedSection>> = {}) {
  const onUnpin = vi.fn();
  const onReorder = vi.fn();
  const result = render(
    <TooltipProvider>
      <SidebarPinnedSection section={section} items={items} onUnpin={onUnpin} onReorder={onReorder} {...props} />
    </TooltipProvider>,
  );
  return { ...result, onUnpin, onReorder };
}

describe("SidebarPinnedSection", () => {
  it("renders nothing when there is nothing pinned", () => {
    const { container } = renderSection({ items: [] });
    expect(container.textContent).toBe("");
  });

  it("links every item in the order given, marking the active one", () => {
    renderSection();

    const links = screen.getAllByRole("link");
    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["Home", "/"],
      ["Contacts", "/crm/contacts"],
    ]);
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(links[1]).not.toHaveAttribute("aria-current");
  });

  it("hands each link to the host, which decides how it navigates", () => {
    const renderLink = vi.fn(({ href, className, children }) => (
      <a data-testid={`custom-${href}`} href={href} className={className}>
        {children}
      </a>
    ));

    renderSection({ renderLink });

    expect(renderLink).toHaveBeenCalledWith(expect.objectContaining({ href: "/crm/contacts", isActive: false }));
    expect(screen.getByTestId("custom-/crm/contacts")).toHaveTextContent("Contacts");
  });

  it("unpins the item whose button was pressed, by its id", () => {
    const { onUnpin } = renderSection({ labels: { unpinTitle: "Odepnij" } });

    const rows = screen.getAllByRole("link").map((link) => link.closest(".group") as HTMLElement);
    fireEvent.click(within(rows[1]!).getByRole("button", { name: /^Odepnij/ }));

    expect(onUnpin).toHaveBeenCalledWith("crm.contacts");
  });

  it("offers no unpin and no drag handle when the sidebar is collapsed", () => {
    renderSection({ collapsed: true });

    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(document.querySelectorAll("[tabindex]")).toHaveLength(0);
    expect(screen.queryByText("Pinned")).toBeNull();
  });
});

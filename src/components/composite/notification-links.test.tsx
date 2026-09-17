import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Bell, Users } from "lucide-react";
import { NotificationCenter } from "./notification-center";
import { AppSwitcher } from "./app-switcher";
import { Topbar } from "../layout/topbar";
import type { NotificationItem } from "../../types/notification-item";

const items: NotificationItem[] = [
  { id: "n1", icon: Users, colorVariant: "primary", title: "Nowy kontakt", message: "Jan", time: "teraz", read: false, href: "/crm/contacts/42" },
  { id: "n2", icon: Bell, colorVariant: "warning", title: "Bez linku", message: "…", time: "teraz", read: true },
];

afterEach(() => {
  document.head.innerHTML = "";
});

describe("notification entries", () => {
  it("NotificationCenter renders a link for a notification with href and marks it read on click", () => {
    const onRead = vi.fn();
    render(<NotificationCenter notifications={items} unreadCount={1} onRead={onRead} onReadAll={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Powiadomienia" }));

    const link = screen.getByRole("link", { name: /Nowy kontakt/ });
    expect(link).toHaveAttribute("href", "/crm/contacts/42");
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    expect(onRead).toHaveBeenCalledWith("n1");

    expect(screen.getByRole("button", { name: /Bez linku/ })).not.toHaveAttribute("href");
  });

  it("Topbar renders the same link and keeps keyboard access for entries without one", () => {
    const onRead = vi.fn();
    render(
      <Topbar
        apps={[]}
        currentAppId="boilerplate"
        notifications={items}
        unreadCount={1}
        user={{ name: "Anna", email: "anna@abeon.dev", initials: "AN" }}
        sidebarCollapsed={false}
        onNotificationRead={onRead}
        onNotificationReadAll={() => {}}
        onSignOut={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));

    const link = screen.getByRole("link", { name: /Nowy kontakt/ });
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    expect(onRead).toHaveBeenCalledWith("n1");
    expect(screen.getByRole("button", { name: /Bez linku/ })).toBeInTheDocument();
  });
});

describe("app prefetch", () => {
  const apps = [{ id: "crm", name: "CRM", description: "Klienci", icon: Users, url: "/crm" }];

  it("AppSwitcher prefetches an application when its tile is hovered", () => {
    render(<AppSwitcher apps={apps} currentAppId="boilerplate" categories={[{ label: "Główne", appIds: ["crm"] }]} />);
    fireEvent.click(screen.getAllByRole("button")[0]!);

    fireEvent.pointerEnter(screen.getByRole("link", { name: /CRM/ }));

    expect(document.head.querySelector('link[rel="prefetch"]')).toHaveAttribute("href", `${window.location.origin}/crm`);
  });

  it("prefetch can be switched off", () => {
    render(
      <AppSwitcher
        apps={apps}
        currentAppId="boilerplate"
        categories={[{ label: "Główne", appIds: ["crm"] }]}
        prefetchOnHover={false}
      />,
    );
    fireEvent.click(screen.getAllByRole("button")[0]!);

    fireEvent.pointerEnter(screen.getByRole("link", { name: /CRM/ }));

    expect(document.head.querySelector('link[rel="prefetch"]')).toBeNull();
  });
});

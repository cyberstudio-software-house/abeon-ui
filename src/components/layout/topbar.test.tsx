import { describe, expect, it } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Files } from "lucide-react";
import { Topbar } from "./topbar";

const apps = [
    { id: "cms", name: "Treści", icon: Files, description: "", url: "/cms" },
    { id: "crm", name: "CRM", icon: Files, description: "", url: "/crm" },
];

const user = { name: "Dev Admin", email: "admin@abeon.dev", initials: "DA" };

const required = {
    user,
    notifications: [],
    unreadCount: 0,
    sidebarCollapsed: false,
    onNotificationRead: () => {},
    onNotificationReadAll: () => {},
    onSignOut: () => {},
};

describe("Topbar", () => {
    it("names the open application on the switcher, not only inside it", () => {
        const { getByLabelText } = render(
            <Topbar apps={apps} currentAppId="cms" {...required} />,
        );

        expect(getByLabelText(/Aplikacja: Treści/)).toHaveTextContent("Treści");
    });

    it("says why the list is empty when fetching it failed", () => {
        const { getByLabelText, getByText } = render(
            <Topbar
                apps={[]}
                currentAppId="cms"
                appsError="Nie udało się pobrać listy aplikacji."
                {...required}
            />,
        );

        fireEvent.click(getByLabelText("Przełącz aplikację"));

        expect(getByText("Nie udało się pobrać listy aplikacji.")).toBeInTheDocument();
    });
});

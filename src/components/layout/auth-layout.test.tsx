import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { AuthLayout } from "./auth-layout";

describe("AuthLayout", () => {
    it("announces a form-level failure to a screen reader", () => {
        // `abeon-auth-ui` routes the login error here rather than to the email field,
        // so that a uniform "wrong address or password" does not point at the address
        // and become an enumeration hint. That only works if this is announced.
        const { getByRole } = render(
            <AuthLayout title="Zaloguj się" error="Nieprawidłowy adres e-mail lub hasło.">
                <form />
            </AuthLayout>,
        );

        expect(getByRole("alert")).toHaveTextContent("Nieprawidłowy adres e-mail lub hasło.");
    });

    it("renders no alert when there is nothing wrong", () => {
        const { queryByRole } = render(
            <AuthLayout title="Zaloguj się">
                <form />
            </AuthLayout>,
        );

        expect(queryByRole("alert")).toBeNull();
    });

    it("puts the title in a level-one heading", () => {
        const { getByRole } = render(
            <AuthLayout title="Ustaw hasło">
                <form />
            </AuthLayout>,
        );

        expect(getByRole("heading", { level: 1 })).toHaveTextContent("Ustaw hasło");
    });

    it("renders the brand, description and footer slots only when given", () => {
        const { container, rerender, getByText } = render(
            <AuthLayout title="T">
                <p>form</p>
            </AuthLayout>,
        );
        expect(container.textContent).not.toContain("Abeon");

        rerender(
            <AuthLayout title="T" brand="Abeon" description="Opis" footer="Stopka">
                <p>form</p>
            </AuthLayout>,
        );
        getByText("Abeon");
        getByText("Opis");
        getByText("Stopka");
    });

    it("renders its children", () => {
        const { getByTestId } = render(
            <AuthLayout title="T">
                <form data-testid="the-form" />
            </AuthLayout>,
        );

        expect(getByTestId("the-form")).toBeInTheDocument();
    });
});

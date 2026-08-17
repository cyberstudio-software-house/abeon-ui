import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ForgotPasswordForm } from "./forgot-password-form";

describe("ForgotPasswordForm", () => {
    it("is a real form naming the field the host expects", () => {
        const { container } = render(<ForgotPasswordForm action="/password/forgot" />);
        const form = container.querySelector("form");

        expect(form?.getAttribute("action")).toBe("/password/forgot");
        expect(form?.getAttribute("method")).toBe("post");
        expect(container.querySelector('input[name="email"]')).toHaveAttribute("autocomplete", "username");
    });

    it("confirms without revealing whether the account exists", () => {
        // The confirmation is deliberately enumeration-safe: it says a link was sent *if*
        // an account exists. A component that said "we have sent you a link" would turn
        // this screen into an account oracle, which is the one thing it must not be.
        const { getByRole } = render(<ForgotPasswordForm sent />);
        const status = getByRole("status");

        expect(status).toBeInTheDocument();
        expect(status.textContent).toMatch(/jeśli/i);
    });

    it("hides the form once the request has been made", () => {
        const { container } = render(<ForgotPasswordForm sent />);

        expect(container.querySelector('input[name="email"]')).toBeNull();
    });
});

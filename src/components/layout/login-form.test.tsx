import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LoginForm } from "./login-form";

/**
 * The first tests in this package.
 *
 * They pin the *contract* a host depends on, not the appearance: field names, the
 * hidden-field slot, and the attributes a browser acts on. Every one of these
 * survived the `abeon-auth-ui` migration from Blade — this is what keeps them
 * surviving the next change, since a lost `autocomplete` breaks nothing loudly.
 */
describe("LoginForm", () => {
    it("is a real form that submits without JavaScript", () => {
        // The reason this matters is in `abeon-auth-ui/resources/js/Pages/Login.tsx`:
        // the host's success path is a cross-origin `redirect()->away()` with cookies
        // relayed, which an XHR submit cannot follow.
        const { container } = render(<LoginForm action="/login" />);
        const form = container.querySelector("form");

        expect(form).toBeInTheDocument();
        expect(form?.getAttribute("action")).toBe("/login");
        expect(form?.getAttribute("method")).toBe("post");
    });

    it("names the fields the way a Laravel host expects", () => {
        const { container } = render(<LoginForm />);

        expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
    });

    it("puts hidden fields inside the form, where they will be submitted", () => {
        const { container } = render(
            <LoginForm hiddenFields={<input type="hidden" name="_token" value="abc" />} />,
        );

        const token = container.querySelector('input[name="_token"]');
        expect(token).toBeInTheDocument();
        expect(token?.closest("form")).not.toBeNull();
    });

    it("carries the browser-facing attributes", () => {
        const { container } = render(<LoginForm />);
        const email = container.querySelector('input[name="email"]');
        const password = container.querySelector('input[name="password"]');

        expect(email).toHaveAttribute("type", "email");
        expect(email).toHaveAttribute("autocomplete", "username");
        expect(email).toHaveAttribute("inputmode", "email");
        expect(email).toBeRequired();
        expect(password).toHaveAttribute("autocomplete", "current-password");
        expect(password).toBeRequired();
    });

    it("repopulates the address after a failed attempt", () => {
        const { container } = render(<LoginForm emailDefaultValue="someone@abeon.dev" />);

        expect(container.querySelector('input[name="email"]')).toHaveValue("someone@abeon.dev");
    });

    it("offers the forgot-password link only when given a target", () => {
        // Passing no href must render no link — a "forgot password" that leads to a 404
        // is worse than its absence, and `abeon-auth-ui` relies on this because Auth has
        // no reset endpoint yet.
        const { queryByRole, rerender } = render(<LoginForm />);
        expect(queryByRole("link")).toBeNull();

        rerender(<LoginForm forgotPasswordHref="/password/forgot" />);
        expect(queryByRole("link")).toBeInTheDocument();
    });

    it("keeps the remember-me checkbox out unless asked, and submits it natively", () => {
        const { container, rerender } = render(<LoginForm />);
        expect(container.querySelector('input[name="remember"]')).toBeNull();

        rerender(<LoginForm showRememberMe />);
        const remember = container.querySelector('input[name="remember"]');

        // A native checkbox rather than the Radix one, so it is submitted by a no-JS POST.
        expect(remember).toHaveAttribute("type", "checkbox");
    });

    it("describes the password field by its error when there is one", () => {
        const { container } = render(<LoginForm passwordError="Za krótkie" />);
        const password = container.querySelector('input[name="password"]');

        expect(password).toHaveAttribute("aria-invalid", "true");
        const describedBy = password?.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();
        expect(container.querySelector(`#${describedBy}`)).toHaveTextContent("Za krótkie");
    });
});

import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { SetPasswordForm } from "./set-password-form";

describe("SetPasswordForm", () => {
    it("uses the field names Laravel's `confirmed` rule requires", () => {
        // These are deliberately not props. The rule derives the second name from the
        // first, so a consumer able to rename them could turn every submission into a
        // validation failure the host cannot explain.
        const { container } = render(<SetPasswordForm />);

        expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
        expect(container.querySelector('input[name="password_confirmation"]')).toBeInTheDocument();
    });

    it("is a real form with the hidden-field slot inside it", () => {
        const { container } = render(
            <SetPasswordForm
                action="/invitation/abc"
                hiddenFields={<input type="hidden" name="_token" value="t" />}
            />,
        );
        const form = container.querySelector("form");

        expect(form?.getAttribute("action")).toBe("/invitation/abc");
        expect(form?.getAttribute("method")).toBe("post");
        expect(container.querySelector('input[name="_token"]')?.closest("form")).not.toBeNull();
    });

    it("states the length floor on both fields", () => {
        const { container } = render(<SetPasswordForm />);

        for (const name of ["password", "password_confirmation"]) {
            const field = container.querySelector(`input[name="${name}"]`);
            expect(field).toHaveAttribute("minlength", "12");
            expect(field).toHaveAttribute("autocomplete", "new-password");
            expect(field).toBeRequired();
        }
    });

    it("lets the host raise the floor", () => {
        const { container } = render(<SetPasswordForm minLength={16} />);

        expect(container.querySelector('input[name="password"]')).toHaveAttribute("minlength", "16");
    });

    it("does not reveal the confirmation field, even after the toggle is pressed", () => {
        // Confirming a password you can read is not confirming anything — the second
        // field exists to be typed.
        //
        // Asserting the initial state is not enough and this test said so only after it
        // passed against a deliberately broken component: both fields start hidden, so
        // `type="password"` holds either way. The click is the assertion.
        const { container } = render(<SetPasswordForm />);
        const toggle = container.querySelector("button[aria-pressed]");

        expect(container.querySelectorAll("button[aria-pressed]")).toHaveLength(1);
        expect(toggle).not.toBeNull();

        fireEvent.click(toggle as HTMLElement);

        expect(container.querySelector('input[name="password"]')).toHaveAttribute("type", "text");
        expect(container.querySelector('input[name="password_confirmation"]')).toHaveAttribute(
            "type",
            "password",
        );
    });

    it("puts both fields in the error state, because it cannot know which one is wrong", () => {
        const { container } = render(<SetPasswordForm passwordError="Nie przyjęto" />);

        expect(container.querySelector('input[name="password"]')).toHaveAttribute("aria-invalid", "true");
        expect(container.querySelector('input[name="password_confirmation"]')).toHaveAttribute(
            "aria-invalid",
            "true",
        );
    });
});

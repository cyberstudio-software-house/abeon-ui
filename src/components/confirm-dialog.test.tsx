import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ConfirmDialog } from "./confirm-dialog";

/**
 * What happens when the confirmed work fails.
 *
 * `onOpenChange(false)` sat inside the same `try` as the `await`, so a rejection skipped
 * the close — correct — but nothing caught it either, and it escaped the click handler as
 * an unhandled promise rejection. The dialog stayed open with its spinner turning and no
 * explanation anywhere the user could see.
 *
 * This component is the only guard on suspending an organisation member, which is the
 * most irreversible thing the administration surface does.
 *
 * **These assertions use `screen`, not `container`**, unlike the four auth tests in this
 * repository: Radix renders `AlertDialog` into a portal on `document.body`, so a
 * container-scoped query finds nothing.
 */

function open(props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) {
    const onOpenChange = vi.fn();
    const result = render(
        <ConfirmDialog
            open
            onOpenChange={onOpenChange}
            title="Zawiesić dostęp?"
            confirmLabel="Zawieś"
            cancelLabel="Anuluj"
            onConfirm={() => {}}
            {...props}
        />,
    );

    return { ...result, onOpenChange };
}

/**
 * The confirm button, matched loosely on purpose.
 *
 * While the work is in flight the button also contains a `Spinner`, which carries
 * `role="status"` and an `aria-label` — so the button's accessible name gains the
 * spinner's label and an exact match stops finding it. That is worth knowing beyond this
 * test: a screen-reader user hears the spinner's label prepended to the action.
 */
const confirmButton = () => screen.getByRole("button", { name: /Zawieś/ });

describe("ConfirmDialog", () => {
    it("closes once when the work succeeds", async () => {
        const { onOpenChange } = open({ onConfirm: () => Promise.resolve() });

        fireEvent.click(confirmButton());

        await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
        expect(onOpenChange).toHaveBeenCalledTimes(1);
    });

    it("stays open when the work fails", async () => {
        // The user asked for something irreversible, it did not happen, and closing the
        // dialog would say the opposite.
        const onError = vi.fn();
        const { onOpenChange } = open({
            onConfirm: () => Promise.reject(new Error("409 last administrator")),
            onError,
        });

        fireEvent.click(confirmButton());

        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(onOpenChange).not.toHaveBeenCalled();
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    it("hands the failure to onError", async () => {
        const failure = new Error("409 last administrator");
        const onError = vi.fn();
        open({ onConfirm: () => Promise.reject(failure), onError });

        fireEvent.click(confirmButton());

        await waitFor(() => expect(onError).toHaveBeenCalledWith(failure));
    });

    it("lets the user try again after a failure", async () => {
        // The consequence of staying open, and the reason the spinner has to stop: a
        // dialog that keeps both buttons disabled forever is indistinguishable from one
        // that is still working.
        const onConfirm = vi
            .fn()
            .mockRejectedValueOnce(new Error("boom"))
            .mockResolvedValueOnce(undefined);
        const onError = vi.fn();
        const { onOpenChange } = open({ onConfirm, onError });

        fireEvent.click(confirmButton());
        await waitFor(() => expect(onError).toHaveBeenCalled());

        await waitFor(() => expect(confirmButton()).not.toBeDisabled());

        fireEvent.click(confirmButton());
        await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    });

    it("reports a failure even when the caller passes no handler", async () => {
        // Never silent. Before this the rejection escaped the click handler entirely.
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

        open({ onConfirm: () => Promise.reject(new Error("boom")) });
        fireEvent.click(confirmButton());

        await waitFor(() => expect(consoleError).toHaveBeenCalled());
        consoleError.mockRestore();
    });

    it("disables both buttons while the work is in flight", async () => {
        let release: (() => void) | undefined;
        open({ onConfirm: () => new Promise<void>((resolve) => { release = resolve; }) });

        fireEvent.click(confirmButton());

        await waitFor(() => expect(confirmButton()).toBeDisabled());
        expect(screen.getByRole("button", { name: /Anuluj/ })).toBeDisabled();

        release?.();
    });

    it("does not touch loading when onConfirm is synchronous", () => {
        // A synchronous handler leaves closing to Radix's own action behaviour; the
        // component must not start a spinner it will never stop.
        const onConfirm = vi.fn();
        open({ onConfirm });

        fireEvent.click(confirmButton());

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(confirmButton()).not.toBeDisabled();
    });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AccentPicker } from "./accent-picker";
import { applyAccent } from "../lib/accent";

afterEach(() => {
  delete document.documentElement.dataset.accent;
});

describe("applyAccent", () => {
  it("takes the first known choice, so a user's accent beats the organisation's", () => {
    expect(applyAccent("violet", "emerald")).toBe("violet");
    expect(document.documentElement.dataset.accent).toBe("violet");

    expect(applyAccent(null, "emerald")).toBe("emerald");
    expect(document.documentElement.dataset.accent).toBe("emerald");
  });

  it("falls back to the Cyberstudio default, which needs no attribute", () => {
    expect(applyAccent("magenta", undefined)).toBe("cyberstudio");
    expect(document.documentElement.dataset.accent).toBeUndefined();
  });
});

describe("AccentPicker", () => {
  it("offers the inherit option and reports the chosen accent", () => {
    const onChange = vi.fn();
    render(<AccentPicker value={null} onChange={onChange} inheritLabel="Jak organizacja" />);

    expect(screen.getByRole("radio", { name: "Jak organizacja" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("radio", { name: "Szmaragd" }));
    expect(onChange).toHaveBeenCalledWith("emerald");
  });

  it("has no inherit option for the organisation itself", () => {
    render(<AccentPicker value="cyberstudio" onChange={() => {}} />);

    expect(screen.queryByRole("radio", { name: "Jak organizacja" })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Cyberstudio" })).toHaveAttribute("aria-checked", "true");
  });
});

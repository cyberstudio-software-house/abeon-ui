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
    fireEvent.click(screen.getByRole("radio", { name: "Las + mięta" }));
    expect(onChange).toHaveBeenCalledWith("emerald");
  });

  it("has no inherit option for the organisation itself", () => {
    render(<AccentPicker value="cyberstudio" onChange={() => {}} />);

    expect(screen.queryByRole("radio", { name: "Jak organizacja" })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Granat + turkus" })).toHaveAttribute("aria-checked", "true");
  });

  it("is one tab stop: only the checked tile, or the first one, is tabbable", () => {
    const { rerender } = render(<AccentPicker value="emerald" onChange={() => {}} inheritLabel="Jak organizacja" />);
    const tabbable = () => screen.getAllByRole("radio").filter((radio) => radio.tabIndex === 0);

    expect(tabbable().map((radio) => radio.getAttribute("aria-label"))).toEqual(["Las + mięta"]);

    rerender(<AccentPicker value={null} onChange={() => {}} />);
    expect(tabbable().map((radio) => radio.getAttribute("aria-label"))).toEqual(["Granat + turkus"]);
  });

  it("moves and selects with arrows, wrapping, and jumps with Home and End", () => {
    const onChange = vi.fn();
    render(<AccentPicker value="cyberstudio" onChange={onChange} inheritLabel="Jak organizacja" />);
    const radios = screen.getAllByRole("radio");
    const current = screen.getByRole("radio", { name: "Granat + turkus" });

    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("graphite");
    expect(radios[2]).toHaveFocus();

    fireEvent.keyDown(current, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(null);

    fireEvent.keyDown(radios[0], { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("orange");

    fireEvent.keyDown(radios[0], { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("orange");
    expect(radios[radios.length - 1]).toHaveFocus();

    fireEvent.keyDown(current, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(radios[0]).toHaveFocus();

    onChange.mockClear();
    fireEvent.keyDown(current, { key: "a" });
    expect(onChange).not.toHaveBeenCalled();
  });
});

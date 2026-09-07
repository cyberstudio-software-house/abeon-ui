import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Calendar } from "./calendar";

/**
 * Written with the react-day-picker v9 migration, because that migration has a
 * silent failure mode: v9 renamed every `classNames` key this wrapper sets, and an
 * unrecognised key is **ignored, not rejected**. A calendar built with v8 keys under
 * v9 still renders and still works — it is simply unstyled, which no type check and
 * no smoke render would catch.
 *
 * So these assert on the classes actually reaching the DOM, not on the component
 * rendering. Verified by breaking it: reverting `month_grid` to v8's `table`, or
 * `selected` to `day_selected`, turns the matching test red.
 */
describe("Calendar", () => {
  const JULY_2026 = new Date(2026, 6, 15);

  it("renders a month grid with day buttons", () => {
    render(<Calendar mode="single" defaultMonth={JULY_2026} />);

    expect(screen.getByRole("grid")).toBeInTheDocument();
    // A July has 31 days; outside days from adjacent months are shown too, so this
    // is a floor rather than an equality.
    expect(screen.getAllByRole("gridcell").length).toBeGreaterThanOrEqual(31);
  });

  it("applies the v9 grid class, not v8's ignored `table` key", () => {
    const { container } = render(<Calendar mode="single" defaultMonth={JULY_2026} />);

    const grid = container.querySelector("[class*='border-collapse']");
    expect(grid, "month_grid classes never reached the DOM — the v8 key name is being ignored").not.toBeNull();
  });

  it("styles the selected day through the v9 `selected` key", () => {
    const { container } = render(
      <Calendar mode="single" defaultMonth={JULY_2026} selected={JULY_2026} />,
    );

    const selected = container.querySelector("[class*='bg-primary']");
    expect(selected, "selected-day classes never reached the DOM — v8 used `day_selected`").not.toBeNull();
  });

  it("keeps the library's own chevrons through the v9 `Chevron` component", () => {
    // v9 dropped `IconLeft`/`IconRight` for a single `Chevron` taking an
    // `orientation`. If the override stops applying, day-picker renders its own
    // arrows and these lucide classes disappear.
    const { container } = render(<Calendar mode="single" defaultMonth={JULY_2026} />);

    expect(container.querySelector(".lucide-chevron-left")).not.toBeNull();
    expect(container.querySelector(".lucide-chevron-right")).not.toBeNull();
  });
});

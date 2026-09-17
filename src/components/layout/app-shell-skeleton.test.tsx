import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { AppShellSkeleton, PageSkeleton } from "./app-shell-skeleton";

describe("skeletons", () => {
  it("announces loading once, with the label", () => {
    render(<AppShellSkeleton label="Ładowanie CRM…" />);

    expect(screen.getByRole("status")).toHaveTextContent("Ładowanie CRM…");
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("renders the requested number of content rows", () => {
    const { container } = render(<PageSkeleton rows={3} />);

    expect(container.querySelectorAll(".h-10")).toHaveLength(3);
  });
});

import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Check } from "lucide-react";

import { CommandPalette, type PaletteCommand } from "./command-palette";

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ??= () => {};
});

function renderPalette(commands: PaletteCommand[]) {
  return render(<CommandPalette open onOpenChange={() => {}} commands={commands} />);
}

function iconOf(title: string): Element | null {
  return screen.getByRole("option", { name: title }).querySelector("svg");
}

describe("CommandPalette icons", () => {
  it("renders a forwardRef icon component, which is how every Lucide icon is built", () => {
    expect(typeof Check).toBe("object");

    renderPalette([{ id: "pin.home", title: "Home", icon: Check, run: () => {} }]);

    expect(iconOf("Home")).not.toBeNull();
  });

  it("renders a plain function component", () => {
    const Dot = ({ className }: { className?: string }) => <svg className={className} />;

    renderPalette([{ id: "nav.dot", title: "Dot", icon: Dot, run: () => {} }]);

    expect(iconOf("Dot")).not.toBeNull();
  });

  it("renders no icon for a name or for none at all", () => {
    renderPalette([
      { id: "a", title: "Named", icon: "Check", run: () => {} },
      { id: "b", title: "Bare", icon: null, run: () => {} },
    ]);

    expect(iconOf("Named")).toBeNull();
    expect(iconOf("Bare")).toBeNull();
  });
});

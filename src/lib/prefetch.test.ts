import { afterEach, describe, expect, it } from "vitest";
import { prefetchOnce } from "./prefetch";

function prefetchLinks(): string[] {
  return Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="prefetch"]')).map((l) => l.href);
}

afterEach(() => {
  document.head.innerHTML = "";
  Object.defineProperty(navigator, "connection", { value: undefined, configurable: true });
});

describe("prefetchOnce", () => {
  it("adds one prefetch link per same-origin page", () => {
    expect(prefetchOnce("/crm")).toBe(true);
    expect(prefetchOnce("/crm")).toBe(false);
    expect(prefetchOnce("/crm#contacts")).toBe(false);

    expect(prefetchLinks()).toEqual([`${window.location.origin}/crm`]);
  });

  it("skips other origins, the current page and empty values", () => {
    expect(prefetchOnce("https://evil.example/crm")).toBe(false);
    expect(prefetchOnce(window.location.href)).toBe(false);
    expect(prefetchOnce(undefined)).toBe(false);
    expect(prefetchOnce("")).toBe(false);

    expect(prefetchLinks()).toEqual([]);
  });

  it("does nothing when the browser asks to save data", () => {
    Object.defineProperty(navigator, "connection", { value: { saveData: true }, configurable: true });

    expect(prefetchOnce("/finance")).toBe(false);
    expect(prefetchLinks()).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";

import { availableIcons, getIconByName } from "./icon-picker";

/**
 * Whether a value is something React can render as a component.
 *
 * **Not `typeof === "function"`.** Lucide icons are `forwardRef` components, which are
 * objects carrying a `$$typeof` symbol — the first version of these tests checked for a
 * function and failed against a perfectly working library. That is also the property that
 * matters here: `<undefined />` is what throws React error #130, and anything React can
 * render does not.
 */
function isRenderableComponent(value: unknown): boolean {
    if (typeof value === "function") return true;

    return typeof value === "object" && value !== null && "$$typeof" in value;
}

/**
 * Icon resolution, which crashed applications by returning `undefined`.
 *
 * `getIconByName` resolves against a curated set. Anything outside it returns `undefined`,
 * which reaches a prop typed `LucideIcon`, renders `<undefined />` and unmounts the whole
 * tree with React error #130 (KNOWN_ISSUES §1). It bit `AppSwitcher` in the boilerplate.
 *
 * The set stays curated — it is what the picker renders, and resolving all ~1500 Lucide
 * icons would undo the tree-shaking that took the login screen from 264 kB to 11.9 kB.
 * So the contract is not "always resolves"; it is "resolves everything this platform
 * asks for", and that is what these tests hold it to.
 */
describe("getIconByName", () => {
    it("resolves every name the curated set advertises", () => {
        // The list and the resolver read from the same array today, so this looks
        // tautological — it is not. It catches an entry whose `icon` is undefined because
        // a Lucide export was renamed or removed under a version bump, which would
        // otherwise surface as a crash in whichever application used that name first.
        const unresolved = availableIcons
            .filter((option) => !isRenderableComponent(getIconByName(option.name)))
            .map((option) => option.name);

        expect(unresolved).toEqual([]);
    });

    /**
     * Names the platform actually passes, gathered from the consumers:
     *
     *   - `abeon-boilerplate-inertia/resources/js/config/nav.ts` — sidebar destinations
     *   - `.../Pages/Store.tsx` and `.../lib/chrome-mappers.ts` — the application catalogue,
     *     PascalCased from the `icon` column
     *   - `abeon-unified/database/seeders` — the catalogue's own fixture, which is where
     *     `layout-dashboard` comes from
     *   - KNOWN_ISSUES §1 — the six names reported as crashing
     *
     * A name added to a seeder or a nav config without being added here is exactly the
     * gap this test exists to close, so extend the list when the platform grows one.
     */
    const NAMES_THE_PLATFORM_USES = [
        "Home",
        "Settings",
        "Users",
        "ShoppingCart",
        "Package",
        "Briefcase",
        "Calendar",
        "FileText",
        "Headphones",
        "LayoutDashboard",
        "Wallet",
        "Kanban",
        "Boxes",
        "Circle",
        "Info",
        "Check",
        "TriangleAlert",
    ];

    it.each(NAMES_THE_PLATFORM_USES)("resolves %s, which some screen passes", (name) => {
        expect(isRenderableComponent(getIconByName(name))).toBe(true);
    });

    it("returns undefined for a name it does not carry, rather than throwing", () => {
        // `undefined` is the honest answer and callers are expected to handle it — a
        // silent fallback would hide a misspelling, and only the caller knows what a
        // sensible substitute is.
        expect(getIconByName("NoSuchIconAnywhere")).toBeUndefined();
        expect(getIconByName("")).toBeUndefined();
    });

    it("carries no duplicate names", () => {
        // A duplicate makes the resolver's answer depend on array order, and makes the
        // picker show the same icon twice.
        const names = availableIcons.map((option) => option.name);

        expect(names.length).toBe(new Set(names).size);
    });
});

# Known issues — @abeon/ui

Tracked defects found while integrating the federated chrome (abeon-boilerplate-inertia, 2026-06-23).

## 1. `getIconByName` returns `undefined` for valid Lucide names (consumer crash risk) — OPEN

**Where:** `src/components/icon-picker.tsx:196`
```ts
export function getIconByName(name: string): LucideIcon | undefined {
  return availableIcons.find((i) => i.name === name)?.icon;
}
```
`availableIcons` is a **curated 44-icon list**, not all of Lucide. `getIconByName` returns
`undefined` for any name outside it — including real Lucide icons such as `Kanban`, `Boxes`,
`Circle`, `Info`, `Check`, `TriangleAlert`.

**Impact:** consumers that feed the result straight into a component prop typed `LucideIcon`
(e.g. `AppManifest.icon`, `NotificationItem.icon` on `<Topbar>`) render `<undefined />` and crash the
whole tree with **React error #130** ("element type is invalid"). This bit the boilerplate AppSwitcher
on first open: a `kanban` app icon resolved to `undefined`, and naive fallbacks (`Boxes`/`Circle`) are
*also* absent from the set, so a fallback chain can still yield `undefined`.

**Workaround (in the consumer, currently applied in the boilerplate):** resolve via a fallback that is
known to be in the set — `getIconByName(name) ?? getIconByName('Package')` — and only use names from
`availableIcons`.

**Suggested fix (in this package):** either
- make `getIconByName` total — fall back to a guaranteed in-set default (e.g. `Package`) instead of
  returning `undefined`, and/or expose a non-optional `getIconByNameOrDefault(name, fallback)`; and/or
- widen `availableIcons` toward the full Lucide set (or accept a Lucide component directly);
- at minimum, document that the set is curated and `undefined` is expected for unlisted names.

## 2. `CommandPalette` missing `DialogTitle`/`Description` (a11y) — FIXED 2026-06-23

`CommandDialog` (`src/components/command.tsx`) rendered a Radix `DialogContent` with no `DialogTitle`,
emitting `DialogContent requires a DialogTitle` (error) + a missing-`Description` warning, and leaving
the dialog without an accessible name. Fixed by adding visually-hidden (`sr-only`) `DialogTitle` +
`DialogDescription` (overridable via new optional `title`/`description` props on `CommandDialog`).

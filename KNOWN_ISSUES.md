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

## 3. Consumers cannot render these components under vitest — OPEN 2026-08-17

Rendering any `@abeon/ui` component inside a consumer's vitest suite fails with **"A React Element
from an older version of React was rendered"**, thrown from `updateForwardRef`. The browser build is
unaffected; only the test environment is.

**The obvious diagnosis is wrong, and that matters** — it cost six workarounds in `abeon-auth-ui`
before it was measured. The consumer and this library resolve the *same* React (19.2.8), and elements
created on both sides carry the identical `Symbol(react.transitional.element)`. So it is not two
runtimes, and none of these helped: `resolve.dedupe`, `test.server.deps.inline`, exact-specifier
aliases for `react`/`react-dom`/`react/jsx-runtime`, aliasing `dist/index.js` directly, widening the
peer range to accept React 19, `resolve.preserveSymlinks`.

**What it costs.** `abeon-auth-ui` has no frontend tests at all. Its login screen shipped a defect —
rendering one hardcoded key of the `errors` bag instead of whatever arrived — that no PHP test could
see and that this test would have caught immediately.

**Suggested next step (here, not in consumers):** reproduce inside this repository with a minimal
vitest setup, which removes the symlink and the consumer's config from the picture. Suspects worth
eliminating in order: the dual CJS/ESM `exports` map (which half does vitest load?), `tsup`'s bundled
single-file output, and whether `react/jsx-runtime` is resolved consistently for the bundle and the
test file.

## 4. The barrel does not tree-shake — OPEN 2026-08-17

A consumer importing three components gets the whole library. Measured in `abeon-auth-ui`, whose login
screen imports `AuthLayout`, `LoginForm` and `SetPasswordForm`: **811 kB raw / ~247 kB gzip** in the
shared chunk. That is the platform's front door.

`sideEffects: ["**/*.css"]` was tried and changed nothing, so the cause is not missing metadata — it is
that `tsup` emits one bundled file, which Rollup cannot prune across. The fix is `splitting: true` or
`preserveModules` in `tsup.config.ts`, which changes the output shape for every consumer and so wants
doing deliberately rather than in passing.

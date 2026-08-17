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

## 3. Consumers cannot render these components under vitest — FIXED 2026-08-17

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

**The actual cause, found by tracing rather than guessing.** `dist/` lives outside any
`node_modules`, so a consumer's vite-node **inlines** it and `resolve.dedupe` puts its `react` import
on the consumer's React 19 — which is why measuring the element symbols showed them matching and sent
the investigation the wrong way. But the bundle's *own* dependencies (`lucide-react`, the Radix
primitives) resolve to `abeon-ui/node_modules/…`, which **is** inside a `node_modules`, so vitest
externalises them and Node's resolver takes over. Node walks up and finds this package's own
`react@18.3.1`. Lucide icons are `forwardRef` components, so a React 18 element ends up inside a
React 19 tree — thrown from `updateForwardRef`, exactly where the stack trace pointed.

`LoginForm` imports `Eye`/`EyeOff`, which is why it was the first thing to fail.

**Fixed** by installing React 19 as an explicit devDependency here, so the copy consumers drag in
through the symlink matches the one they run. The published contract is unchanged — the peer range
already accepts `^18 || ^19`.

**Caveat that came with it.** `next-themes@0.3` and `react-day-picker@8` both cap their React peer at
18, so the dev install needs `--legacy-peer-deps`. That is a real inconsistency in this package's
dependency set and worth resolving on its own; it does not affect consumers, whose installs are
clean.

## 4. The barrel does not tree-shake — FIXED 2026-08-17

A consumer importing three components gets the whole library. Measured in `abeon-auth-ui`, whose login
screen imports `AuthLayout`, `LoginForm` and `SetPasswordForm`: **811 kB raw / ~247 kB gzip** in the
shared chunk. That is the platform's front door.

`sideEffects` alone changed nothing, and neither did `splitting: true` — with a single entry there is
nothing to split. The fix is `bundle: false` with a glob entry, so `dist/` mirrors `src/` and a
consumer's bundler has module boundaries to prune along, plus `sideEffects: ["**/*.css"]` to let it
act on them.

Measured, total gzipped JavaScript:

| Consumer | Before | After |
|---|---|---|
| `abeon-auth-ui` (login screen — three components) | 264 kB in one library chunk | **11.9 kB** |
| `abeon-boilerplate-inertia` (full chrome) | 448 kB | **253 kB** |

Both consumers keep passing: `tsc`, build, and their PHP and vitest suites.

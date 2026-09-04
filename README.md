# @abeon/ui

Abeon Design System — shadcn/ui components, CSS tokens, and Tailwind preset for all Abeon modules.

Provides ~55 React components, a `tokens.css` file with 47 CSS custom properties (`:root` + `.dark`), and a Tailwind v3 preset that maps design tokens to utility classes.

---

## Installation

The package is published to GitHub Packages. You need a GitHub Personal Access Token with `read:packages` scope to install it.

**1. Configure npm to use GitHub Packages for the `@abeon` scope.**

Add to your project's `.npmrc` (commit this file):

```
@abeon:registry=https://npm.pkg.github.com/
```

Add to your developer machine's `~/.npmrc` (do NOT commit this file):

```
//npm.pkg.github.com/:_authToken=YOUR_PAT_WITH_READ_PACKAGES
```

Generate a PAT at: GitHub.com → Settings → Developer settings → Personal access tokens (classic) → Generate new token → check `read:packages` scope.

**2. Install the package.**

```bash
npm install @abeon/ui
```

---

## Setup

### 1. Import CSS tokens

In your app entry point (e.g. `main.tsx` or `globals.css`):

```ts
import "@abeon/ui/dist/tokens.css";
```

This imports only `:root` and `.dark` variable declarations — no `@tailwind` directives, no side effects.

### 2. Add the Tailwind preset to your config

```ts
// tailwind.config.ts
import preset from "@abeon/ui/tailwind.preset";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [preset],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
};

export default config;
```

The preset registers all design tokens as Tailwind utilities (e.g. `bg-primary`, `text-muted-foreground`, `border-border`). The preset's own `content` path points to `@abeon/ui/dist/` so component classes are never purged from your production build.

---

## Usage

```tsx
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle } from "@abeon/ui";

export function MyComponent() {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Example</DialogTitle>
        </DialogHeader>
        <Input placeholder="Type something..." />
        <Button>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}
```

All exports come by name from the single `@abeon/ui` barrel — **420 of them** across roughly 130
modules. The table below is a selection, not an inventory; `src/index.ts` is the list of record.

### Available exports (selected)

| Export | Source component |
|--------|-----------------|
| `Button` | button.tsx |
| `Input`, `SearchInput` | input.tsx |
| `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogClose`, `DialogOverlay`, `DialogPortal` | dialog.tsx |
| `Sidebar`, `SidebarProvider`, `SidebarContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` | sidebar.tsx |
| `RichTextEditor` | rich-text-editor.tsx |
| `Chip` | chip.tsx |
| `EmptyState` | empty-state.tsx |
| `Badge`, `StatusBadge` | badge.tsx |
| `Card`, `CardContent`, `CardHeader`, `CardTitle`, `StatCard` | card.tsx |
| `DatePicker` | date-picker.tsx |
| `DateRangePicker`, `DateRange` (type) | date-range-picker.tsx |
| `MultiSelect`, `MultiSelectOption` (type) | multi-select.tsx |
| `Combobox`, `ComboboxOption` (type) | combobox.tsx |
| `Spinner` | spinner.tsx |
| `Heading`, `Text`, `Code`, `Link` | typography.tsx |
| `Alert`, `AlertTitle`, `AlertDescription` (`info`/`success`/`warning`/`danger` variants) | alert.tsx |
| `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` | form.tsx |
| `Toaster` | toaster.tsx (shadcn toast) |
| `Sonner` | sonner.tsx (sonner toast) |
| `cn` | lib/utils.ts |
| `useToast`, `toast` | lib/use-toast.ts |
| `useIsMobile` | lib/use-mobile.ts |
| `AuthLayout` | layout/auth-layout.tsx — centred card for screens with no session |
| `LoginForm` | layout/login-form.tsx |
| `ForgotPasswordForm` | layout/forgot-password-form.tsx |
| `SetPasswordForm` | layout/set-password-form.tsx — invitation acceptance, password reset |

**The four pre-auth components are presentational only** (ADR-0027). Each renders a real
`<form method action>` with named fields and a `hiddenFields` slot, so it submits without JavaScript
and the host keeps the routing, the CSRF token, the POST and the redirect. They hold no route and make
no call. `abeon-auth-ui` is the consumer.

---

## Consumer `tailwind.config.ts` example

```ts
import preset from "@abeon/ui/tailwind.preset";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  presets: [preset],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
};

export default config;
```

The `darkMode: "class"` setting enables the `.dark` class strategy used by the tokens.

---

## Local developer setup

Neither consumer uses `npm link`. Both declare a `file:` dependency on the real package name and
alias it to `@abeon/ui` at build time, which survives a reinstall and does not need relinking:

```jsonc
// package.json
"dependencies": {
    "@cyberstudio-software-house/ui": "file:../../abeon-ui"
}
```

```ts
// vite.config.ts — and mirror it in vitest.config.ts, or tests resolve differently
resolve: { alias: { '@abeon/ui': '@cyberstudio-software-house/ui' } }
```

Two things the consumers also need, both easy to miss:

- **`tailwind.config.ts` must import the preset by the real package name** — a Vite alias does not
  apply to Node-side config — and list `./node_modules/@cyberstudio-software-house/ui/dist/**` in
  `content`, or every class this library uses is purged.
- **`dist/` is gitignored**, so a fresh clone needs `npm run build` here before a consumer resolves
  anything. That includes CI.

`npm install` in a consumer works with React 18 or 19; the peer range accepts both.

To use the published package from GitHub Packages, set `NODE_AUTH_TOKEN` in your environment:

```bash
export NODE_AUTH_TOKEN=ghp_yourPersonalAccessToken
npm install
```

Or add it to your shell profile / CI environment secrets.

---

## Publishing

Publishing is automated via GitHub Actions. To release a new version:

1. Update `"version"` in `package.json` (follow semver).
2. Push to the repository.
3. Create a GitHub Release (tag: `v1.0.0`, title: `v1.0.0`).
4. The `publish.yml` workflow triggers automatically on `release: published`.
5. The workflow runs `npm ci`, `npm run build`, then `npm publish` using `GITHUB_TOKEN` (no manual token needed in CI).

The package appears in GitHub Packages at: `https://github.com/abeon/abeon-ui/pkgs/npm/ui`

---

## Peer dependencies

`react` and `react-dom` are peer dependencies — they are NOT bundled. Your consumer project must provide them:

```bash
npm install react@^18 react-dom@^19   # ^18 and ^19 are both accepted
```

This prevents duplicate React instances and "Invalid hook call" errors.

## `dist/` is built on install

`dist/` is gitignored and `main` points into it, so a consumer that links this package with
`file:` resolves it to a directory that may not exist. `npm ci` then succeeds and every later
build, test and typecheck fails on `Could not resolve ./components/...`, which reads as a broken
package rather than a missing build step.

The `prepare` script closes that: npm runs it for a `file:` dependency, which `prepublishOnly`
does not. Nothing in the platform now depends on somebody remembering to build two sibling
repositories in the right order before touching an application.

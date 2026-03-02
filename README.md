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

All ~55 components are importable by name from the `@abeon/ui` barrel.

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
| `Toaster` | toaster.tsx (shadcn toast) |
| `Sonner` | sonner.tsx (sonner toast) |
| `cn` | lib/utils.ts |
| `useToast`, `toast` | lib/use-toast.ts |
| `useIsMobile` | lib/use-mobile.ts |

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

To install `@abeon/ui` locally from this repository (without publishing to GitHub Packages):

```bash
cd path/to/AbeonUnified/abeon-ui
npm link

cd your-consumer-project
npm link @abeon/ui
```

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
npm install react@^18 react-dom@^18
```

This prevents duplicate React instances and "Invalid hook call" errors.

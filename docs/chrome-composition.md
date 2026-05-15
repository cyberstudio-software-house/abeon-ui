# Chrome composition recipe

`@abeon/ui` ships chrome **components** (`AppShell`, `AppSidebar`, `Topbar`,
`AppSwitcher`, `NotificationCenter`, `UserMenu`, `CommandPalette`, …). It
deliberately does **not** ship a one-line `ChromeProvider` because that
would force every consumer to install `@abeon/shared` and couple the design
system to the data layer.

Apps compose providers + chrome themselves. The recommended stack lives
here so all 16 services agree on the order.

## Recommended provider order

```tsx
// app/layout.tsx (Next.js)  ·  resources/js/Layouts/AppLayout.tsx (Inertia)
import { cookies } from 'next/headers'; // or Inertia equivalent
import { getServerAuthContext } from '@abeon/shared/server';
import {
  AbeonProvider,
  CurrentAppProvider,
  CommandRegistryProvider,
} from '@abeon/shared/react';
import { ABEON_THEME_DEFAULTS } from '@abeon/shared';
import { ThemeProvider } from 'next-themes';
import { AppShell, AppSidebar, Topbar } from '@abeon/ui';

export default async function RootLayout({ children }) {
  const { user } = await getServerAuthContext(cookies());

  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider {...ABEON_THEME_DEFAULTS}>
          <AbeonProvider initialAuth={{ user }}>
            <CurrentAppProvider currentApp="crm">
              <CommandRegistryProvider>
                <ConnectedShell>{children}</ConnectedShell>
              </CommandRegistryProvider>
            </CurrentAppProvider>
          </AbeonProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`ConnectedShell` is per-app glue (a few dozen lines):

```tsx
'use client';
import { useState } from 'react';
import { useAuth, useApps, useAppOrder, useNotifications } from '@abeon/shared/react';
import { crossAppHref } from '@abeon/shared/client';
import {
  AppShell, AppSidebar, Topbar,
  AppSwitcher, NotificationCenter, UserMenu, CommandPalette,
  useCommandPaletteShortcut,
} from '@abeon/ui';

export function ConnectedShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  useCommandPaletteShortcut(() => setPaletteOpen((p) => !p));

  const { user } = useAuth();
  const { apps } = useApps();
  const { order } = useAppOrder();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Map AppDescriptor[] → AppManifest[] (UI shape)
  const manifest = mapDescriptorsToManifests(apps, order);

  return (
    <AppShell
      variant="app"
      collapsed={collapsed}
      sidebar={
        <AppSidebar
          navGroups={/* per-app nav */}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          mobileOpen={mobileOpen}
          onMobileOpenChange={setMobileOpen}
        />
      }
      topbar={
        <Topbar
          apps={manifest}
          currentAppId="crm"
          user={toTopbarUser(user)}
          notifications={notifications.map(toUiNotification)}
          unreadCount={unreadCount}
          sidebarCollapsed={collapsed}
          onNotificationRead={markAsRead}
          onNotificationReadAll={markAllAsRead}
          onSignOut={() => fetch('/api/v1/auth/logout', { method: 'POST' })}
          onMenuOpen={() => setMobileOpen(true)}
        />
      }
    >
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        commands={/* fed by useCommandRegistry() inside this app */}
      />
      {children}
    </AppShell>
  );
}
```

## Why two providers (next-themes + AbeonProvider) and not one

`next-themes` writes a `class="dark"` to `<html>` *during* the React first
paint — it must run as an outermost provider on the server. `AbeonProvider`
needs the user from the server JWT — it must run inside the React tree.
Wrapping `AbeonProvider` with `next-themes` keeps theme switching free of
auth coupling.

## Public variant

For pages that render the public CMS (marketing, blog) the chrome must not
appear. Wrap with `AppShell variant="public"`:

```tsx
<AppShell variant="public" noPadding>
  {children}
</AppShell>
```

It still mounts inside the same `<ThemeProvider>` so theme tokens apply.

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

type TokenRow = { name: string; intent: string };
type TokenGroup = { title: string; description: string; tokens: TokenRow[] };

const groups: TokenGroup[] = [
  {
    title: "Surfaces",
    description: "Page chrome and elevated containers. Use as backgrounds, never as text colors.",
    tokens: [
      { name: "--background", intent: "Page background — the lowest-elevation canvas." },
      { name: "--background-subtle", intent: "Subtly tinted page sections (form blocks, alternate rows)." },
      { name: "--surface", intent: "Default raised surface (cards, panels, list items)." },
      { name: "--surface-elevated", intent: "Higher-elevation surface (modal sheets, dropdown bodies)." },
      { name: "--card", intent: "Card component background." },
      { name: "--card-foreground", intent: "Default text/icon color inside cards." },
      { name: "--popover", intent: "Popover and menu surface background." },
      { name: "--popover-foreground", intent: "Default text/icon color inside popovers and menus." },
    ],
  },
  {
    title: "Foreground / Text",
    description: "Text hierarchy from primary copy down to placeholders.",
    tokens: [
      { name: "--foreground", intent: "Primary text color — body copy and headings." },
      { name: "--foreground-secondary", intent: "Secondary text — subheadings and supporting copy." },
      { name: "--foreground-muted", intent: "Tertiary/muted text — captions, helper text, metadata." },
      { name: "--foreground-placeholder", intent: "Input placeholder text only — do not use for body copy." },
    ],
  },
  {
    title: "Borders & Inputs",
    description: "Dividers, hairlines, and focus rings.",
    tokens: [
      { name: "--border", intent: "Default hairline divider color." },
      { name: "--border-strong", intent: "Higher-contrast borders for selected or active boundaries." },
      { name: "--border-focus", intent: "Focus ring color for keyboard navigation." },
      { name: "--input", intent: "Border color for form inputs in their resting state." },
      { name: "--ring", intent: "Focus ring color used by Radix-based components." },
    ],
  },
  {
    title: "Brand / Primary",
    description: "Primary brand action color and its tinted background variant.",
    tokens: [
      { name: "--primary", intent: "Primary brand action color — default Button, links, primary CTA." },
      { name: "--primary-hover", intent: "Primary hover state." },
      { name: "--primary-active", intent: "Primary pressed/active state." },
      { name: "--primary-foreground", intent: "Text/icon color on top of primary fills." },
      { name: "--primary-muted", intent: "Tinted primary surface — selected rows, muted CTAs, info chips." },
      { name: "--primary-muted-foreground", intent: "Text/icon color on primary-muted surfaces." },
    ],
  },
  {
    title: "Secondary",
    description: "Low-emphasis secondary action surface.",
    tokens: [
      { name: "--secondary", intent: "Low-emphasis secondary action background." },
      { name: "--secondary-hover", intent: "Secondary hover state." },
      { name: "--secondary-foreground", intent: "Text/icon color on secondary fills." },
    ],
  },
  {
    title: "Muted & Accent",
    description: "Subtle neutrals for disabled fills and hovered/selected list rows.",
    tokens: [
      { name: "--muted", intent: "Muted neutral background — skeletons, disabled fills." },
      { name: "--muted-foreground", intent: "Text on muted backgrounds (typically disabled copy)." },
      { name: "--accent", intent: "Subtle accent surface — hovered menu items, selected list rows." },
      { name: "--accent-foreground", intent: "Text/icon color on accent surfaces." },
    ],
  },
  {
    title: "Status — Success",
    description: "Use the solid pair on small marks (badges) and the muted pair on alert surfaces.",
    tokens: [
      { name: "--success", intent: "Solid success accent — success badges, confirmation marks." },
      { name: "--success-foreground", intent: "Text/icon on solid success fills." },
      { name: "--success-muted", intent: "Tinted success surface — success alerts and toasts." },
      { name: "--success-muted-foreground", intent: "Text on tinted success surfaces." },
    ],
  },
  {
    title: "Status — Warning",
    description: "Solid + muted pair for warnings (yellow/amber).",
    tokens: [
      { name: "--warning", intent: "Solid warning accent — warning badges." },
      { name: "--warning-foreground", intent: "Text/icon on solid warning fills." },
      { name: "--warning-muted", intent: "Tinted warning surface — warning alerts and toasts." },
      { name: "--warning-muted-foreground", intent: "Text on tinted warning surfaces." },
    ],
  },
  {
    title: "Status — Danger",
    description: "Solid + muted pair for errors and destructive actions.",
    tokens: [
      { name: "--danger", intent: "Solid danger accent — destructive actions, error badges." },
      { name: "--danger-foreground", intent: "Text/icon on solid danger fills." },
      { name: "--danger-muted", intent: "Tinted danger surface — error alerts and toasts." },
      { name: "--danger-muted-foreground", intent: "Text on tinted danger surfaces." },
    ],
  },
  {
    title: "Legacy / shadcn compatibility",
    description: "Aliases retained so unmodified shadcn components still resolve. Prefer --danger / --danger-foreground for new code.",
    tokens: [
      { name: "--destructive", intent: "shadcn-compatible alias for --danger. Same value." },
      { name: "--destructive-foreground", intent: "shadcn-compatible alias for --danger-foreground." },
    ],
  },
  {
    title: "Sidebar",
    description: "Color slots used by sidebar.tsx. Themed independently from the main surface so the sidebar can stay light in a dark page or vice versa.",
    tokens: [
      { name: "--sidebar-background", intent: "Sidebar surface." },
      { name: "--sidebar-foreground", intent: "Default sidebar text color." },
      { name: "--sidebar-primary", intent: "Sidebar active item background." },
      { name: "--sidebar-primary-foreground", intent: "Text on sidebar active item." },
      { name: "--sidebar-accent", intent: "Sidebar hover / selected item background." },
      { name: "--sidebar-accent-foreground", intent: "Text on sidebar hover / selected item." },
      { name: "--sidebar-border", intent: "Sidebar divider color." },
      { name: "--sidebar-ring", intent: "Sidebar focus ring." },
      { name: "--sidebar-muted", intent: "Muted sidebar text — group labels, captions." },
    ],
  },
  {
    title: "Charts",
    description: "Categorical color slots consumed by recharts-based components. Order matters — assign in sequence.",
    tokens: [
      { name: "--chart-1", intent: "First categorical chart color." },
      { name: "--chart-2", intent: "Second categorical chart color." },
      { name: "--chart-3", intent: "Third categorical chart color." },
      { name: "--chart-4", intent: "Fourth categorical chart color." },
      { name: "--chart-5", intent: "Fifth categorical chart color." },
    ],
  },
  {
    title: "Geometry",
    description: "Non-color tokens.",
    tokens: [
      { name: "--radius", intent: "Base border-radius scale. The preset derives sm / md / lg / xl from this value." },
    ],
  },
];

const allDeclaredNames = groups.flatMap((g) => g.tokens.map((t) => t.name));
const KNOWN_TOTAL = 59;
if (allDeclaredNames.length !== KNOWN_TOTAL) {
  console.warn(
    `[Foundations/Tokens] Declared ${allDeclaredNames.length} tokens, expected ${KNOWN_TOTAL}. ` +
      "Update tokens.css and this story together when adding/removing tokens.",
  );
}

type ResolvedValues = Record<string, { light: string; dark: string }>;

function useResolvedTokenValues(names: string[]): ResolvedValues {
  const [values, setValues] = React.useState<ResolvedValues>({});
  React.useEffect(() => {
    const lightProbe = document.createElement("div");
    lightProbe.style.position = "absolute";
    lightProbe.style.visibility = "hidden";
    lightProbe.style.pointerEvents = "none";
    document.body.appendChild(lightProbe);

    const darkProbe = document.createElement("div");
    darkProbe.className = "dark";
    darkProbe.style.position = "absolute";
    darkProbe.style.visibility = "hidden";
    darkProbe.style.pointerEvents = "none";
    document.body.appendChild(darkProbe);

    const lightStyle = getComputedStyle(lightProbe);
    const darkStyle = getComputedStyle(darkProbe);
    const next: ResolvedValues = {};
    for (const name of names) {
      next[name] = {
        light: lightStyle.getPropertyValue(name).trim(),
        dark: darkStyle.getPropertyValue(name).trim(),
      };
    }
    setValues(next);

    document.body.removeChild(lightProbe);
    document.body.removeChild(darkProbe);
  }, [names]);
  return values;
}

function Swatch({ name, scope }: { name: string; scope: "light" | "dark" }) {
  const className = scope === "dark" ? "dark" : "";
  if (name === "--radius") {
    return (
      <div className={className}>
        <div
          style={{
            width: 32,
            height: 32,
            background: "hsl(var(--primary))",
            borderRadius: "var(--radius)",
            border: "1px solid hsl(var(--border))",
          }}
        />
      </div>
    );
  }
  return (
    <div className={className}>
      <div
        style={{
          width: 32,
          height: 32,
          background: `hsl(var(${name}))`,
          borderRadius: 4,
          border: "1px solid hsl(var(--border))",
        }}
      />
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid hsl(var(--border))",
  verticalAlign: "middle",
  textAlign: "left",
};
const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 600,
  fontSize: 12,
  color: "hsl(var(--foreground-muted))",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};
const tokenCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 13,
  whiteSpace: "nowrap",
};
const valueCellStyle: React.CSSProperties = {
  ...tokenCellStyle,
  color: "hsl(var(--foreground-secondary))",
};

function GroupTable({ group, values }: { group: TokenGroup; values: ResolvedValues }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{group.title}</h2>
      <p style={{ color: "hsl(var(--foreground-muted))", marginBottom: 12, fontSize: 14 }}>
        {group.description}
      </p>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "hsl(var(--background-subtle))" }}>
            <th style={headerCellStyle}>Token</th>
            <th style={headerCellStyle}>Light</th>
            <th style={headerCellStyle}>Light value</th>
            <th style={headerCellStyle}>Dark</th>
            <th style={headerCellStyle}>Dark value</th>
            <th style={{ ...headerCellStyle, whiteSpace: "normal" }}>Intent</th>
          </tr>
        </thead>
        <tbody>
          {group.tokens.map((row) => {
            const resolved = values[row.name];
            const light = resolved?.light ?? "";
            const dark = resolved?.dark ?? "";
            const inheritedInDark = resolved && light === dark && light !== "";
            return (
              <tr key={row.name}>
                <td style={tokenCellStyle}>{row.name}</td>
                <td style={cellStyle}>
                  <Swatch name={row.name} scope="light" />
                </td>
                <td style={valueCellStyle}>{light || "—"}</td>
                <td style={cellStyle}>
                  <Swatch name={row.name} scope="dark" />
                </td>
                <td style={valueCellStyle}>
                  {inheritedInDark ? (
                    <span style={{ color: "hsl(var(--foreground-muted))" }}>(inherited)</span>
                  ) : (
                    dark || "—"
                  )}
                </td>
                <td
                  style={{
                    ...cellStyle,
                    fontSize: 13,
                    color: "hsl(var(--foreground-secondary))",
                  }}
                >
                  {row.intent}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function TokensPage({ filter }: { filter?: string }) {
  const visibleGroups = React.useMemo(
    () =>
      filter
        ? groups.filter((g) => g.title.toLowerCase().includes(filter.toLowerCase()))
        : groups,
    [filter],
  );
  const allNames = React.useMemo(
    () => visibleGroups.flatMap((g) => g.tokens.map((t) => t.name)),
    [visibleGroups],
  );
  const values = useResolvedTokenValues(allNames);

  return (
    <div
      style={{
        padding: 32,
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        minHeight: "100vh",
        fontFamily:
          'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header style={{ marginBottom: 32, maxWidth: 800 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Design tokens</h1>
        <p style={{ color: "hsl(var(--foreground-secondary))", lineHeight: 1.5 }}>
          Every CSS custom property exposed by <code>tokens.css</code>, grouped by intent.
          Light and dark values are read live at runtime, so this page stays in sync with the
          source of truth. Toggle the Storybook theme to see how the surrounding page reacts;
          the per-row dark swatches always show the <code>.dark</code> value regardless.
        </p>
      </header>
      {visibleGroups.map((group) => (
        <GroupTable key={group.title} group={group} values={values} />
      ))}
    </div>
  );
}

const meta: Meta<typeof TokensPage> = {
  title: "Foundations/Tokens",
  component: TokensPage,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof TokensPage>;

export const All: Story = {};

export const Surfaces: Story = { args: { filter: "Surfaces" } };
export const Foreground: Story = { args: { filter: "Foreground" } };
export const Borders: Story = { args: { filter: "Borders" } };
export const Brand: Story = { args: { filter: "Brand" } };
export const Status: Story = { args: { filter: "Status" } };
export const Sidebar: Story = { args: { filter: "Sidebar" } };
export const Charts: Story = { args: { filter: "Charts" } };

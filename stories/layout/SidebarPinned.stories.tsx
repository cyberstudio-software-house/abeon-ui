import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  SidebarPinnedSection,
  type PinnedItem,
  type PinnedSection,
} from "../../src/components/layout/sidebar-pinned-section";
import {
  NavItemActions,
  type PinItemPayload,
} from "../../src/components/layout/nav-item-actions";
import { SidebarPinnedSections } from "../../src/components/layout/sidebar-pinned-sections";
import { TooltipProvider } from "../../src/components/tooltip";
import { Button } from "../../src/components/button";

const sectionDefault: PinnedSection = {
  id: "default",
  label: "Przypięte",
  order: 0,
};
const sectionProjects: PinnedSection = {
  id: "projects",
  label: "Projekty",
  order: 1,
};

const initial: PinnedItem[] = [
  { id: "p1", label: "Nowe leady", href: "/crm/leads", iconName: "Star", sectionId: "default", order: 0, isActive: true },
  { id: "p2", label: "Faktury do zapłaty", href: "/finance/invoices", iconName: "Receipt", sectionId: "default", order: 1 },
  { id: "p3", label: "Helpdesk inbox", href: "/helpdesk", iconName: "MessageSquare", sectionId: "default", order: 2 },
  { id: "p4", label: "Migracja CRM", href: "/projects/crm", iconName: "FolderTree", sectionId: "projects", order: 0 },
  { id: "p5", label: "Rebranding", href: "/projects/rebrand", iconName: "Star", sectionId: "projects", order: 1 },
];

function SidebarFrame({
  collapsed = false,
  children,
}: {
  collapsed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={
          "h-[600px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border " +
          (collapsed ? "w-[72px]" : "w-[260px]")
        }
      >
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border text-sm font-semibold">
          {collapsed ? "A" : "Abeon"}
        </div>
        <div className={collapsed ? "px-2 py-2" : "px-2 py-2"}>{children}</div>
      </aside>
    </TooltipProvider>
  );
}

const meta: Meta = {
  title: "Layout/SidebarPinned",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const SinglePinnedSection: Story = {
  render: () => {
    const [items, setItems] = React.useState(initial.filter((i) => i.sectionId === "default"));
    return (
      <SidebarFrame>
        <SidebarPinnedSection
          section={sectionDefault}
          items={items}
          onReorder={setItems}
          onUnpin={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
          labels={{
            unpinTitle: "Odepnij",
            editSectionTitle: "Zmień nazwę",
            removeSectionTitle: "Usuń sekcję",
          }}
        />
      </SidebarFrame>
    );
  },
};

export const MultipleSections: Story = {
  render: () => {
    const [allItems, setAllItems] = React.useState(initial);
    const [sections, setSections] = React.useState<PinnedSection[]>([
      sectionDefault,
      sectionProjects,
    ]);

    const onReorderInSection = (sectionId: string) => (next: PinnedItem[]) => {
      const others = allItems.filter((i) => i.sectionId !== sectionId);
      setAllItems([...others, ...next]);
    };

    return (
      <SidebarFrame>
        {sections.map((s) => (
          <SidebarPinnedSection
            key={s.id}
            section={s}
            items={allItems.filter((i) => i.sectionId === s.id)}
            onReorder={onReorderInSection(s.id)}
            onUnpin={(id) => setAllItems((prev) => prev.filter((i) => i.id !== id))}
            onRenameSection={(label) =>
              setSections((prev) => prev.map((x) => (x.id === s.id ? { ...x, label } : x)))
            }
            onRemoveSection={
              s.id !== "default"
                ? () => {
                    setSections((prev) => prev.filter((x) => x.id !== s.id));
                    setAllItems((prev) => prev.filter((i) => i.sectionId !== s.id));
                  }
                : undefined
            }
            labels={{
              unpinTitle: "Odepnij",
              editSectionTitle: "Zmień nazwę",
              removeSectionTitle: "Usuń sekcję",
            }}
          />
        ))}
      </SidebarFrame>
    );
  },
};

export const Collapsed: Story = {
  render: () => {
    const [items, setItems] = React.useState(initial.filter((i) => i.sectionId === "default"));
    return (
      <SidebarFrame collapsed>
        <SidebarPinnedSection
          section={sectionDefault}
          items={items}
          collapsed
          onReorder={setItems}
          onUnpin={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        />
      </SidebarFrame>
    );
  },
};

export const NavItemActionsDemo: Story = {
  render: () => {
    const [pinned, setPinned] = React.useState<PinItemPayload[]>([]);
    const items = [
      { id: "leads", label: "Nowe leady", href: "/crm/leads" },
      { id: "deals", label: "Szanse sprzedaży", href: "/crm/deals" },
      { id: "contacts", label: "Kontakty", href: "/crm/contacts" },
    ];
    return (
      <div className="p-6">
        <h3 className="font-semibold mb-3">Hover an item to see the pin action</h3>
        <ul className="space-y-1 max-w-[280px] bg-sidebar text-sidebar-foreground rounded-lg p-2 border border-sidebar-border">
          {items.map((it) => {
            const isPinned = pinned.some((p) => p.id === it.id);
            return (
              <li
                key={it.id}
                className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent"
              >
                <span className="flex-1 text-sm">{it.label}</span>
                <NavItemActions
                  itemId={it.id}
                  itemLabel={it.label}
                  itemHref={it.href}
                  isPinned={isPinned}
                  onPin={(payload) => setPinned((p) => [...p, payload])}
                  onUnpin={() => setPinned((p) => p.filter((x) => x.id !== it.id))}
                  labels={{
                    triggerLabel: "Akcje",
                    pinAction: "Przypnij do menu",
                    unpinAction: "Odepnij",
                    pinDialog: {
                      title: "Przypnij do menu",
                      nameLabel: "Nazwa",
                      namePlaceholder: "Nazwa pozycji",
                      iconLabel: "Ikona",
                      changeIconButton: "Zmień ikonę",
                      cancel: "Anuluj",
                      confirm: "Przypnij",
                    },
                  }}
                />
              </li>
            );
          })}
        </ul>
        {pinned.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-foreground-muted mb-2">Aktualnie przypięte:</p>
            <pre className="text-xs bg-muted/40 p-2 rounded">
              {JSON.stringify(pinned, null, 2)}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setPinned([])}
            >
              Wyczyść
            </Button>
          </div>
        )}
      </div>
    );
  },
};

export const SectionsWithDragBetweenThem: Story = {
  name: "Sections — drag between them, empty section, captions (PL)",
  render: () => {
    const [sections, setSections] = React.useState<PinnedSection[]>([
      sectionDefault,
      sectionProjects,
      { id: "empty", label: "Nowa sekcja", order: 2 },
    ]);
    const [items, setItems] = React.useState<PinnedItem[]>(
      initial.map((item) => (item.id === "p2" ? { ...item, caption: "Finanse" } : item))
    );

    return (
      <SidebarFrame>
        <SidebarPinnedSections
          sections={sections}
          items={items}
          onArrange={(arrangement) =>
            setItems((current) =>
              arrangement.flatMap(({ id, sectionId, order }) => {
                const item = current.find((i) => i.id === id);
                return item ? [{ ...item, sectionId, order }] : [];
              })
            )
          }
          onUnpin={(id) => setItems((current) => current.filter((i) => i.id !== id))}
          onAddSection={(label) =>
            setSections((current) => [...current, { id: `s-${current.length}`, label, order: current.length }])
          }
          onRenameSection={(id, label) =>
            setSections((current) => current.map((s) => (s.id === id ? { ...s, label } : s)))
          }
          onRemoveSection={(id) => {
            setSections((current) => current.filter((s) => s.id !== id));
            setItems((current) => current.map((i) => (i.sectionId === id ? { ...i, sectionId: "default" } : i)));
          }}
          labels={{
            unpin: "Odepnij",
            dragHandle: "Przeciągnij",
            renameSection: "Zmień nazwę sekcji",
            removeSection: "Usuń sekcję",
            save: "Zapisz",
            cancel: "Anuluj",
            addSection: "Dodaj sekcję",
            newSectionPlaceholder: "Nazwa sekcji",
            emptySectionHint: "Przeciągnij tu pinezkę",
          }}
        />
      </SidebarFrame>
    );
  },
};

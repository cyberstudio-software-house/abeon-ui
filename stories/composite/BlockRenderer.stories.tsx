import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BlockRenderer,
  createBlockRegistry,
  type BlockBase,
} from "../../src/components/block-renderer";

interface HeroBlock extends BlockBase {
  type: "hero";
  props: { title: string; subtitle: string };
}

interface CalloutBlock extends BlockBase {
  type: "callout";
  props: { text: string; tone: "info" | "warning" };
}

interface QuoteBlock extends BlockBase {
  type: "quote";
  props: { text: string; author: string };
}

type DemoBlock = HeroBlock | CalloutBlock | QuoteBlock;

const registry = createBlockRegistry<DemoBlock>();

registry.register<HeroBlock>("hero", ({ block }) => (
  <section className="bg-gradient-to-br from-primary/90 to-primary/60 text-primary-foreground py-16 px-8 text-center">
    <h2 className="text-3xl font-bold">{block.props.title}</h2>
    <p className="mt-2 opacity-90">{block.props.subtitle}</p>
  </section>
));

registry.register<CalloutBlock>("callout", ({ block }) => (
  <aside
    className={
      block.props.tone === "warning"
        ? "border-l-4 border-warning bg-warning/10 px-6 py-4 my-4"
        : "border-l-4 border-primary bg-primary/10 px-6 py-4 my-4"
    }
  >
    {block.props.text}
  </aside>
));

registry.register<QuoteBlock>("quote", ({ block }) => (
  <blockquote className="border-l-4 border-border px-6 py-4 my-4 italic">
    "{block.props.text}"
    <footer className="mt-2 text-sm text-foreground-muted not-italic">
      — {block.props.author}
    </footer>
  </blockquote>
));

const blocks: DemoBlock[] = [
  {
    id: "hero",
    type: "hero",
    order: 0,
    props: { title: "Witaj w naszym CMS", subtitle: "Buduj strony z gotowych bloków" },
  },
  {
    id: "callout-1",
    type: "callout",
    order: 1,
    props: { text: "Ten blok jest renderowany przez registry — nie przez switch.", tone: "info" },
  },
  {
    id: "quote-1",
    type: "quote",
    order: 2,
    props: { text: "Składalność > konfiguracja.", author: "Ktoś mądry" },
  },
  {
    id: "callout-2",
    type: "callout",
    order: 3,
    props: { text: "Możesz dodać własne typy bloków bez zmian w bibliotece.", tone: "warning" },
  },
];

const meta: Meta<typeof BlockRenderer<DemoBlock>> = {
  title: "Composite/BlockRenderer",
  component: BlockRenderer<DemoBlock>,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof BlockRenderer<DemoBlock>>;

export const Default: Story = {
  render: () => <BlockRenderer blocks={blocks} registry={registry} />,
};

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string | null>("callout-1");
    return (
      <BlockRenderer
        blocks={blocks}
        registry={registry}
        selectedBlockId={selected}
        onBlockClick={setSelected}
      />
    );
  },
};

export const UnknownBlockFallback: Story = {
  render: () => {
    const blocksWithUnknown: DemoBlock[] = [
      ...blocks,
      // @ts-expect-error — intentional unknown type to exercise the fallback
      { id: "x", type: "carousel", order: 4, props: {} },
    ];
    return (
      <BlockRenderer
        blocks={blocksWithUnknown}
        registry={registry}
        fallback={(b) => (
          <div className="bg-danger/10 border border-danger/30 text-danger px-6 py-4 my-4 text-sm">
            Niezarejestrowany typ bloku: <code>{b.type}</code>
          </div>
        )}
      />
    );
  },
};

export const Empty: Story = {
  render: () => <BlockRenderer blocks={[]} registry={registry} />,
};

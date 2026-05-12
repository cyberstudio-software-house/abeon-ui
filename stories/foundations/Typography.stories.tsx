import type { Meta, StoryObj } from "@storybook/react";
import { Heading, Text, Code, Link } from "../../src/components/typography";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const Page = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: 32,
      background: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      minHeight: "100vh",
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    }}
  >
    {children}
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 32, maxWidth: 720 }}>
    <Heading level={3} className="mb-3">
      {title}
    </Heading>
    <div className="flex flex-col gap-3">{children}</div>
  </section>
);

export const Headings: Story = {
  render: () => (
    <Page>
      <Section title="Heading levels (default sizes)">
        <Heading level={1}>Heading 1 — page title</Heading>
        <Heading level={2}>Heading 2 — section</Heading>
        <Heading level={3}>Heading 3 — subsection</Heading>
        <Heading level={4}>Heading 4 — group label</Heading>
        <Heading level={5}>Heading 5 — minor heading</Heading>
        <Heading level={6}>Heading 6 — caption-level heading</Heading>
      </Section>
      <Section title="Custom size override (level vs size are independent)">
        <Heading level={2} size="lg">
          h2 element rendered at size=lg
        </Heading>
        <Heading level={4} size="2xl">
          h4 element rendered at size=2xl
        </Heading>
      </Section>
    </Page>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <Page>
      <Section title="Variants">
        <Text variant="body">Body — default paragraph copy at 14px / 20px line height.</Text>
        <Text variant="body-sm">Body-sm — smaller paragraph copy at 13px / 18px.</Text>
        <Text variant="caption">Caption — 12px helper text and metadata.</Text>
        <Text variant="label">Label — uppercase form labels and section markers</Text>
      </Section>
      <Section title="Tones">
        <Text tone="default">Default foreground</Text>
        <Text tone="secondary">Secondary foreground</Text>
        <Text tone="muted">Muted foreground</Text>
        <Text tone="placeholder">Placeholder foreground</Text>
        <Text tone="primary">Primary brand</Text>
        <Text tone="success">Success</Text>
        <Text tone="warning">Warning</Text>
        <Text tone="danger">Danger</Text>
      </Section>
      <Section title="Weights">
        <Text weight="regular">Regular weight</Text>
        <Text weight="medium">Medium weight</Text>
        <Text weight="semibold">Semibold weight</Text>
        <Text weight="bold">Bold weight</Text>
      </Section>
      <Section title="Element override (`as` and `asChild`)">
        <Text as="span">Rendered as &lt;span&gt;</Text>
        <Text as="div">Rendered as &lt;div&gt;</Text>
        <Text asChild>
          <em>asChild — rendered as &lt;em&gt; via Radix Slot</em>
        </Text>
      </Section>
    </Page>
  ),
};

export const InlineAndBlockCode: Story = {
  render: () => (
    <Page>
      <Section title="Inline code">
        <Text>
          Install the package with <Code>npm install @cyberstudio-software-house/ui</Code> and import
          tokens from <Code>@cyberstudio-software-house/ui/dist/tokens.css</Code>.
        </Text>
      </Section>
      <Section title="Block code">
        <Code block>
{`import { Button } from "@cyberstudio-software-house/ui";

export function Example() {
  return <Button>Submit</Button>;
}`}
        </Code>
      </Section>
    </Page>
  ),
};

export const Links: Story = {
  render: () => (
    <Page>
      <Section title="Inline links (within prose)">
        <Text>
          Read the <Link href="#">documentation</Link> or jump to the{" "}
          <Link href="#" variant="subtle">
            installation guide
          </Link>
          . You can also <Link href="#" variant="muted">browse the source on GitHub</Link>.
        </Text>
      </Section>
      <Section title="Standalone link">
        <Link href="#" variant="standalone">
          → View all components
        </Link>
      </Section>
      <Section title="asChild — for routing libraries">
        <Text variant="body-sm" tone="muted">
          Wrap your routing component (e.g. Next.js Link) by passing{" "}
          <Code>asChild</Code>:
        </Text>
        <Link asChild>
          <button type="button" onClick={() => alert("Routed via custom element")}>
            Custom routed element rendered as a button
          </button>
        </Link>
      </Section>
    </Page>
  ),
};

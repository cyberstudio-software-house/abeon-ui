import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../src/components/accordion";

const meta: Meta<typeof Accordion> = {
  title: "Primitives/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Accordion>;

const faqs = [
  {
    q: "Jak długo trwa rejestracja konta?",
    a: "Założenie konta zajmuje około 2 minuty. Wymagamy potwierdzenia adresu e-mail po pierwszym logowaniu.",
  },
  {
    q: "Czy mogę zmienić plan w trakcie miesiąca?",
    a: "Tak. Zmiana planu obowiązuje natychmiast, a różnica w cenie jest naliczana proporcjonalnie do dni pozostałych w okresie rozliczeniowym.",
  },
  {
    q: "Czy oferujecie plan dla zespołów non-profit?",
    a: "Tak — organizacje pożytku publicznego mogą zgłosić się o 50% rabatu na dowolny plan. Skontaktuj się z naszym zespołem sprzedaży.",
  },
];

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[640px]">
      {faqs.map((f, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[640px]" defaultValue={["item-0", "item-2"]}>
      {faqs.map((f, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[640px]">
      <AccordionItem value="open">
        <AccordionTrigger>Sekcja dostępna</AccordionTrigger>
        <AccordionContent>Treść widoczna po rozwinięciu.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="locked" disabled>
        <AccordionTrigger>Sekcja zablokowana</AccordionTrigger>
        <AccordionContent>Tej treści nie zobaczysz.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

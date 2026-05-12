import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../../src/components/select";

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Wybierz status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Aktywny</SelectItem>
          <SelectItem value="pending">Oczekujący</SelectItem>
          <SelectItem value="archived">Archiwum</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Grouped: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Wybierz strefę czasową" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Europa</SelectLabel>
            <SelectItem value="warsaw">Warszawa (UTC+1)</SelectItem>
            <SelectItem value="london">Londyn (UTC+0)</SelectItem>
            <SelectItem value="berlin">Berlin (UTC+1)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Ameryka</SelectLabel>
            <SelectItem value="ny">Nowy Jork (UTC−5)</SelectItem>
            <SelectItem value="sf">San Francisco (UTC−8)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Select disabled defaultValue="pending">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Oczekujący</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const LongList: Story = {
  render: () => {
    const months = [
      "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec",
      "Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień",
    ];
    return (
      <div className="w-64">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz miesiąc" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
};

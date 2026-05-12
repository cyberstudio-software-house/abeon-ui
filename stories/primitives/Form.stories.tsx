import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../src/components/form";
import { Input } from "../../src/components/input";
import { Button } from "../../src/components/button";

const meta: Meta = {
  title: "Primitives/Form",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj;

type DemoValues = { email: string; nickname: string };

const Demo = () => {
  const form = useForm<DemoValues>({
    defaultValues: { email: "", nickname: "" },
    mode: "onSubmit",
  });

  const onSubmit = form.handleSubmit(() => {});

  const triggerError = () => {
    form.setError("email", { message: "Adres e-mail jest wymagany." });
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} style={{ width: 360 }} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Adres e-mail jest wymagany." }}
          render={({ field }) => (
            <FormItem required>
              <FormLabel>Adres e-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" required {...field} />
              </FormControl>
              <FormDescription>Użyjemy go tylko do wysyłki potwierdzeń.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pseudonim (opcjonalny)</FormLabel>
              <FormControl>
                <Input placeholder="Jak Cię nazywać?" {...field} />
              </FormControl>
              <FormDescription>Pojawi się w komentarzach i wzmiankach.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">Zapisz</Button>
          <Button type="button" variant="outline" onClick={triggerError}>
            Wymuś błąd
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const RequiredAndOptional: Story = {
  render: () => <Demo />,
};

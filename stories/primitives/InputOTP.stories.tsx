import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../src/components/input-otp";
import { Label } from "../../src/components/label";

const meta: Meta<typeof InputOTP> = {
  title: "Primitives/InputOTP",
  component: InputOTP,
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof InputOTP>;

export const SixDigit: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <div className="space-y-2">
        <Label>Kod weryfikacyjny</Label>
        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p className="text-xs text-foreground-muted">Wpisany kod: {value || "—"}</p>
      </div>
    );
  },
};

export const WithSeparator: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <div className="space-y-2">
        <Label>Kod 6-cyfrowy z separatorem</Label>
        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    );
  },
};

export const FourDigit: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <InputOTP maxLength={4} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <InputOTP maxLength={6} disabled>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
};

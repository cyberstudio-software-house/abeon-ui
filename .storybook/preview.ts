import * as React from "react";
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { TooltipProvider } from "../src/components/tooltip";
import "../tokens.css";
import "../src/storybook.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story) =>
      React.createElement(
        TooltipProvider,
        { delayDuration: 0 },
        React.createElement(Story),
      ),
  ],
  parameters: {
    layout: "centered",
  },
};

export default preview;

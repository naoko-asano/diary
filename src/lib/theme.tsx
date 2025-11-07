"use client";

import { colorsTuple, createTheme, TextInput } from "@mantine/core";

export const theme = createTheme({
  colors: {
    purple: [
      "#faedff",
      "#edd9f7",
      "#d8b1ea",
      "#c186dd",
      "#ae62d2",
      "#a34bcb",
      "#9d3fc9",
      "#8931b2",
      "#7a2aa0",
      "#6b218d",
    ],
    error: colorsTuple("#e03131"),
  },
  primaryColor: "purple",
  breakpoints: {
    xs: "30em", // 480px
    sm: "48em", // 768px
    md: "64em", // 1024px
    lg: "80em", // 1280px
    xl: "96em", // 1536px
  },
  fontSizes: {
    xs: "16px",
    sm: "24px",
    md: "32px",
    lg: "48px",
    xl: "60px",
  },
  spacing: {
    xs: "8px",
    sm: "16px",
    md: "32px",
    lg: "64px",
    xl: "128px",
  },
  components: {
    TextInput: TextInput.extend({
      styles: {
        error: { fontSize: "var(--mantine-font-size-xs)" },
      },
    }),
  },
});

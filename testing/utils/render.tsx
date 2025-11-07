import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { render as testingLibraryRender } from "@testing-library/react";

export function render(ui: React.ReactNode) {
  return testingLibraryRender(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider env="test">
        <Notifications position="top-left" />
        {children}
      </MantineProvider>
    ),
  });
}

import { notifications } from "@mantine/notifications";
import { beforeEach, describe, expect, it } from "vitest";

import { render, screen } from "@/testing/utils";
import { FormResult } from "@/utils/formState";

import { FlashMessageNotifier } from ".";

beforeEach(() => {
  notifications.clean();
});

describe("FlashMessageNotifier", () => {
  it("formState.resultがsuccessの場合、successとmessageで渡されたメッセージが表示される", () => {
    render(
      <FlashMessageNotifier
        formState={{ result: FormResult.SUCCESS }}
        message="message"
      />,
    );
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });

  it("formState.resultがerrorの場合、errorとmessageで渡されたメッセージが表示される", () => {
    render(
      <FlashMessageNotifier
        formState={{ result: FormResult.ERROR }}
        message="message"
      />,
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });

  it("formState.resultがnullの場合、何も表示されない", () => {
    render(
      <FlashMessageNotifier formState={{ result: null }} message="message" />,
    );
    expect(screen.queryByText("Success")).not.toBeInTheDocument();
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
    expect(screen.queryByText("message")).not.toBeInTheDocument();
  });
});

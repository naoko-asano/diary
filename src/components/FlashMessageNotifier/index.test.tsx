import { notifications } from "@mantine/notifications";
import { beforeEach, describe, expect, it } from "vitest";

import { render, screen } from "@testing/utils";
import { FormResult } from "@/utils/formState";

import { FlashMessageNotifier } from ".";

beforeEach(() => {
  notifications.clean();
});

describe("FlashMessageNotifier", () => {
  it("渡されたmessageとformStateに合ったtitleのフラッシュメッセージが表示されること", () => {
    render(
      <FlashMessageNotifier
        formState={{ result: FormResult.SUCCESS }}
        message="message"
      />,
    );
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });
});

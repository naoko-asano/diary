import { notifications } from "@mantine/notifications";
import { beforeEach, describe, expect, it } from "vitest";

import { FormResult } from "@/utils/formState";
import { render, screen } from "@testing/utils";

import { FlashMessageNotifier } from ".";

beforeEach(() => {
  notifications.clean();
});

describe("FlashMessageNotifier", () => {
  it("渡されたmessageとformStateに合ったtitleのフラッシュメッセージが表示されること", () => {
    render(<FlashMessageNotifier type="success" message="message" />);
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });
});

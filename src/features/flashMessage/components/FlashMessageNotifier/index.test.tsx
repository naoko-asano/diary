import { notifications } from "@mantine/notifications";

import { render, screen } from "@testing/utils";

import { FlashMessageNotifier } from ".";

beforeEach(() => {
  notifications.clean();
});

describe("FlashMessageNotifier", () => {
  it("渡されたmessageとtypeに合ったtitleのフラッシュメッセージが表示されること", () => {
    render(<FlashMessageNotifier type="success" message="message" />);
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });
});

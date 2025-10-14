import { notifications } from "@mantine/notifications";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, userEvent, waitFor } from "@/testing/utils";
import { FormResult } from "@/utils/formState";

import { ArticleForm } from ".";

beforeEach(() => {
  vi.clearAllMocks();
  notifications.clean();
});

const article = {
  id: 1,
  title: "example title",
  body: "example body",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ArticleForm", () => {
  it("フォームの要素が正しく表示される", () => {
    render(<ArticleForm onSubmitAction={vi.fn()} />);

    expect(screen.getByLabelText("Title *")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("articleの値が渡された場合、フォームに初期値としてセットされる", () => {
    render(<ArticleForm article={article} onSubmitAction={vi.fn()} />);

    const titleInput = screen.getByLabelText("Title *") as HTMLInputElement;
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    expect(titleInput).toHaveValue("example title");
    expect(bodyInput).toHaveValue("example body");
  });

  it("articleの値が渡されなかった場合、フォームは空の状態で表示される", () => {
    render(<ArticleForm onSubmitAction={vi.fn()} />);

    const titleInput = screen.getByLabelText("Title *") as HTMLInputElement;
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    expect(titleInput).toHaveValue("");
    expect(bodyInput).toHaveValue("");
  });

  it("フォーム入力と送信ができ、onSubmitActionで渡された関数が呼ばれる", async () => {
    const mockedOnSubmitAction = vi.fn(() =>
      Promise.resolve({ result: FormResult.SUCCESS }),
    );
    render(<ArticleForm onSubmitAction={mockedOnSubmitAction} />);

    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(bodyInput, "Test Body");

    expect(titleInput).toHaveValue("Test Title");
    expect(bodyInput).toHaveValue("Test Body");

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockedOnSubmitAction).toHaveBeenCalledTimes(1);
    expect(mockedOnSubmitAction).toHaveBeenCalledWith(
      { result: null },
      {
        title: "Test Title",
        body: "Test Body",
      },
    );
  });

  it("titleにバリデーションエラーがある場合、エラーメッセージが表示され、onSubmitActionで渡された関数は呼ばれない", async () => {
    const mockedOnSubmitAction = vi.fn();
    render(<ArticleForm onSubmitAction={mockedOnSubmitAction} />);

    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, " ");
    await userEvent.type(bodyInput, "Test Body");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("1文字以上入力してください")).toBeInTheDocument();
    expect(mockedOnSubmitAction).not.toHaveBeenCalled();
  });

  it("bodyにバリデーションエラーがある場合、エラーメッセージが表示され、onSubmitActionで渡された関数は呼ばれない", async () => {
    const mockedOnSubmitAction = vi.fn();
    render(<ArticleForm onSubmitAction={mockedOnSubmitAction} />);

    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(bodyInput, " ");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("1文字以上入力してください")).toBeInTheDocument();
    expect(mockedOnSubmitAction).not.toHaveBeenCalled();
  });

  it("onSubmitActionでエラー発生時、エラーメッセージが表示され、フォームの値は保持される", async () => {
    const mockedOnSubmitAction = vi.fn(() =>
      Promise.resolve({ result: FormResult.ERROR }),
    );

    render(<ArticleForm onSubmitAction={mockedOnSubmitAction} />);

    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(bodyInput, "Test Body");

    expect(
      screen.queryByText("Failed to submit the form. Please try again."),
    ).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockedOnSubmitAction).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(
        screen.getByText("Failed to submit the form. Please try again."),
      ).toBeVisible(),
    );

    const freshTitleInput = screen.getByLabelText(
      "Title *",
    ) as HTMLInputElement;
    const freshBodyInput = screen
      .getByTestId("body-editor")
      .querySelector("textarea") as HTMLTextAreaElement;

    expect(freshTitleInput).toHaveValue("Test Title");
    expect(freshBodyInput).toHaveValue("Test Body");
  });
});

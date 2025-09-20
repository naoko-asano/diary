import { beforeEach, describe, expect, it, vi } from "vitest";

import { createArticle } from "@/features/articles/services";
import { render, screen, userEvent } from "@/testing/utils";

import { ArticleForm } from "./ArticleForm";

vi.mock("@/features/articles/services", () => ({
  createArticle: vi.fn(),
}));
const mockedCreateArticle = vi.mocked(createArticle);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ArticleForm", () => {
  it("フォームの要素が正しく表示される", () => {
    render(<ArticleForm />);

    expect(screen.getByLabelText("Title *")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("フォーム入力と送信ができ、createArticleが呼ばれる", async () => {
    render(<ArticleForm />);

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

    expect(mockedCreateArticle).toHaveBeenCalledTimes(1);
    expect(mockedCreateArticle).toHaveBeenCalledWith({
      title: "Test Title",
      body: "Test Body",
    });

    const freshTitleInput = screen.getByLabelText(
      "Title *",
    ) as HTMLInputElement;
    const freshBodyInput = screen
      .getByTestId("body-editor")
      .querySelector("textarea") as HTMLTextAreaElement;

    expect(freshTitleInput).toHaveValue("");
    expect(freshBodyInput).toHaveValue("");
  });

  it("titleにバリデーションエラーがある場合、エラーメッセージが表示され、createArticleは呼ばれない", async () => {
    render(<ArticleForm />);

    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, " ");
    await userEvent.type(bodyInput, "Test Body");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("1文字以上入力してください")).toBeInTheDocument();
    expect(mockedCreateArticle).not.toHaveBeenCalled();
  });

  it("bodyにバリデーションエラーがある場合、エラーメッセージが表示され、createArticleは呼ばれない", async () => {
    render(<ArticleForm />);

    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(bodyInput, " ");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("1文字以上入力してください")).toBeInTheDocument();
    expect(mockedCreateArticle).not.toHaveBeenCalled();
  });
});

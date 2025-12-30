import { notifications } from "@mantine/notifications";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ActionResultStatuses } from "@/features/actionResult/model";
import { Status } from "@/features/articles/model";
import { uploadImage } from "@/utils/image";
import { render, screen, userEvent, waitFor, within } from "@testing/utils";

import { ArticleForm } from ".";

vi.mock("@/utils/image");
const mockedUploadImage = vi.mocked(uploadImage);
mockedUploadImage.mockResolvedValue({
  url: "https://example.com/uploaded-image.jpg",
  downloadUrl: "https://example.com/uploaded-image.jpg",
  pathname: "/uploaded-image.jpg",
  contentType: "image/jpeg",
  contentDisposition: "inline",
});

beforeEach(() => {
  notifications.clean();
});

const article = {
  id: 1,
  title: "example title",
  body: "example body",
  featuredImageUrl: "https://example.com/image.jpg",
  date: new Date("2025-01-01"),
  status: Status.PUBLISHED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ArticleForm", () => {
  it("フォームの要素が正しく表示される", () => {
    render(<ArticleForm onSubmitAction={vi.fn()} />);

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Date *")).toBeInTheDocument();
    expect(screen.getByLabelText("Title *")).toBeInTheDocument();
    expect(screen.getByLabelText("Featured Image")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("articleの値が渡された場合、フォームに初期値としてセットされる", () => {
    render(<ArticleForm article={article} onSubmitAction={vi.fn()} />);

    const statusSelector = screen.getByLabelText("Status");
    const dateInput = screen.getByLabelText("Date *");
    const titleInput = screen.getByLabelText("Title *") as HTMLInputElement;
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    expect(statusSelector).toHaveTextContent("Publish");
    expect(dateInput).toHaveTextContent("2025/01/01");
    expect(titleInput).toHaveValue("example title");
    expect(bodyInput).toHaveValue("example body");
  });

  it("articleの値が渡されなかった場合、フォームは空の状態で表示される", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2025-02-01"));

    render(<ArticleForm onSubmitAction={vi.fn()} />);

    const statusSelector = screen.getByLabelText("Status");
    const dateInput = screen.getByLabelText("Date *");
    const titleInput = screen.getByLabelText("Title *") as HTMLInputElement;
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    expect(statusSelector).toHaveTextContent("Draft");
    expect(dateInput).toHaveTextContent("2025/02/01");
    expect(titleInput).toHaveValue("");
    expect(bodyInput).toHaveValue("");

    vi.useRealTimers();
  });

  it("アイキャッチ画像を登録していない場合、submitボタン押下でonSubmitActionで渡された関数が呼ばれる", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2025-02-01"));

    const mockedOnSubmitAction = vi.fn(() =>
      Promise.resolve({ status: ActionResultStatuses.SUCCESS }),
    );

    render(<ArticleForm onSubmitAction={mockedOnSubmitAction} />);

    const statusSelector = screen.getByLabelText("Status");
    const dateInput = screen.getByLabelText("Date *");
    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.selectOptions(statusSelector, "Publish");
    await userEvent.click(dateInput);
    const calendar = screen.getByRole("dialog");
    const dayButton = within(calendar).getByRole("button", {
      name: "2 February 2025",
    });
    await userEvent.click(dayButton);

    expect(dateInput).toHaveTextContent("2025/02/02");

    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(bodyInput, "Test Body");

    expect(titleInput).toHaveValue("Test Title");
    expect(bodyInput).toHaveValue("Test Body");

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockedOnSubmitAction).toHaveBeenCalledTimes(1);
    expect(mockedOnSubmitAction).toHaveBeenCalledWith(
      { status: ActionResultStatuses.IDLE },
      {
        date: new Date("2025-02-02"),
        title: "Test Title",
        body: "Test Body",
        featuredImageUrl: null,
        status: Status.PUBLISHED,
      },
    );
    expect(mockedUploadImage).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("アイキャッチ画像が登録された場合、submitボタン押下でonSubmitActionに渡された関数とuploadImageが呼ばれる", async () => {
    const mockedSubmitAction = vi.fn(() =>
      Promise.resolve({ status: ActionResultStatuses.SUCCESS }),
    );

    render(<ArticleForm onSubmitAction={mockedSubmitAction} />);
    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(bodyInput, "Test Body");

    expect(titleInput).toHaveValue("Test Title");
    expect(bodyInput).toHaveValue("Test Body");

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const fileButton = screen.getByLabelText(/Featured Image/i);
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    await waitFor(() => expect(fileButton).toHaveTextContent("example.png"));
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toStrictEqual(file);

    const submitButton = screen.getByRole("button", { name: "Submit" });

    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    expect(mockedUploadImage).toHaveBeenCalledTimes(1);
    expect(mockedSubmitAction).toHaveBeenCalledTimes(1);
  });

  it("画像のアップロードに失敗した場合、onSubmitActionで渡された関数は呼ばれない", async () => {
    mockedUploadImage.mockRejectedValueOnce(new Error("Upload failed"));
    const mockedOnSubmitAction = vi.fn();

    render(<ArticleForm onSubmitAction={mockedOnSubmitAction} />);
    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(bodyInput, "Test Body");

    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    expect(mockedUploadImage).toHaveBeenCalledTimes(1);
    expect(mockedOnSubmitAction).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(
        screen.getByText("Failed to upload image. Please try again later."),
      ).toBeVisible(),
    );
    expect(submitButton).toBeEnabled();
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
      Promise.resolve({ status: ActionResultStatuses.ERROR }),
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
      screen.queryByText("Failed to submit the form. Please try again later."),
    ).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockedOnSubmitAction).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(
        screen.getByText("Failed to submit the form. Please try again later."),
      ).toBeVisible(),
    );

    expect(titleInput).toHaveValue("Test Title");
    expect(bodyInput).toHaveValue("Test Body");
  });

  it("戻るボタンのhref属性が記事一覧ページである", () => {
    render(<ArticleForm onSubmitAction={vi.fn()} />);

    const backButton = screen.getByRole("link", {
      name: "Back to Article List",
    });
    expect(backButton).toHaveAttribute("href", "/admin/articles");
  });
});

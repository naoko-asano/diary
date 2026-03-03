import { notifications } from "@mantine/notifications";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ActionResultStatuses } from "@/features/actionResult/model";
import { STATUSES as ArticleStatuses } from "@/features/articles/model";
import { uploadImage } from "@/utils/image";
import { render, screen, userEvent, waitFor, within } from "@testing/utils";

import { ArticleForm } from ".";

vi.mock("@/utils/image");
const mockedUploadImage = vi.mocked(uploadImage);

beforeEach(() => {
  notifications.clean();
});

const article = {
  id: 1,
  title: "Stored title",
  body: "Stored body",
  featuredImageUrl: "https://example.com/stored-image.jpg",
  date: new Date("2025-01-01"),
  status: ArticleStatuses.PUBLISHED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const baseSubmitAction = vi.fn().mockResolvedValue({
  status: ActionResultStatuses.SUCCESS,
  message: "Success",
});

describe("記事フォームコンポーネント", () => {
  it("フォームのラベルが正しく表示される", () => {
    render(<ArticleForm submitAction={baseSubmitAction} />);

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Date *")).toBeInTheDocument();
    expect(screen.getByLabelText("Title *")).toBeInTheDocument();
    expect(screen.getByLabelText("Featured Image")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("記事が渡された場合、その値がフォームに表示される", () => {
    render(<ArticleForm article={article} submitAction={baseSubmitAction} />);

    const statusSelector = screen.getByLabelText("Status");
    const dateInput = screen.getByLabelText("Date *");
    const titleInput = screen.getByLabelText("Title *") as HTMLInputElement;
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    expect(statusSelector).toHaveTextContent("Publish");
    expect(dateInput).toHaveTextContent("2025/01/01");
    expect(titleInput).toHaveValue("Stored title");
    expect(bodyInput).toHaveValue("Stored body");
  });

  it("記事が渡されなかった場合、フォームに初期値が表示される", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2025-02-01"));

    render(<ArticleForm submitAction={baseSubmitAction} />);

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

  it("タイトルにバリデーションエラーがある場合、エラーメッセージが表示され、サブミットは実行されない", async () => {
    const submitAction = baseSubmitAction;

    render(<ArticleForm submitAction={submitAction} />);

    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, " ");
    await userEvent.type(bodyInput, "Test Body");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("1文字以上入力してください")).toBeInTheDocument();
    expect(submitAction).not.toHaveBeenCalled();
  });

  it("本文にバリデーションエラーがある場合、エラーメッセージが表示され、サブミットは実行されない", async () => {
    const submitAction = baseSubmitAction;

    render(<ArticleForm submitAction={submitAction} />);

    const titleInput = screen.getByLabelText("Title *");
    const bodyEditor = screen.getByTestId("body-editor");
    const bodyInput = bodyEditor.querySelector(
      "textarea",
    ) as HTMLTextAreaElement;

    await userEvent.type(titleInput, "Test Title");
    await userEvent.type(bodyInput, " ");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("1文字以上入力してください")).toBeInTheDocument();
    expect(submitAction).not.toHaveBeenCalled();
  });

  it("戻るボタンのhref属性が記事一覧ページである", () => {
    render(<ArticleForm submitAction={baseSubmitAction} />);

    const backButton = screen.getByRole("link", {
      name: "Back to Article List",
    });
    expect(backButton).toHaveAttribute("href", "/admin/articles");
  });

  describe("サブミットボタン押下時", () => {
    it("アイキャッチ画像が登録された場合、画像アップロードとサブミットが実行される", async () => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(new Date("2025-02-01"));
      const submitAction = baseSubmitAction;
      mockedUploadImage.mockResolvedValue({
        url: "https://example.com/example.jpg",
        downloadUrl: "https://example.com/example.jpg",
        pathname: "/example.jpg",
        contentType: "image/jpg",
        contentDisposition: "inline",
      });

      render(<ArticleForm submitAction={submitAction} />);

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
      await userEvent.type(titleInput, "Typed title");
      await userEvent.type(bodyInput, "Typed body");

      expect(statusSelector).toHaveTextContent("Publish");
      expect(dateInput).toHaveTextContent("2025/02/02");
      expect(titleInput).toHaveValue("Typed title");
      expect(bodyInput).toHaveValue("Typed body");

      const file = new File(["dummy content"], "example.jpg", {
        type: "image/jpg",
      });
      const fileButton = screen.getByLabelText(/Featured Image/i);
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      await waitFor(() => expect(fileButton).toHaveTextContent("example.jpg"));
      expect(fileInput.files).toHaveLength(1);
      expect(fileInput.files?.[0]).toStrictEqual(file);

      const submitButton = screen.getByRole("button", { name: "Submit" });
      await userEvent.click(submitButton);

      expect(submitAction).toHaveBeenCalledTimes(1);
      expect(submitAction).toHaveBeenCalledWith(
        { status: ActionResultStatuses.IDLE },
        {
          date: new Date("2025-02-02"),
          title: "Typed title",
          body: "Typed body",
          featuredImageUrl: "https://example.com/example.jpg",
          status: ArticleStatuses.PUBLISHED,
        },
      );
      expect(mockedUploadImage).toHaveBeenCalledTimes(1);
      expect(mockedUploadImage).toHaveBeenCalledWith(file);
      await waitFor(() => expect(submitButton).toBeEnabled());

      vi.useRealTimers();
    });

    it("アイキャッチ画像が登録されない場合、画像アップロードは実行されないが、サブミットは実行される", async () => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(new Date("2025-02-01"));
      const submitAction = baseSubmitAction;

      render(<ArticleForm submitAction={submitAction} />);

      const titleInput = screen.getByLabelText("Title *");
      const bodyEditor = screen.getByTestId("body-editor");
      const bodyInput = bodyEditor.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;
      await userEvent.type(titleInput, "Typed Title");
      await userEvent.type(bodyInput, "Typed Body");
      const submitButton = screen.getByRole("button", { name: "Submit" });
      await userEvent.click(submitButton);

      expect(submitAction).toHaveBeenCalledTimes(1);
      expect(submitAction).toHaveBeenCalledWith(
        { status: ActionResultStatuses.IDLE },
        {
          date: new Date("2025-02-01"),
          title: "Typed Title",
          body: "Typed Body",
          featuredImageUrl: null,
          status: ArticleStatuses.DRAFT,
        },
      );
      expect(mockedUploadImage).not.toHaveBeenCalled();
      await waitFor(() => expect(submitButton).toBeEnabled());

      vi.useRealTimers();
    });

    it("サブミットでエラーが発生した場合、サブミットの戻り値のメッセージが表示され。フォームは維持される", async () => {
      const submitAction = vi.fn().mockResolvedValue({
        status: ActionResultStatuses.ERROR,
        message: "Error Message",
      });

      render(<ArticleForm submitAction={submitAction} />);

      const titleInput = screen.getByLabelText("Title *");
      const bodyEditor = screen.getByTestId("body-editor");
      const bodyInput = bodyEditor.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;
      await userEvent.type(titleInput, "Typed title");
      await userEvent.type(bodyInput, "Typed body");
      const submitButton = screen.getByRole("button", { name: "Submit" });
      await userEvent.click(submitButton);

      expect(submitAction).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.getByText("Error Message")).toBeInTheDocument();
      });
      expect(titleInput).toHaveValue("Typed title");
      expect(bodyInput).toHaveValue("Typed body");
      expect(submitButton).toBeEnabled();
    });

    it("アイキャッチ画像のアップロードに失敗した場合、エラーメッセージが表示され、サブミットされない", async () => {
      mockedUploadImage.mockRejectedValueOnce(new Error("Upload failed"));
      const submitAction = baseSubmitAction;

      render(<ArticleForm submitAction={submitAction} />);

      const titleInput = screen.getByLabelText("Title *");
      const bodyEditor = screen.getByTestId("body-editor");
      const bodyInput = bodyEditor.querySelector(
        "textarea",
      ) as HTMLTextAreaElement;
      await userEvent.type(titleInput, "Typed Title");
      await userEvent.type(bodyInput, "Typed Body");
      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      await userEvent.upload(fileInput, file);
      const submitButton = screen.getByRole("button", { name: "Submit" });
      await userEvent.click(submitButton);

      expect(mockedUploadImage).toHaveBeenCalledTimes(1);
      expect(submitAction).not.toHaveBeenCalled();
      await waitFor(() =>
        expect(
          screen.getByText("Failed to upload image. Please try again later."),
        ).toBeInTheDocument(),
      );
      expect(submitButton).toBeEnabled();
    });
  });
});

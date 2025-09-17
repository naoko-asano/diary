import { beforeEach, describe, expect, it, vi } from "vitest";

import { createArticle } from "@/features/articles/services";
import prisma from "@/lib/__mocks__/database";

vi.mock("@/lib/database");
beforeEach(() => {
  vi.clearAllMocks();
});

const articleParams = {
  title: "Test Article",
  body: "This is a test article.",
};

describe("createArticle", () => {
  it("DBに記事レコードが作成される", async () => {
    prisma.article.create.mockResolvedValue({
      id: 1,
      ...articleParams,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const article = await createArticle(articleParams);

    expect(prisma.article.create).toHaveBeenCalledTimes(1);
    expect(prisma.article.create).toHaveBeenCalledWith({
      data: articleParams,
    });
    expect(article).toHaveProperty("id", 1);
    expect(article.title).toBe("Test Article");
    expect(article.body).toBe("This is a test article.");
  });
  it("パラメータが不正な場合、エラーがスローされる", async () => {
    await expect(
      createArticle({ ...articleParams, title: "" }),
    ).rejects.toThrow();
    expect(prisma.article.create).not.toHaveBeenCalled();
  });
  it("DBにレコードが生成されない場合、エラーがスローされる", async () => {
    prisma.article.create.mockRejectedValue(new Error("DB error"));

    await expect(createArticle(articleParams)).rejects.toThrow(
      "Failed to create article\nError: DB error",
    );
  });
});

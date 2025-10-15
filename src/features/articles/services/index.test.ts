import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createArticle,
  deleteArticle,
  findArticleById,
} from "@/features/articles/services";
import { Article } from "@/generated/prisma";
import prisma from "@/lib/__mocks__/database";

vi.mock("@/lib/database");
beforeEach(() => {
  vi.clearAllMocks();
});

const articleParams = {
  title: "Test Article",
  body: "This is a test article.",
};

describe("findArticleById", () => {
  it("指定IDの記事を取得できる", async () => {
    const article: Article = {
      id: 1,
      ...articleParams,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.article.findUnique.mockResolvedValue(article);
    const foundArticle = await findArticleById(1);
    expect(prisma.article.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.article.findUnique).toHaveBeenCalledWith({
      where: { id: article.id },
    });
    expect(foundArticle).toEqual(article);
  });
});

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

describe("deleteArticle", () => {
  it("指定IDの記事を削除し、削除した記事を返す", async () => {
    const article: Article = {
      id: 1,
      ...articleParams,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.article.delete.mockResolvedValue(article);

    const deletedArticle = await deleteArticle(1);

    expect(prisma.article.delete).toHaveBeenCalledTimes(1);
    expect(prisma.article.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(deletedArticle).toEqual(article);
  });

  it("削除に失敗する場合、エラーがスローされる", async () => {
    prisma.article.delete.mockRejectedValue(new Error("Record not found"));

    await expect(prisma.article.delete({ where: { id: 999 } })).rejects.toThrow(
      "Record not found",
    );
    expect(prisma.article.delete).toHaveBeenCalledTimes(1);
    expect(prisma.article.delete).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createArticle,
  deleteArticle,
  findArticleById,
  getAllArticles,
  updateArticle,
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

describe("getAllArticles", () => {
  it("全ての記事を取得できる", async () => {
    const articles: Article[] = [
      {
        id: 1,
        ...articleParams,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "Another Article",
        body: "This is another test article.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    prisma.article.findMany.mockResolvedValue(articles);

    const result = await getAllArticles();

    expect(prisma.article.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(articles);
  });

  it("DB側のエラーが発生した場合、エラーがスローされる", async () => {
    prisma.article.findMany.mockRejectedValue(new Error("DB error"));

    await expect(getAllArticles()).rejects.toThrow(
      "Failed to get all articles\nError: DB error",
    );
  });
});

describe("findArticleById", () => {
  it("指定IDの記事を取得できる", async () => {
    const article: Article = {
      id: 1,
      ...articleParams,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.article.findUnique.mockResolvedValue(article);
    const result = await findArticleById(1);
    expect(prisma.article.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.article.findUnique).toHaveBeenCalledWith({
      where: { id: article.id },
    });
    expect(result).toEqual(article);
  });

  it("指定IDの記事が存在しない場合、nullを返す", async () => {
    prisma.article.findUnique.mockResolvedValue(null);
    const result = await findArticleById(999);
    expect(result).toBeNull();
  });

  it("DB側のエラーが発生した場合、エラーがスローされる", async () => {
    prisma.article.findUnique.mockRejectedValue(new Error("DB error"));

    await expect(findArticleById(1)).rejects.toThrow(
      "Failed to find article\nError: DB error",
    );
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
    const result = await createArticle(articleParams);

    expect(prisma.article.create).toHaveBeenCalledTimes(1);
    expect(prisma.article.create).toHaveBeenCalledWith({
      data: articleParams,
    });
    expect(result).toHaveProperty("id", 1);
    expect(result.title).toBe("Test Article");
    expect(result.body).toBe("This is a test article.");
  });

  it("パラメータが不正な場合、エラーがスローされる", async () => {
    await expect(
      createArticle({ ...articleParams, title: "" }),
    ).rejects.toThrow();
    expect(prisma.article.create).not.toHaveBeenCalled();
  });

  it("DB側のエラーが発生した場合、エラーがスローされる", async () => {
    prisma.article.create.mockRejectedValue(new Error("DB error"));

    await expect(createArticle(articleParams)).rejects.toThrow(
      "Failed to create article\nError: DB error",
    );
  });
});

describe("updateArticle", () => {
  it("記事が更新される", async () => {
    const article: Article = {
      id: 1,
      ...articleParams,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.article.update.mockResolvedValue(article);

    const result = await updateArticle({ id: 1, ...articleParams });

    expect(prisma.article.update).toHaveBeenCalledTimes(1);
    expect(prisma.article.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: articleParams,
    });
    expect(result).toEqual(article);
  });

  it("パラメータが不正な場合、エラーがスローされる", async () => {
    await expect(
      updateArticle({ id: 1, ...articleParams, title: "" }),
    ).rejects.toThrow();
    expect(prisma.article.update).not.toHaveBeenCalled();
  });

  it("DB側のエラーが発生した場合、エラーがスローされる", async () => {
    prisma.article.update.mockRejectedValue(new Error("DB error"));

    await expect(updateArticle({ id: 999, ...articleParams })).rejects.toThrow(
      "Failed to update article\nError: DB error",
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

    const result = await deleteArticle(1);

    expect(prisma.article.delete).toHaveBeenCalledTimes(1);
    expect(prisma.article.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(article);
  });

  it("DB側のエラーが発生した場合、エラーがスローされる", async () => {
    prisma.article.delete.mockRejectedValue(new Error("DB error"));

    await expect(deleteArticle(1)).rejects.toThrow(
      "Failed to delete article\nError: DB error",
    );
  });
});

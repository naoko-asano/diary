import { beforeEach, describe, expect, it, vi } from "vitest";

import { createArticle } from "@/features/articles/services";
import prisma from "@/lib/__mocks__/database";

vi.mock("@/lib/database");
beforeEach(() => {
  vi.clearAllMocks();
});

describe("createArticle", () => {
  describe("正常系の場合", () => {
    it("DBに記事レコードが作成される", async () => {
      const articleParams = {
        title: "Test Article",
        body: "This is a test article.",
      };
      prisma.article.create.mockResolvedValue({
        id: 1,
        ...articleParams,
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
  });

  describe("DBにレコードが作成されない場合", () => {
    it("エラーがスローされる", async () => {
      const articleParams = {
        title: "Test Article",
        body: "This is a test article.",
      };
      prisma.article.create.mockRejectedValue(new Error("DB error"));

      await expect(createArticle(articleParams)).rejects.toThrow(
        "Failed to create article: Error: DB error",
      );
    });
  });
});

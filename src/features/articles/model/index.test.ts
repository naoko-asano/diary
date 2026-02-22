import { describe, expect, it } from "vitest";

import {
  Article,
  ArticleParams,
  resolveFeaturedImageUrl,
  Statuses,
  validateArticle,
} from ".";

const article: ArticleParams = {
  title: "Test Article",
  body: "This is a test article.",
  featuredImageUrl: null,
  date: new Date("2025-01-01"),
  status: Statuses.DRAFT,
};

describe("記事パラメータが", () => {
  it("有効な場合、バリデーションが通る", () => {
    expect(() => validateArticle(article)).not.toThrow();
  });

  describe("タイトルが", () => {
    it("空文字の場合、エラーがスローされる", () => {
      expect(() => validateArticle({ ...article, title: "" })).toThrow(
        "1文字以上入力してください",
      );
    });

    it("スペースのみの場合、エラーがスローされる", () => {
      expect(() => validateArticle({ ...article, title: " " })).toThrow(
        "1文字以上入力してください",
      );
    });

    it("255文字の場合、バリデーションが通る", () => {
      expect(() =>
        validateArticle({ ...article, title: "a".repeat(255) }),
      ).not.toThrow();
    });

    it("255文字を超える場合、エラーがスローされる", () => {
      expect(() =>
        validateArticle({ ...article, title: "a".repeat(256) }),
      ).toThrow("255文字以内で入力してください");
    });
  });

  describe("本文が", () => {
    it("空文字の場合、エラーがスローされる", () => {
      expect(() => validateArticle({ ...article, body: "" })).toThrow(
        "1文字以上入力してください",
      );
    });

    it("スペースのみの場合、エラーがスローされる", () => {
      expect(() => validateArticle({ ...article, body: " " })).toThrow(
        "1文字以上入力してください",
      );
    });
  });

  describe("ステータスが", () => {
    it.each([Statuses.DRAFT, Statuses.PUBLISHED])(
      "有効な値の場合、バリデーションが通る",
      (status) => {
        expect(() =>
          validateArticle({
            ...article,
            status: status,
          }),
        ).not.toThrow();
      },
    );
  });

  describe("アイキャッチ画像が", () => {
    it("nullの場合、バリデーションが通る", () => {
      expect(() =>
        validateArticle({ ...article, featuredImageUrl: null }),
      ).not.toThrow();
    });

    it("URL文字列の場合、バリデーションが通る", () => {
      expect(() =>
        validateArticle({
          ...article,
          featuredImageUrl: "https://example.com/image.jpg",
        }),
      ).not.toThrow();
    });
  });
});

describe("アイキャッチ画像のURLは", () => {
  it("指定されたアイキャッチ画像がある場合、そのURLとなる", () => {
    const articleWithImage: Article = {
      ...article,
      id: 1,
      featuredImageUrl: "/image.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(resolveFeaturedImageUrl(articleWithImage)).toBe("/image.jpg");
  });

  it("指定されたアイキャッチ画像がない場合、デフォルトの画像URLとなる", () => {
    const articleWithoutImage: Article = {
      ...article,
      id: 2,
      featuredImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(resolveFeaturedImageUrl(articleWithoutImage)).toBe(
      "/images/default-featured-image.jpg",
    );
  });
});

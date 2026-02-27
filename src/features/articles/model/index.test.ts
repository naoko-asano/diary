import { describe, expect, it } from "vitest";

import {
  Article,
  ArticleParams,
  isDraft,
  resolveFeaturedImageUrl,
  STATUSES,
  validateArticle,
} from ".";

const validArticleParams: ArticleParams = {
  title: "Test Article",
  body: "This is a test article.",
  featuredImageUrl: null,
  date: new Date("2025-01-01"),
  status: STATUSES.DRAFT,
};

const baseArticle: Article = {
  id: 1,
  ...validArticleParams,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("記事パラメータが有効か検証するメソッド", () => {
  it("記事パラメータが有効な場合、バリデーションが通る", () => {
    const params = { ...validArticleParams };
    expect(() => validateArticle(params)).not.toThrow();
  });

  describe("タイトルが", () => {
    it("空文字の場合、エラーがスローされる", () => {
      const params = { ...validArticleParams, title: "" };
      expect(() => validateArticle(params)).toThrow(
        "1文字以上入力してください",
      );
    });

    it("スペースのみの場合、エラーがスローされる", () => {
      const params = { ...validArticleParams, title: " " };
      expect(() => validateArticle(params)).toThrow(
        "1文字以上入力してください",
      );
    });

    it("255文字の場合、バリデーションが通る", () => {
      const params = { ...validArticleParams, title: "a".repeat(255) };
      expect(() => validateArticle(params)).not.toThrow();
    });

    it("255文字を超える場合、エラーがスローされる", () => {
      const params = { ...validArticleParams, title: "a".repeat(256) };
      expect(() => validateArticle(params)).toThrow(
        "255文字以内で入力してください",
      );
    });
  });

  describe("本文が", () => {
    it("空文字の場合、エラーがスローされる", () => {
      const params = { ...validArticleParams, body: "" };
      expect(() => validateArticle(params)).toThrow(
        "1文字以上入力してください",
      );
    });

    it("スペースのみの場合、エラーがスローされる", () => {
      const params = { ...validArticleParams, body: " " };
      expect(() => validateArticle(params)).toThrow(
        "1文字以上入力してください",
      );
    });
  });

  describe("ステータスが", () => {
    it.each([STATUSES.DRAFT, STATUSES.PUBLISHED])(
      "有効な値の場合、バリデーションが通る",
      (status) => {
        const params = { ...validArticleParams, status };
        expect(() => validateArticle(params)).not.toThrow();
      },
    );
  });

  describe("アイキャッチ画像が", () => {
    it("nullの場合、バリデーションが通る", () => {
      const params = { ...validArticleParams, featuredImageUrl: null };
      expect(() => validateArticle(params)).not.toThrow();
    });

    it("URL文字列の場合、バリデーションが通る", () => {
      const params = {
        ...validArticleParams,
        featuredImageUrl: "https://example.com/image.jpg",
      };
      expect(() => validateArticle(params)).not.toThrow();
    });
  });
});

describe("記事が下書き状態か判定するメソッド", () => {
  it("下書きの場合", () => {
    const draftArticle: Article = {
      ...baseArticle,
      status: STATUSES.DRAFT,
    };
    expect(isDraft(draftArticle)).toBe(true);
  });

  it("公開されている場合", () => {
    const publishedArticle: Article = {
      ...baseArticle,
      status: STATUSES.PUBLISHED,
    };
    expect(isDraft(publishedArticle)).toBe(false);
  });
});

describe("アイキャッチ画像のURLは", () => {
  it("指定されたアイキャッチ画像がある場合、そのURLとなる", () => {
    const articleWithImage: Article = {
      ...baseArticle,
      featuredImageUrl: "/image.jpg",
    };
    expect(resolveFeaturedImageUrl(articleWithImage)).toBe("/image.jpg");
  });

  it("指定されたアイキャッチ画像がない場合、デフォルトの画像URLとなる", () => {
    const articleWithoutImage: Article = {
      ...baseArticle,
      id: 2,
      featuredImageUrl: null,
    };
    expect(resolveFeaturedImageUrl(articleWithoutImage)).toBe(
      "/images/default-featured-image.jpg",
    );
  });
});

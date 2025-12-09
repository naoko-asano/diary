import { describe, expect, it } from "vitest";

import {
  articleScheme,
  resolveFeaturedImage,
  Status,
  validateArticle,
} from ".";

const article = {
  title: "Test Article",
  body: "This is a test article.",
  featuredImageUrl: null,
  date: new Date("2025-01-01"),
  status: Status.DRAFT,
};

describe("articleScheme", () => {
  it("記事が正しい場合、バリデーションが通る", () => {
    expect(() => articleScheme.parse(article)).not.toThrow();
  });

  describe("titleが", () => {
    it.each([
      ["number", 123],
      ["null", null],
      ["undefined", undefined],
      ["boolean", true],
      ["object", {}],
      ["array", []],
    ])("%s型の場合、エラーがスローされる", (_typeName, invalidTitle) => {
      expect(() =>
        articleScheme.parse({ ...article, title: invalidTitle }),
      ).toThrow();
    });

    it("空文字やスペースのみの場合、エラーがスローされる", () => {
      expect(() => articleScheme.parse({ ...article, title: "" })).toThrow(
        "1文字以上入力してください",
      );
      expect(() => articleScheme.parse({ ...article, title: " " })).toThrow(
        "1文字以上入力してください",
      );
    });

    it("255文字の場合、バリデーションが通る", () => {
      expect(() =>
        articleScheme.parse({ ...article, title: "a".repeat(255) }),
      ).not.toThrow();
    });

    it("255文字を超える場合、エラーがスローされる", () => {
      expect(() =>
        articleScheme.parse({ ...article, title: "a".repeat(256) }),
      ).toThrow("255文字以内で入力してください");
    });
  });

  describe("bodyが", () => {
    it.each([
      ["number", 123],
      ["null", null],
      ["undefined", undefined],
      ["boolean", true],
      ["object", {}],
      ["array", []],
    ])("%s型の場合、エラーがスローされる", (typeName, invalidBody) => {
      expect(() =>
        articleScheme.parse({ ...article, body: invalidBody }),
      ).toThrow();
    });

    it("空文字やスペースのみ場合、エラーがスローされる", () => {
      expect(() => articleScheme.parse({ ...article, body: "" })).toThrow(
        "1文字以上入力してください",
      );
      expect(() => articleScheme.parse({ ...article, body: " " })).toThrow(
        "1文字以上入力してください",
      );
    });
  });

  describe("dateが", () => {
    it.each([
      ["undefined", undefined],
      ["object", {}],
      ["array", []],
    ])("%s型の場合、エラーがスローされる", (typeName, invalidDate) => {
      expect(() =>
        articleScheme.parse({ ...article, date: invalidDate }),
      ).toThrow("日付を選択してください");
    });
  });
});

describe("validateArticle", () => {
  it("有効な記事の場合、エラーがスローされない", () => {
    expect(() => validateArticle(article)).not.toThrow();
  });

  it("無効な記事の場合、エラーがスローされる", () => {
    expect(() => validateArticle({ ...article, title: "" })).toThrow(
      /Invalid article params\n/,
    );
  });
});

describe("resolveFeaturedImage", () => {
  it("featuredImageUrlが存在する場合、そのURLを返す", () => {
    const articleWithImage = {
      ...article,
      id: 1,
      featuredImageUrl: "/image.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(resolveFeaturedImage(articleWithImage)).toBe("/image.jpg");
  });

  it("featuredImageUrlがnullの場合、デフォルトの画像URLを返す", () => {
    const articleWithoutImage = {
      ...article,
      id: 2,
      resolveFeaturedImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(resolveFeaturedImage(articleWithoutImage)).toBe(
      "/images/default-featured-image.jpg",
    );
  });
});

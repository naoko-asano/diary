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
    it.each([
      ["number", 123],
      ["null", null],
      ["undefined", undefined],
      ["boolean", true],
      ["object", {}],
      ["array", []],
    ])("%s型の場合、エラーがスローされる", (_typeName, invalidTitle) => {
      expect(() =>
        validateArticle({
          ...validArticleParams,
          title: invalidTitle as unknown as string,
        }),
      ).toThrow();
    });

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
    it.each([
      ["number", 123],
      ["null", null],
      ["undefined", undefined],
      ["boolean", true],
      ["object", {}],
      ["array", []],
    ])("%s型の場合、エラーがスローされる", (_typeName, invalidBody) => {
      expect(() =>
        validateArticle({
          ...validArticleParams,
          body: invalidBody as unknown as string,
        }),
      ).toThrow();
    });

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

  describe("日付が", () => {
    it.each([
      ["undefined", undefined],
      ["object", {}],
      ["array", []],
    ])(
      "日付に変換できない%s型の場合、エラーがスローされる",
      (_typeName, invalidDate) => {
        expect(() =>
          validateArticle({
            ...validArticleParams,
            date: invalidDate as unknown as Date,
          }),
        ).toThrow("日付を選択してください");
      },
    );

    it.each([
      ["Date object", new Date("2025-01-01")],
      ["string", "2025-01-01"],
      ["number (timestamp)", new Date("2025-01-01").getTime()],
      ["null", null],
      ["boolean (true)", true],
      ["boolean (false)", false],
    ])(
      "日付に変換できる%s型の場合、バリデーションが通る",
      (_typeName, validDate) => {
        const params = {
          ...validArticleParams,
          date: validDate as unknown as Date,
        };
        expect(() => validateArticle(params)).not.toThrow();
      },
    );
  });

  describe("ステータスが", () => {
    it.each([STATUSES.DRAFT, STATUSES.PUBLISHED])(
      "有効な値の場合、バリデーションが通る",
      (status) => {
        const params = { ...validArticleParams, status };
        expect(() => validateArticle(params)).not.toThrow();
      },
    );
    it("無効な値の場合、エラーがスローされる", () => {
      const params = {
        ...validArticleParams,
        status: "INVALID_STATUS" as (typeof STATUSES)[keyof typeof STATUSES],
      };
      expect(() => validateArticle(params)).toThrow();
    });
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

    it.each([
      ["number", 123],
      ["undefined", undefined],
      ["boolean", true],
      ["object", {}],
      ["array", []],
    ])("%s型の場合、エラーがスローされる", (_typeName, invalidUrl) => {
      const params = {
        ...validArticleParams,
        featuredImageUrl: invalidUrl as unknown as string,
      };
      expect(() => validateArticle(params)).toThrow();
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

import { describe, expect, it } from "vitest";

import { articleScheme, validateArticle } from "./model";

const article = {
  title: "Test Article",
  body: "This is a test article.",
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

    it("空文字の場合、エラーがスローされる", () => {
      const article = {
        title: "",
        body: "This is a test article.",
      };
      expect(() => articleScheme.parse(article)).toThrow();
    });

    it("255文字の場合、バリデーションが通る", () => {
      expect(() =>
        articleScheme.parse({ ...article, title: "a".repeat(255) }),
      ).not.toThrow();
    });

    it("255文字を超える場合、エラーがスローされる", () => {
      expect(() =>
        articleScheme.parse({ ...article, title: "a".repeat(256) }),
      ).toThrow();
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
    ])("%s型の場合、エラーがスローされる", (_typeName, invalidBody) => {
      expect(() =>
        articleScheme.parse({ ...article, body: invalidBody }),
      ).toThrow();
    });

    it("空文字の場合、エラーがスローされる", () => {
      expect(() => articleScheme.parse({ ...article, body: "" })).toThrow();
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

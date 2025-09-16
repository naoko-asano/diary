import { describe, expect, it } from "vitest";

import { Article, validateArticle } from "./model";

describe("validateArticle", () => {
  const article = {
    title: "Test Article",
    body: "This is a test article.",
  };
  it("記事が正しい場合、バリデーションが通る", () => {
    expect(() => validateArticle(article)).not.toThrow();
  });

  describe("titleが", () => {
    it("空文字の場合、エラーがスローされる", () => {
      expect(() => validateArticle({ ...article, title: "" })).toThrow();
    });
    it("255文字を超える場合、エラーがスローされる", () => {
      expect(() =>
        validateArticle({
          ...article,
          title: "a".repeat(256),
        }),
      ).toThrow();
    });
  });

  describe("bodyが", () => {
    it("空文字の場合、エラーがスローされる", () => {
      expect(() => validateArticle({ ...article, body: "" })).toThrow();
    });
  });
});

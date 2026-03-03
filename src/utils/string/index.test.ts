import { describe, expect, it } from "vitest";

import { toSentenceCase } from ".";

describe("1文字目だけ大文字にし、残りを小文字に変換する", () => {
  it("文字列の最初の文字を大文字に変換する", () => {
    expect(toSentenceCase("hello")).toBe("Hello");
    expect(toSentenceCase("WORLD")).toBe("World");
  });

  it("空文字列の場合はそのまま返す", () => {
    expect(toSentenceCase("")).toBe("");
  });
});

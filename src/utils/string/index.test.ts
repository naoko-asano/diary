import { describe, expect, it } from "vitest";

import { capitalize } from ".";

describe("capitalize", () => {
  it("文字列の最初の文字を大文字に変換する", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("WORLD")).toBe("World");
  });

  it("空文字列の場合はそのまま返す", () => {
    expect(capitalize("")).toBe("");
  });
});

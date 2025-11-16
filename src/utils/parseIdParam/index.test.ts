import { describe, expect, it } from "vitest";

import { parseIdParam } from ".";

describe("parseIdParam", () => {
  it("引数が正の整数文字列の場合、その数値を返す", () => {
    expect(parseIdParam("1")).toBe(1);
    expect(parseIdParam("123")).toBe(123);
  });

  it("引数が整数に変換できない文字列の場合、エラーを返す", () => {
    expect(() => parseIdParam("foo")).toThrowError("Invalid id parameter");
    expect(() => parseIdParam("1.5")).toThrowError("Invalid id parameter");
    expect(() => parseIdParam("123foo")).toThrowError("Invalid id parameter");
  });

  it("引数が0の場合、エラーを返す", () => {
    expect(() => parseIdParam("0")).toThrowError("Invalid id parameter");
  });

  it("引数が負の整数文字列の場合、エラーを返す", () => {
    expect(() => parseIdParam("-1")).toThrowError("Invalid id parameter");
  });
});

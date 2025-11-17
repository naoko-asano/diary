import { describe, expect, it } from "vitest";

import { parsePageParam } from ".";

describe("parsePageParam", () => {
  it("pageParamが正の整数文字列の場合、その数値を返す", () => {
    expect(parsePageParam("1")).toBe(1);
  });

  it("pageParamがundefinedの場合、1を返す", () => {
    expect(parsePageParam(undefined)).toBe(1);
  });

  it("pageParamが整数に変換できない文字列の場合、1を返す", () => {
    expect(parsePageParam("foo")).toBe(1);
    expect(parsePageParam("1.5")).toBe(1);
    expect(parsePageParam("123foo")).toBe(1);
  });

  it("pageParamが1以下の場合、1を返す", () => {
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-1")).toBe(1);
  });
});

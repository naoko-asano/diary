import { computeTotalPages } from ".";

describe("ページ数の計算", () => {
  it("総件数と1ページあたりの件数から、総ページ数を計算する", () => {
    expect(computeTotalPages({ totalCount: 0, perPage: 10 })).toBe(0);
    expect(computeTotalPages({ totalCount: 1, perPage: 10 })).toBe(1);
    expect(computeTotalPages({ totalCount: 10, perPage: 10 })).toBe(1);
    expect(computeTotalPages({ totalCount: 11, perPage: 10 })).toBe(2);
    expect(computeTotalPages({ totalCount: 20, perPage: 10 })).toBe(2);
    expect(computeTotalPages({ totalCount: 21, perPage: 10 })).toBe(3);
  });
});

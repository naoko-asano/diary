import { describe, expect, it } from "vitest";

import { formatDate } from ".";

describe("formatDate", () => {
  it("日付が'YYYY/MM/DD'形式で表示される", () => {
    const date = new Date("2025-01-01T00:00:00Z");
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("2025/01/01");
  });
});

export function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    dateStyle: "short",
  });
}

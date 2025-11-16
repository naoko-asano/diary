export function parsePageParam(pageParam?: string): number {
  if (!pageParam) {
    return 1;
  }
  const pageNumber = Number(pageParam);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return 1;
  }
  return pageNumber;
}

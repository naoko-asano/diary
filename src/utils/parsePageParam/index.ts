export function parsePageParam(pageParam: string | undefined): number {
  if (!pageParam) {
    return 1;
  }
  const pageNumber = parseInt(pageParam, 10);
  if (isNaN(pageNumber) || pageNumber < 1) {
    return 1;
  }
  return pageNumber;
}

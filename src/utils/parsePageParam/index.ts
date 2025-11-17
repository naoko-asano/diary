export function parsePageParam(pageParam?: string): number {
  if (!pageParam || /\D/.test(pageParam)) return 1;

  const page = Number(pageParam);
  return page > 1 ? page : 1;
}

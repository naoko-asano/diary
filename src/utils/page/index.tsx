export function computeTotalPages({
  totalCount,
  perPage,
}: {
  totalCount: number;
  perPage: number;
}) {
  return Math.ceil(totalCount / perPage);
}

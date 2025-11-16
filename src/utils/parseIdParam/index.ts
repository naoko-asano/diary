export function parseIdParam(idParam: string): number {
  if (!/^\d+$/.test(idParam)) {
    throw new Error("Invalid id parameter");
  }

  const id = Number(idParam);
  if (id > 0) return id;

  throw new Error("Invalid id parameter");
}

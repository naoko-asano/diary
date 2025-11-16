export function parseIdParam(idParam: string): number {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Invalid id parameter");
  }
  return id;
}

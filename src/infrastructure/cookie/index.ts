import { cookies } from "next/headers";

export interface StoreParams {
  name: string;
  value: string;
  httpOnly?: boolean;
  maxAge?: number;
}

export async function find(name: string): Promise<object | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(name)?.value;
  return cookieValue ? JSON.parse(cookieValue) : null;
}

export async function store(params: StoreParams) {
  const cookieStore = await cookies();
  cookieStore.set(params);
}

export async function remove(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export const cookieRepository = {
  find,
  store,
  remove,
};

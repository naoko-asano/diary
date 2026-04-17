import { cookies as nextCookies } from "next/headers";

async function cookies() {
  return await nextCookies();
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name) ?? null;
}

export async function setCookie(params: {
  name: string;
  value: string;
  httpOnly?: boolean;
  maxAge?: number;
}) {
  const { httpOnly = true, maxAge = 30, ...rest } = params;
  const cookieStore = await cookies();
  cookieStore.set({ httpOnly, maxAge, ...rest });
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

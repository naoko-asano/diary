import { cookies } from "next/headers";

import {
  FLASH_MESSAGE_COOKIE_NAME,
  FlashMessageCookieConfig,
} from "@/features/flashMessage/model";

export async function flashMessageCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(FLASH_MESSAGE_COOKIE_NAME);
}

export async function setFlashMessageCookie(config: FlashMessageCookieConfig) {
  const cookieStore = await cookies();
  cookieStore.set(config);
}

export async function deleteFlashMessageCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(FLASH_MESSAGE_COOKIE_NAME);
}

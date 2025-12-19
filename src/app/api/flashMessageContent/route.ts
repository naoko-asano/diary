import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  FLASH_MESSAGE_COOKIE_NAME,
  resolveFlashMessageContent,
} from "@/features/flashMessage/model";

export async function GET() {
  const cookieStore = await cookies();
  const flashMessageCookie = cookieStore.get(FLASH_MESSAGE_COOKIE_NAME);
  const content = resolveFlashMessageContent(flashMessageCookie);
  if (flashMessageCookie) cookieStore.delete(FLASH_MESSAGE_COOKIE_NAME);

  return NextResponse.json(content);
}

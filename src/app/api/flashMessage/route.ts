import { NextResponse } from "next/server";

import {
  deleteFlashMessageCookie,
  flashMessageCookie,
} from "@/features/flashMessage/gateway/flashMessageCookie";
import { parseFlashMessageCookie } from "@/features/flashMessage/model";

export async function GET() {
  const cookie = await flashMessageCookie();
  if (!cookie) return NextResponse.json(null);

  const flashMessage = parseFlashMessageCookie(cookie);
  await deleteFlashMessageCookie();

  return NextResponse.json(flashMessage);
}

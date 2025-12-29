import { setFlashMessageCookie } from "@/features/flashMessage/gateway/flashMessageCookie";
import { FlashMessage } from "@/features/flashMessage/model";
import { createFlashMessageCookie } from "@/features/flashMessage/usecases/createFlashMessageCookie";

export async function createFlashMessageCookieComposed(
  flashMessage: FlashMessage,
) {
  return await createFlashMessageCookie(flashMessage, {
    write: setFlashMessageCookie,
  });
}

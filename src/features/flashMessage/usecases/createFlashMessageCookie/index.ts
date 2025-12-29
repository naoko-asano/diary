import {
  createFlashMessageCookieConfig,
  FlashMessage,
} from "@/features/flashMessage/model";
import { CookieWriter } from "@/features/flashMessage/usecases/interfaces/CookieWriter";

export async function createFlashMessageCookie(
  flashMessage: FlashMessage,
  writer: CookieWriter,
) {
  const config = createFlashMessageCookieConfig(flashMessage);
  await writer.write(config);
}

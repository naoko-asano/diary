import { FlashMessageCookieConfig } from "@/features/flashMessage/model";

export interface CookieWriter {
  write: (config: FlashMessageCookieConfig) => Promise<void>;
}

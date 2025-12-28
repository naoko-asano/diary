import { FlashMessage } from "@/features/flashMessage/model";

export interface FlashMessageFetcher {
  fetch: () => Promise<FlashMessage | null>;
}

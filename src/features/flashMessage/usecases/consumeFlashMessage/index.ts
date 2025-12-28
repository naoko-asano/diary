import { FlashMessageFetcher } from "@/features/flashMessage/usecases/interfaces/FlashMessageFetcher";
import { FlashMessagePresenter } from "@/features/flashMessage/usecases/interfaces/FlashMessagePresenter";

export async function consumeFlashMessage(
  FlashMessageFetcher: FlashMessageFetcher,
  FlashMessagePresenter: FlashMessagePresenter,
) {
  try {
    const content = await FlashMessageFetcher.fetch();
    if (!content) return;
    FlashMessagePresenter.show(content);
  } catch {
    console.error("Failed to consume flash message");
  }
}

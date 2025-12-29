import { FlashMessageFetcher } from "@/features/flashMessage/usecases/interfaces/FlashMessageFetcher";
import { FlashMessagePresenter } from "@/features/flashMessage/usecases/interfaces/FlashMessagePresenter";

export async function consumeFlashMessage(
  FlashMessageFetcher: FlashMessageFetcher,
  FlashMessagePresenter: FlashMessagePresenter,
) {
  try {
    const flashMessage = await FlashMessageFetcher.fetch();
    if (!flashMessage) return;
    FlashMessagePresenter.show(flashMessage);
  } catch {
    console.error("Failed to consume flash message");
  }
}

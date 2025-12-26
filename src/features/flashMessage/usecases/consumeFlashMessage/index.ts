import { fetchFlashMessageContent } from "@/features/flashMessage/gateway/fetchFlashMessageContent";
import { showFlashMessage } from "@/features/flashMessage/ui/showFlashMessage";

interface Props {
  fetchContent?: typeof fetchFlashMessageContent;
  show?: typeof showFlashMessage;
}

export async function consumeFlashMessage({
  fetchContent = fetchFlashMessageContent,
  show = showFlashMessage,
}: Props = {}) {
  try {
    const content = await fetchContent();
    if (!content) return;
    show(content);
  } catch {
    console.error("Failed to consume flash message");
  }
}

import { fetchFlashMessage } from "@/features/flashMessage/gateway/fetchFlashMessage";
import { showFlashMessage } from "@/features/flashMessage/ui/showFlashMessage";
import { consumeFlashMessage } from "@/features/flashMessage/usecases/consumeFlashMessage";

export async function consumeFlashMessageComposed() {
  return await consumeFlashMessage(
    {
      fetch: fetchFlashMessage,
    },
    {
      show: showFlashMessage,
    },
  );
}

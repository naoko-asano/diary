import { fetchFlashMessage } from "../../gateway/fetchFlashMessage";
import { showFlashMessage } from "../../ui/showFlashMessage";
import { consumeFlashMessage } from "../../usecases/consumeFlashMessage";

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

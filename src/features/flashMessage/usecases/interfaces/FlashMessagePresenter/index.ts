import { FlashMessage } from "@/features/flashMessage/model";

export interface FlashMessagePresenter {
  show: (flashMessage: FlashMessage) => void;
}

import { redirect } from "next/navigation";

import {
  ActionResult,
  ActionResultStatuses,
} from "@/features/actionResult/model";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { createArticle } from "@/features/articles/services";
import { createFlashMessageCookieComposed } from "@/features/flashMessage/composition/createFlashMessageCookieComposed";
import { FlashMessageTypes } from "@/features/flashMessage/model";

export default function Page() {
  const handleSubmit = async (
    _prevResult: ActionResult,
    values: ArticleParams,
  ) => {
    "use server";
    let actionResult: ActionResult;

    try {
      await createArticle(values);
      actionResult = {
        status: ActionResultStatuses.SUCCESS,
        message: "Article created successfully!",
      };
    } catch (error) {
      console.error(error);
      actionResult = {
        status: ActionResultStatuses.ERROR,
        message: "Failed to submit the form.\nPlease try again later.",
      };
    }

    if (actionResult.status === ActionResultStatuses.SUCCESS) {
      await createFlashMessageCookieComposed({
        type: FlashMessageTypes.SUCCESS,
        message: actionResult.message!,
      });
      redirect("/admin/articles");
    }
    return actionResult;
  };
  return <ArticleForm onSubmitAction={handleSubmit} />;
}

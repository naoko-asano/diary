import { redirect } from "next/navigation";

import {
  ActionResult,
  ActionResultStatuses,
} from "@/features/actionResult/model";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { articleRepository } from "@/features/articles/infrastructure/repository";
import { ArticleParams } from "@/features/articles/model";
import { createArticle } from "@/features/articles/usecases";
import { storeNotification } from "@/features/notifications";

export default function Page() {
  const submit = async (_prevResult: ActionResult, values: ArticleParams) => {
    "use server";
    let actionResult: ActionResult;

    try {
      await createArticle({ ...values }, articleRepository);
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
      await storeNotification({
        type: actionResult.status,
        message: actionResult.message,
      });
      redirect("/admin/articles");
    }
    return actionResult;
  };
  return <ArticleForm submitAction={submit} />;
}

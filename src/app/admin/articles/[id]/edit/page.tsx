import { notFound, redirect } from "next/navigation";

import {
  ActionResult,
  ActionResultStatuses,
} from "@/features/actionResult/model";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { findArticleById, updateArticle } from "@/features/articles/services";
import { createFlashMessageCookieComposed } from "@/features/flashMessage/composition/createFlashMessageCookieComposed";
import { parseIdParam } from "@/utils/parseIdParam";

type Props = {
  params: Promise<Params>;
};

type Params = { id: string };

export default async function Page(props: Props) {
  const { id: idParam } = await props.params;

  let id: number;
  try {
    id = parseIdParam(idParam);
  } catch {
    notFound();
  }

  const article = await findArticleById(id);
  if (!article) {
    notFound();
  }

  const handleSubmit = async (
    _prevResult: ActionResult,
    values: ArticleParams,
  ) => {
    "use server";
    let actionResult: ActionResult;

    try {
      await updateArticle({ id, ...values });
      actionResult = {
        status: ActionResultStatuses.SUCCESS,
        message: "Article updated successfully!",
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
        type: actionResult.status,
        message: actionResult.message,
      });
      redirect("/admin/articles");
    }
    return actionResult;
  };
  return <ArticleForm article={article} onSubmitAction={handleSubmit} />;
}

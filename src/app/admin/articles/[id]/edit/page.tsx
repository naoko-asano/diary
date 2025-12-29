import { notFound, redirect } from "next/navigation";

import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { findArticleById, updateArticle } from "@/features/articles/services";
import { createFlashMessageCookieComposed } from "@/features/flashMessage/composition/createFlashMessageCookieComposed";
import { FlashMessageTypes } from "@/features/flashMessage/model";
import { FormResult, FormState } from "@/utils/formState";
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

  const handleSubmit = async (_prevState: FormState, values: ArticleParams) => {
    "use server";
    let formState: FormState;

    try {
      await updateArticle({ id, ...values });
      formState = { result: FormResult.SUCCESS };
    } catch (error) {
      console.error(error);
      formState = { result: FormResult.ERROR };
    }

    if (formState.result === FormResult.SUCCESS) {
      await createFlashMessageCookieComposed({
        type: FlashMessageTypes.SUCCESS,
        message: "Article updated successfully!",
      });
      redirect("/admin/articles");
    }
    return formState;
  };
  return <ArticleForm article={article} onSubmitAction={handleSubmit} />;
}

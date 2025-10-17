import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { findArticleById, updateArticle } from "@/features/articles/services";
import { createFlashMessageCookieConfig } from "@/utils/flashMessage";
import { FormResult, FormState } from "@/utils/formState";

type Props = {
  params: Promise<Params>;
};

type Params = { id: string };

async function setFlashMessageCookie() {
  const config = createFlashMessageCookieConfig({
    type: "success",
    message: "Article updated successfully!",
  });
  (await cookies()).set(config);
}

export default async function Page(props: Props) {
  const { id: stringifiedId } = await props.params;
  const id = Number(stringifiedId);
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
      await setFlashMessageCookie();
      redirect("/admin/articles");
    }
    return formState;
  };
  return <ArticleForm article={article} onSubmitAction={handleSubmit} />;
}

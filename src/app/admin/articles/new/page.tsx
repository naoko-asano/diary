import { redirect } from "next/navigation";

import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { createArticle } from "@/features/articles/services";
import { createFlashMessageCookieComposed } from "@/features/flashMessage/composition/createFlashMessageCookieComposed";
import { FlashMessageTypes } from "@/features/flashMessage/model";
import { FormResult, FormState } from "@/utils/formState";

export default function Page() {
  const handleSubmit = async (_prevState: FormState, values: ArticleParams) => {
    "use server";
    let formState: FormState;

    try {
      await createArticle(values);
      formState = { result: FormResult.SUCCESS };
    } catch (error) {
      console.error(error);
      formState = { result: FormResult.ERROR };
    }

    if (formState.result === FormResult.SUCCESS) {
      await createFlashMessageCookieComposed({
        type: FlashMessageTypes.SUCCESS,
        message: "Article created successfully!",
      });
      redirect("/admin/articles");
    }
    return formState;
  };
  return <ArticleForm onSubmitAction={handleSubmit} />;
}

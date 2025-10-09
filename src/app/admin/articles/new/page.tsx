import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { createArticle } from "@/features/articles/services";
import { FormResult, FormState } from "@/utils/formState";

// TODO: flashMessage用のutilsを作成する
async function setFlashMessageCookie() {
  "use server";
  (await cookies()).set(
    "flash-message",
    JSON.stringify({
      type: "success",
      message: "Article created successfully!",
    }),
    {
      httpOnly: false,
      maxAge: 1,
    },
  );
}

export default function Page() {
  const handleSubmit = async (_prevState: FormState, values: ArticleParams) => {
    "use server";
    let formState: FormState;

    try {
      await createArticle(values);
      formState = { result: FormResult.SUCCESS };
    } catch (error) {
      console.error("Failed to create article:", error);
      formState = { result: FormResult.ERROR };
    }

    if (formState.result === FormResult.SUCCESS) {
      await setFlashMessageCookie();
      redirect("/admin/articles");
    }
    return formState;
  };
  return <ArticleForm onSubmitAction={handleSubmit} />;
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { createArticle } from "@/features/articles/services";
import { createFlashMessageCookieConfig } from "@/utils/flashMessage";
import { FormResult, FormState } from "@/utils/formState";

async function setFlashMessageCookie() {
  const config = createFlashMessageCookieConfig({
    type: "success",
    message: "Article created successfully!",
  });
  (await cookies()).set(config);
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

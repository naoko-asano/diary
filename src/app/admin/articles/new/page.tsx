import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { createArticle } from "@/features/articles/services";

type FormState = {
  hasError: boolean;
} | null;

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
    let hasError: boolean;
    try {
      await createArticle(values);
      hasError = false;
    } catch (error) {
      console.error("Failed to create article:", error);
      hasError = true;
    }

    if (!hasError) {
      await setFlashMessageCookie();
      redirect("/admin/articles");
    }
    return { hasError };
  };
  return <ArticleForm onSubmitAction={handleSubmit} />;
}

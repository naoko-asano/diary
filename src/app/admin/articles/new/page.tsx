import { redirect } from "next/navigation";

import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { createArticle } from "@/features/articles/services";

type FormState = {
  hasError: boolean;
} | null;

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
      redirect("/admin/articles");
    }
    return { hasError };
  };
  return <ArticleForm onSubmitAction={handleSubmit} />;
}

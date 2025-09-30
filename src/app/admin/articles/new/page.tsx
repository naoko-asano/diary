import { redirect } from "next/navigation";

import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { ArticleParams } from "@/features/articles/model";
import { createArticle } from "@/features/articles/services";

export default function Page() {
  const handleSubmit = async (values: ArticleParams) => {
    "use server";
    await createArticle(values);
    redirect("/admin/articles");
  };
  return <ArticleForm onSubmitAction={handleSubmit} />;
}

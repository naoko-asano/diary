import { notFound } from "next/navigation";

import { ArticleDetails } from "@/features/articles/components/ArticleDetails";
import { findArticleById } from "@/features/articles/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await findArticleById(Number(id));

  if (!article) {
    notFound();
  }

  return <ArticleDetails article={article} />;
}

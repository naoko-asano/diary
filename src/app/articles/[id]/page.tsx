import { notFound } from "next/navigation";

import { ArticleDetails } from "@/features/articles/components/ArticleDetails";
import { findArticleById } from "@/features/articles/services";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: stringifiedId } = await params;
  const id = parseInt(stringifiedId);
  if (isNaN(id)) notFound();

  const article = await findArticleById(id);
  if (!article) {
    notFound();
  }

  return <ArticleDetails article={article} />;
}

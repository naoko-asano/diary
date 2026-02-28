import { notFound } from "next/navigation";

import { ArticleDetails } from "@/features/articles/components/ArticleDetails";
import { articleRepository } from "@/features/articles/infrastructure/repository";
import { isDraft } from "@/features/articles/model";
import { findArticle } from "@/features/articles/usecases";
import { parseIdParam } from "@/utils/parseIdParam";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  let id: number;
  try {
    id = parseIdParam(idParam);
  } catch {
    notFound();
  }

  const article = await findArticle({ id }, articleRepository);
  if (!article || isDraft(article)) {
    notFound();
  }

  return <ArticleDetails article={article} />;
}

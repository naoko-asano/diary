import { notFound } from "next/navigation";

import { ArticleDetails } from "@/features/articles/components/ArticleDetails";
import { findArticleById } from "@/features/articles/services";
import { Status } from "@/generated/prisma";
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

  const article = await findArticleById(id);
  if (!article || article.status === Status.DRAFT) {
    notFound();
  }

  return <ArticleDetails article={article} />;
}

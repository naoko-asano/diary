import { revalidatePath } from "next/cache";

import { ArticleTable } from "@/features/articles/components/ArticleTable";
import { deleteArticle } from "@/features/articles/services";
import prisma from "@/lib/database";

export default async function Page() {
  const articles = await prisma.article.findMany();
  async function handleDelete(id: number) {
    "use server";
    await deleteArticle(id);
    revalidatePath("/admin/articles");
  }
  return <ArticleTable articles={articles} onDeleteAction={handleDelete} />;
}

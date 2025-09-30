import { revalidatePath } from "next/cache";

import { ArticleList } from "@/features/articles/components/ArticleList";
import { deleteArticle } from "@/features/articles/services";
import prisma from "@/lib/database";

export default async function Page() {
  const articles = await prisma.article.findMany();
  async function handleDelete(id: number) {
    "use server";
    await deleteArticle(id);
    revalidatePath("/admin/articles");
  }
  return <ArticleList articles={articles} onDeleteAction={handleDelete} />;
}

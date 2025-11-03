import { ArticleParams } from "@/features/articles/model";
import prisma from "@/lib/database";

export async function createArticle(articleParams?: ArticleParams) {
  const count = await prisma.article.count();
  await prisma.article.create({
    data: {
      title: articleParams?.title ?? `title${count + 1}`,
      body: articleParams?.body ?? `body${count + 1}`,
      date: articleParams?.date ?? new Date(),
    },
  });
}

export async function resetArticles() {
  await prisma.article.deleteMany({});
}

export async function seedArticles(count: number = 1) {
  for (let i = 0; i < count; i++) {
    await createArticle();
  }
}

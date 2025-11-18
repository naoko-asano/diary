import { Status } from "@/features/articles/model";
import { ArticleParams } from "@/features/articles/model";
import prisma from "@/lib/database";

export async function createArticle(articleParams?: ArticleParams) {
  const count = await prisma.article.count();
  await prisma.article.create({
    data: {
      title: articleParams?.title ?? `title${count + 1}`,
      body: articleParams?.body ?? `body${count + 1}`,
      date: articleParams?.date ?? new Date("2025-01-01"),
      status: articleParams?.status ?? Status.PUBLISHED,
    },
  });
}

export async function resetArticles() {
  await prisma.article.deleteMany({});
}

export async function seedArticles(count: number = 1) {
  const baseDate = new Date("2025-01-01");
  for (let i = 0; i < count; i++) {
    await createArticle({
      title: `title${i + 1}`,
      body: `body${i + 1}`,
      date: new Date(baseDate.setDate(baseDate.getDate() + i)),
      status: Status.PUBLISHED,
    });
  }
}

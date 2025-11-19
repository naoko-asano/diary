import { Status } from "@/features/articles/model";
import { ArticleParams } from "@/features/articles/model";
import prisma from "@/lib/database";

async function createArticle(articleParams?: Partial<ArticleParams>) {
  const { title, body, date, status } = articleParams ?? {};

  const count = await prisma.article.count();
  await prisma.article.create({
    data: {
      title: title ?? `title${count + 1}`,
      body: body ?? `body${count + 1}`,
      date: date ?? new Date("2025-01-01"),
      status: status ?? Status.PUBLISHED,
    },
  });
}

export async function resetArticles() {
  await prisma.article.deleteMany({});
}

export async function seedArticles({
  count = 1,
  articles = [],
}: {
  count?: number;
  articles?: Partial<ArticleParams>[];
} = {}) {
  const baseDate = new Date("2025-01-01");

  for (let i = 0; i < count; i++) {
    const article = articles?.[i];
    await createArticle({
      title: article?.title,
      body: article?.body,
      date: article?.date ?? new Date(baseDate.setDate(baseDate.getDate() + i)),
      status: article?.status ?? Status.PUBLISHED,
    });
  }
}

export async function fetchFirstArticleId() {
  const firstArticle = await prisma.article.findFirst();
  return firstArticle?.id;
}

export async function fetchLastArticleId() {
  const lastArticle = await prisma.article.findFirst({
    orderBy: { id: "desc" },
  });
  return lastArticle?.id;
}

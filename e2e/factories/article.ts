import { Status } from "@/features/articles/model";
import { ArticleParams } from "@/features/articles/model";
import prisma from "@/lib/database";

async function createArticle(articleParams?: Partial<ArticleParams>) {
  const { title, body, date, status, featuredImageUrl } = articleParams ?? {};

  const count = await prisma.article.count();
  await prisma.article.create({
    data: {
      title: title ?? `title${count + 1}`,
      body: body ?? `body${count + 1}`,
      date: date ?? new Date("2025-01-01"),
      status: status ?? Status.PUBLISHED,
      featuredImageUrl,
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
    const { title, body, date, status, featuredImageUrl } = article ?? {};
    const defaultDate = new Date(baseDate);
    defaultDate.setDate(baseDate.getDate() + i);

    await createArticle({
      title,
      body,
      date: date ?? defaultDate,
      status,
      featuredImageUrl,
    });
  }
}

export async function fetchLatestArticleId() {
  const latestArticle = await prisma.article.findFirst({
    orderBy: { id: "desc" },
  });
  return latestArticle?.id;
}

import { Article } from "@/generated/prisma";
import prisma from "@/lib/database";

export async function createArticle(article?: Pick<Article, "title" | "body">) {
  const count = await prisma.article.count();
  await prisma.article.create({
    data: {
      title: article?.title ?? `title${count + 1}`,
      body: article?.body ?? `body${count + 1}`,
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

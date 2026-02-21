"use server";

import { ArticleParams } from "@/features/articles/model";
import prisma from "@/lib/database";

export async function getPaginatedArticles(params: {
  page: number;
  perPage?: number;
  conditions?: Partial<ArticleParams>;
}) {
  const { page, perPage = 15, conditions } = params;
  try {
    const articles = await prisma.article.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { date: "desc" },
      where: { ...conditions },
    });
    const total = await prisma.article.count({ where: { ...conditions } });
    return { articles, totalPage: Math.ceil(total / perPage) };
  } catch (error) {
    throw new Error("Failed to get paginated articles\n" + error);
  }
}

export async function findArticleById(id: number) {
  return await prisma.article.findUnique({
    where: { id },
  });
}

export async function createArticle(params: ArticleParams) {
  return await prisma.article.create({
    data: {
      ...params,
    },
  });
}

export async function updateArticle(params: { id: number } & ArticleParams) {
  const { id, title, body, featuredImageUrl, date, status } = params;
  return await prisma.article.update({
    where: { id },
    data: {
      title,
      body,
      featuredImageUrl,
      date,
      status,
    },
  });
}

export async function deleteArticle(id: number) {
  return await prisma.article.delete({
    where: { id },
  });
}

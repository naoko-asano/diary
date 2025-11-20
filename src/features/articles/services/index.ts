"use server";

import { ArticleParams, validateArticle } from "@/features/articles/model";
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
  try {
    return await prisma.article.findUnique({
      where: { id },
    });
  } catch (error) {
    throw new Error("Failed to find article\n" + error);
  }
}

export async function createArticle(params: ArticleParams) {
  try {
    validateArticle(params);
    return await prisma.article.create({
      data: {
        ...params,
      },
    });
  } catch (error) {
    throw new Error("Failed to create article\n" + error);
  }
}

export async function updateArticle(params: { id: number } & ArticleParams) {
  const { id, title, body, date, status } = params;
  validateArticle(params);
  try {
    return await prisma.article.update({
      where: { id },
      data: {
        title,
        body,
        date,
        status,
      },
    });
  } catch (error) {
    throw new Error("Failed to update article\n" + error);
  }
}

export async function deleteArticle(id: number) {
  try {
    return await prisma.article.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error("Failed to delete article\n" + error);
  }
}

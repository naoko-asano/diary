"use server";

import prisma from "@/lib/database";

import { validateArticle } from "../model";

export async function findArticleById(id: number) {
  try {
    return await prisma.article.findUnique({
      where: { id },
    });
  } catch (error) {
    throw new Error("Failed to find article\n" + error);
  }
}

export async function createArticle(params: { title: string; body: string }) {
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

export async function updateArticle(params: {
  id: number;
  title: string;
  body: string;
}) {
  validateArticle(params);
  try {
    return await prisma.article.update({
      where: { id: params.id },
      data: {
        title: params.title,
        body: params.body,
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

"use server";

import prisma from "@/lib/database";

import { validateArticle } from "./model";

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

export async function deleteArticle(id: number) {
  try {
    return await prisma.article.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error("Failed to delete article\n" + error);
  }
}

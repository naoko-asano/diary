"use server";

import prisma from "@/lib/database";

export async function createArticle(params: { title: string; body: string }) {
  const { title, body } = params;
  try {
    return await prisma.article.create({
      data: {
        title,
        body,
      },
    });
  } catch (error) {
    throw new Error("Failed to create article: " + error);
  }
}

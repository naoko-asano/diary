import { ArticleParams } from "@/features/articles/model";
import prisma from "@/lib/database";

async function find(id: number) {
  return await prisma.article.findUnique({
    where: { id },
  });
}
async function findManyWithPagination(params: {
  currentPage: number;
  perPage: number;
  orderBy?: { [key in keyof ArticleParams]?: "asc" | "desc" };
  conditions?: Partial<ArticleParams>;
}) {
  const { currentPage, perPage, orderBy, conditions } = params;
  const articles = await prisma.article.findMany({
    skip: (currentPage - 1) * perPage,
    take: perPage,
    orderBy,
    where: { ...conditions },
  });
  const totalCount = await prisma.article.count({
    where: { ...conditions },
  });
  return { articles, totalCount };
}

export async function create(params: ArticleParams) {
  return await prisma.article.create({
    data: {
      ...params,
    },
  });
}

export async function update(params: ArticleParams & { id: number }) {
  const { id, ...updateParams } = params;
  return await prisma.article.update({
    where: { id },
    data: {
      ...updateParams,
    },
  });
}

export async function remove(id: number) {
  return await prisma.article.delete({
    where: { id },
  });
}

export const articleRepository = {
  find,
  findManyWithPagination,
  create,
  update,
  remove,
} as const;

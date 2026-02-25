import { Article, ArticleParams } from "@/features/articles/model";
import prisma from "@/lib/database";
import { OrderByParams } from "@/utils/orderBy";

async function find(id: number) {
  return await prisma.article.findUnique({
    where: { id },
  });
}

export async function listWithCount(params: {
  currentPage: number;
  perPage: number;
  orderBy?: OrderByParams<Article>;
  conditions?: Partial<ArticleParams>;
}) {
  const { currentPage, perPage, orderBy, conditions } = params;
  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      skip: (currentPage - 1) * perPage,
      take: perPage,
      orderBy,
      where: { ...conditions },
    }),
    prisma.article.count({
      where: { ...conditions },
    }),
  ]);
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
  listWithCount,
  create,
  update,
  remove,
} as const;

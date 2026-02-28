import { ORDER_BY_VALUES, OrderByParams } from "@/utils/orderBy";

import { Article, ArticleParams, validateArticle } from "../model";

import { ArticleRepository } from "./types/repository";

interface UpdateParams extends ArticleParams {
  id: number;
}

export async function findArticle(
  params: { id: number },
  repository: ArticleRepository,
) {
  return await repository.find(params.id);
}

export async function findPaginatedArticles(
  params: {
    currentPage: number;
    perPage: number;
    orderBy?: OrderByParams<Article>;
    conditions?: Partial<ArticleParams>;
  },
  repository: ArticleRepository,
) {
  const {
    currentPage = 1,
    orderBy = { date: ORDER_BY_VALUES.DESC },
    ...otherParams
  } = params;
  return await repository.listWithCount({
    currentPage,
    orderBy,
    ...otherParams,
  });
}

export async function createArticle(
  articleParams: ArticleParams,
  repository: ArticleRepository,
) {
  validateArticle(articleParams);
  await repository.create(articleParams);
}

export async function updateArticle(
  params: UpdateParams,
  repository: ArticleRepository,
) {
  const article = await findArticle({ id: params.id }, repository);
  if (!article) throw new Error("Article not found");

  validateArticle(params);
  await repository.update(params);
}

export async function deleteArticle(
  params: { id: number },
  repository: ArticleRepository,
) {
  const { id } = params;
  const article = await findArticle({ id }, repository);
  if (!article) throw new Error("Article not found");
  await repository.remove(id);
}

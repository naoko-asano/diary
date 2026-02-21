import { Article, ArticleParams, validateArticle } from "../../model";

interface ArticleCreator {
  createArticle: (params: ArticleParams) => Promise<Article | null>;
}

interface ArticleUpdater {
  updateArticle: (
    params: { id: number } & ArticleParams,
  ) => Promise<Article | null>;
}

interface editParams extends ArticleParams {
  id: number;
}

export async function registerArticle(
  articleParams: ArticleParams,
  creator: ArticleCreator,
) {
  validateArticle(articleParams);
  return await creator.createArticle(articleParams);
}

export async function editArticle(params: editParams, updater: ArticleUpdater) {
  validateArticle(params);
  return await updater.updateArticle(params);
}

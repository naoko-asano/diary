import { Article, ArticleParams } from "../../model";

export interface ArticleRepository {
  find: (id: number) => Promise<Article | null>;
  create: (params: ArticleParams) => Promise<void>;
  update: (params: ArticleParams & { id: number }) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

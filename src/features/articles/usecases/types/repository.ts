import { OrderByParams } from "@/utils/orderBy";

import { Article, ArticleParams } from "../../model";

export interface ArticleRepository {
  find: (id: number) => Promise<Article | null>;
  listWithCount: (params: {
    currentPage: number;
    perPage: number;
    orderBy?: OrderByParams<Article>;
    conditions?: Partial<ArticleParams>;
  }) => Promise<{ articles: Article[]; totalCount: number }>;
  create: (params: ArticleParams) => Promise<void>;
  update: (params: ArticleParams & { id: number }) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

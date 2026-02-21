import {
  Statuses as ArticleStatuses,
  validateArticle,
} from "@/features/articles/model";

import { editArticle, registerArticle } from ".";

vi.mock("@/features/articles/model");
const mockedValidateArticle = vi.mocked(validateArticle);

describe("registerArticle", () => {
  it("validateArticlesとarticleCreator.createArticleが呼ばれること", async () => {
    const params = {
      title: "title",
      body: "body",
      date: new Date(),
      status: ArticleStatuses.DRAFT,
      featuredImageUrl: null,
    };
    const articleCreator = {
      createArticle: vi.fn(),
    };

    await registerArticle(params, articleCreator);

    expect(mockedValidateArticle).toHaveBeenCalledWith(params);
    expect(articleCreator.createArticle).toHaveBeenCalledWith(params);
  });
});

describe("editArticle", () => {
  it("validateArticlesとarticleUpdater.updateArticleが呼ばれること", async () => {
    const params = {
      id: 1,
      title: "title",
      body: "body",
      date: new Date(),
      status: ArticleStatuses.DRAFT,
      featuredImageUrl: null,
    };
    const articleUpdater = {
      updateArticle: vi.fn(),
    };

    await editArticle(params, articleUpdater);
    expect(mockedValidateArticle).toHaveBeenCalledWith(params);
    expect(articleUpdater.updateArticle).toHaveBeenCalledWith(params);
  });
});

import { Statuses } from "@/features/articles/model";
import { OrderByValues } from "@/utils/orderBy";

import { ArticleRepository } from "./types/repository";

import {
  createArticle,
  deleteArticle,
  findArticle,
  findPaginatedArticles,
  updateArticle,
} from ".";

const validArticleParams = {
  title: "title",
  body: "body",
  date: new Date(),
  status: Statuses.DRAFT,
  featuredImageUrl: null,
};

const baseArticle = {
  id: 1,
  ...validArticleParams,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const baseRepository: ArticleRepository = {
  find: async () => null,
  listWithCount: async () => ({ articles: [], totalCount: 0 }),
  create: async () => ({ ...baseArticle }),
  update: async () => ({ ...baseArticle }),
  remove: async () => ({ ...baseArticle }),
};

describe("記事の取得", () => {
  it("記事が存在する場合、記事を返す", async () => {
    const params = { id: 1 };
    const storedArticle = {
      ...baseArticle,
    };
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(storedArticle),
    };

    const article = await findArticle(params, repository);

    expect(article).toEqual(storedArticle);
    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(repository.find).toHaveBeenCalledWith(params.id);
  });

  it("記事が存在しない場合、nullを返す", async () => {
    const params = { id: 1 };
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(null),
    };

    await expect(findArticle(params, repository)).resolves.toBeNull();
    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(repository.find).toHaveBeenCalledWith(params.id);
  });
});

describe("記事の一覧取得", () => {
  it("条件に合致した記事と記事数が取得できる", async () => {
    const params = {
      currentPage: 1,
      perPage: 10,
      orderBy: { date: OrderByValues.ASC },
      conditions: { title: "title" },
    };
    const storedArticle = {
      ...baseArticle,
    };
    const repository = {
      ...baseRepository,
      listWithCount: vi.fn(() =>
        Promise.resolve({ articles: [storedArticle], totalCount: 1 }),
      ),
    };

    const result = await findPaginatedArticles(params, repository);

    expect(result).toEqual({ articles: [storedArticle], totalCount: 1 });
    expect(repository.listWithCount).toHaveBeenCalledTimes(1);
    expect(repository.listWithCount).toHaveBeenCalledWith({
      ...params,
      orderBy: { date: "asc" },
    });
  });

  it("orderByが指定されていない場合、日付の降順で取得する", async () => {
    const params = {
      currentPage: 1,
      perPage: 10,
      conditions: { title: "title" },
    };
    const storedArticle = {
      ...baseArticle,
    };
    const repository = {
      ...baseRepository,
      listWithCount: vi.fn(() =>
        Promise.resolve({ articles: [storedArticle], totalCount: 1 }),
      ),
    };

    await findPaginatedArticles(params, repository);

    expect(repository.listWithCount).toHaveBeenCalledTimes(1);
    expect(repository.listWithCount).toHaveBeenCalledWith({
      ...params,
      orderBy: { date: "desc" },
    });
  });

  it("conditionsが指定されていない場合、undefinedが渡される", async () => {
    const params = {
      currentPage: 1,
      perPage: 10,
    };
    const storedArticle = {
      ...baseArticle,
    };
    const repository = {
      ...baseRepository,
      listWithCount: vi.fn(() =>
        Promise.resolve({ articles: [storedArticle], totalCount: 1 }),
      ),
    };

    await findPaginatedArticles(params, repository);

    expect(repository.listWithCount).toHaveBeenCalledTimes(1);
    expect(repository.listWithCount).toHaveBeenCalledWith({
      ...params,
      orderBy: { date: "desc" },
      conditions: undefined,
    });
  });
});

describe("記事の登録", () => {
  it("記事として有効なパラメータが渡された場合、登録される", async () => {
    const params = {
      ...validArticleParams,
    };
    const repository = {
      ...baseRepository,
      find: vi.fn(),
      create: vi.fn(),
    };

    await createArticle(params, repository);

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith(params);
  });

  it("記事として無効なパラメータが渡された場合、エラーになる", async () => {
    const params = {
      ...validArticleParams,
      title: "",
    };
    const repository = {
      ...baseRepository,
      find: vi.fn(),
      create: vi.fn(),
    };

    await expect(createArticle(params, repository)).rejects.toThrow();
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe("記事の更新", () => {
  it("記事として有効なパラメータが渡された場合、更新される", async () => {
    const params = {
      ...validArticleParams,
      id: 1,
      title: "updated title",
      body: "updated body",
    };
    const storedArticle = {
      ...baseArticle,
    };
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(storedArticle),
      update: vi.fn(),
    };

    await updateArticle(params, repository);

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(params);
  });

  it("記事が存在しない場合、エラーをスローする", async () => {
    const params = {
      ...validArticleParams,
      id: 1,
      title: "updated title",
      body: "updated body",
    };
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(null),
      update: vi.fn(),
    };

    await expect(updateArticle(params, repository)).rejects.toThrow();
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("記事として無効なパラメータが渡された場合、エラーをスローする", async () => {
    const params = {
      ...validArticleParams,
      id: 1,
      title: "",
    };
    const storedArticle = {
      ...baseArticle,
    };
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(storedArticle),
      update: vi.fn(),
    };

    await expect(updateArticle(params, repository)).rejects.toThrow();
    expect(repository.update).not.toHaveBeenCalled();
  });
});

describe("記事の削除", () => {
  it("記事が存在する場合、削除される", async () => {
    const params = { id: 1 };
    const storedArticle = {
      ...baseArticle,
    };
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(storedArticle),
      remove: vi.fn(),
    };

    await deleteArticle(params, repository);

    expect(repository.remove).toHaveBeenCalledTimes(1);
    expect(repository.remove).toHaveBeenCalledWith(params.id);
  });

  it("記事が存在しない場合、エラーをスローする", async () => {
    const params = { id: 1 };
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(null),
      remove: vi.fn(),
    };

    await expect(deleteArticle(params, repository)).rejects.toThrow();
    expect(repository.remove).not.toHaveBeenCalled();
  });
});

import { Center, Grid, GridCol } from "@mantine/core";

import { Pagination } from "@/components/Pagination";
import { ArticleCard } from "@/features/articles/components/ArticleCard";
import { articleRepository } from "@/features/articles/infrastructure/repository";
import { STATUSES as ArticleStatuses } from "@/features/articles/model";
import { findPaginatedArticles } from "@/features/articles/usecases";
import { computeTotalPages } from "@/utils/page";
import { parsePageParam } from "@/utils/parsePageParam";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const ARTICLES_PER_PAGE = 15;

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const page = parsePageParam(searchParams.page);
  const { articles, totalCount } = await findPaginatedArticles(
    {
      currentPage: page,
      perPage: ARTICLES_PER_PAGE,
      conditions: { status: ArticleStatuses.PUBLISHED },
    },
    articleRepository,
  );

  return (
    <>
      <Grid style={{ flex: 1 }}>
        {articles.map((article, index) => (
          <GridCol key={article.id} span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
            <ArticleCard
              article={article}
              imageProps={{ loading: index === 0 ? "eager" : "lazy" }}
            />
          </GridCol>
        ))}
      </Grid>
      <Center mt="md">
        <Pagination
          activePage={page}
          total={computeTotalPages({ totalCount, perPage: ARTICLES_PER_PAGE })}
        />
      </Center>
    </>
  );
}

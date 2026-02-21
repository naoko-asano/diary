import { Center, Grid, GridCol } from "@mantine/core";

import { Pagination } from "@/components/Pagination";
import { ArticleCard } from "@/features/articles/components/ArticleCard";
import { getPaginatedArticles } from "@/features/articles/gateway";
import { Statuses as ArticleStatuses } from "@/features/articles/model";
import { parsePageParam } from "@/utils/parsePageParam";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const page = parsePageParam(searchParams.page);
  const { articles, totalPage } = await getPaginatedArticles({
    page,
    conditions: { status: ArticleStatuses.PUBLISHED },
  });

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
        <Pagination activePage={page} total={totalPage} />
      </Center>
    </>
  );
}

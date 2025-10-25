import { Center, Grid, GridCol, Title } from "@mantine/core";

import { Pagination } from "@/components/Pagination";
import { getPaginatedArticles } from "@/features/articles/services";
import { parsePageParam } from "@/utils/parsePageParam";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const page = parsePageParam(searchParams.page);
  const { articles, totalPage } = await getPaginatedArticles({ page });

  return (
    <>
      <Grid style={{ flex: 1 }}>
        {articles.map((article) => (
          <GridCol key={article.id} span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
            <Title order={2} size={"sm"}>
              {article.title}
            </Title>
          </GridCol>
        ))}
      </Grid>
      <Center>
        <Pagination total={totalPage} />
      </Center>
    </>
  );
}

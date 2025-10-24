import { Grid, GridCol, Title } from "@mantine/core";

import { getPaginatedArticles } from "@/features/articles/services";

export default async function Page() {
  const { articles } = await getPaginatedArticles({ page: 1 });
  return (
    <Grid>
      {articles.map((article) => (
        <GridCol key={article.id} span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
          <Title order={2} size={"sm"}>
            {article.title}
          </Title>
        </GridCol>
      ))}
    </Grid>
  );
}

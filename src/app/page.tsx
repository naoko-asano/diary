import { Grid, GridCol, Title } from "@mantine/core";

import { getAllArticles } from "@/features/articles/services";

export default async function Page() {
  const articles = await getAllArticles();
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

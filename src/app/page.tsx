import { Grid, GridCol, Title } from "@mantine/core";

import prisma from "@/lib/database";

export default async function Page() {
  const articles = await prisma.article.findMany();
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

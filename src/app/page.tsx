import { Center, Container, Grid, GridCol, Title } from "@mantine/core";

import prisma from "@/lib/database";

export default async function Page() {
  const articles = await prisma.article.findMany();
  return (
    <Container
      fluid
      mx={{ base: "md", xs: "md", sm: "lg", lg: "xl" }}
      my={{ base: "sm", xs: "sm", sm: "md", lg: "lg" }}
    >
      <Center mb={{ base: "sm", xs: "sm", sm: "md", lg: "lg" }}>
        <Title order={1}>Diary</Title>
      </Center>
      <Grid>
        {articles.map((article) => (
          <GridCol key={article.id} span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
            <h2>{article.title}</h2>
          </GridCol>
        ))}
      </Grid>
    </Container>
  );
}

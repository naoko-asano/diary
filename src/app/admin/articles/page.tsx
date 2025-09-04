import { Button, Group, Stack, Title } from "@mantine/core";
import React from "react";

import prisma from "@/lib/database";

export default async function Page() {
  const articles = await prisma.article.findMany();
  return (
    <Stack>
      {articles.map((article) => (
        <Group key={article.id}>
          <Title order={2} size={"sm"}>
            {article.title}
          </Title>
          <Button size="xs">Edit</Button>
        </Group>
      ))}
    </Stack>
  );
}

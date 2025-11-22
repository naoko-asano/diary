"use client";

import { Box, Paper, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

import { Article, resolveFeaturedImage } from "@/features/articles/model";
import { formatDate } from "@/utils/date";

import styles from "./styles.module.css";

type Props = {
  article: Article;
};

export function ArticleCard(props: Props) {
  const { article } = props;

  return (
    <Paper
      component={Link}
      href={`/articles/${article.id}`}
      p="sm"
      className={styles.articleCard}
      bg="var(--mantine-color-default)"
    >
      <Box mb="sm" style={{ display: "flex", justifyContent: "center" }}>
        <Image
          src={resolveFeaturedImage(article)}
          alt={article.title}
          width={200}
          height={200}
          style={{ textAlign: "center", stroke: "pink" }}
        />
      </Box>
      <Text size="sm">{article.title}</Text>
      <Text size="xs" c="dimmed">
        {formatDate(article.date)}
      </Text>
    </Paper>
  );
}

"use client";

import { Paper, Text } from "@mantine/core";
import Link from "next/link";

import { Article } from "@/features/articles/model";

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
    >
      <Text size="sm">{article.title}</Text>
    </Paper>
  );
}

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

const contentWidth = 180;

export function ArticleCard(props: Props) {
  const { article } = props;

  return (
    <Paper
      component={Link}
      href={`/articles/${article.id}`}
      className={styles.articleCard}
      bg="var(--mantine-color-default)"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--mantine-spacing-xs)",
      }}
      py="sm"
    >
      <Image
        src={resolveFeaturedImage(article)}
        alt={article.title}
        width={contentWidth}
        height={contentWidth}
      />
      <Box style={{ width: contentWidth, textAlign: "left" }}>
        <Text size="sm" truncate>
          {article.title}
        </Text>
        <Text size="xs" c="dimmed">
          {formatDate(article.date)}
        </Text>
      </Box>
    </Paper>
  );
}

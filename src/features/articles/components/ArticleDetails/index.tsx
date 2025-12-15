import { Box, Divider, Text, Title } from "@mantine/core";
import Image from "next/image";
import Markdown from "react-markdown";

import { Article } from "@/features/articles/model";
import { formatDate } from "@/utils/date";

import styles from "./styles.module.css";

type Props = {
  article: Article;
};

export function ArticleDetails(props: Props) {
  const { article } = props;
  return (
    <>
      {article.featuredImageUrl && (
        <Box mb="sm" ta="center" pos="relative" h={400}>
          <Image
            src={article.featuredImageUrl}
            alt={article.title}
            fill
            style={{ objectFit: "contain" }}
            loading="eager"
            sizes="80vw "
          />
        </Box>
      )}
      <Title order={2} size={"md"}>
        {article.title}
      </Title>
      <Divider mb="sm" />
      <Text size="xs" ta="right">
        {formatDate(article.date)}
      </Text>
      <Box fz="sm" className={styles.markdown} mt="sm">
        <Markdown>{article.body}</Markdown>
      </Box>
    </>
  );
}

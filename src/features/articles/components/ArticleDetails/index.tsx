import { Box, Divider, Title } from "@mantine/core";
import Markdown from "react-markdown";

import { Article } from "../../model";

type Props = {
  article: Article;
};

export function ArticleDetails(props: Props) {
  const { article } = props;
  return (
    <div>
      <Title order={2} size={"md"}>
        {article.title}
      </Title>
      <Divider mb="sm" />
      <Box fz="sm" className="markdown">
        <Markdown>{article.body}</Markdown>
      </Box>
    </div>
  );
}

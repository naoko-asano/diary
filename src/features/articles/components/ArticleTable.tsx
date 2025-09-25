"use client";

import {
  Button,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";

type Props = {
  articles: { id: number; title: string }[];
  onDeleteAction: (id: number) => void;
};

export function ArticleTable({ articles, onDeleteAction }: Props) {
  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh>Title</TableTh>
        </TableTr>
      </TableThead>
      {articles.map((article) => (
        <TableTbody key={article.id}>
          <TableTr>
            <TableTd>{article.title}</TableTd>
            <TableTd>
              <Button size="xs">Edit</Button>
            </TableTd>
            <TableTd>
              <Button
                size="xs"
                color="red"
                onClick={() => onDeleteAction(article.id)}
              >
                Delete
              </Button>
            </TableTd>
          </TableTr>
        </TableTbody>
      ))}
    </Table>
  );
}
